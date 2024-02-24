"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_cors import CORS
from api.utils import APIException, generate_sitemap
from api.routes import api
from api.models import db, User, Post
from datetime import datetime
from api.admin import setup_admin
from api.commands import setup_commands
from werkzeug.security import generate_password_hash,check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity 


ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')

app = Flask(__name__)
app.url_map.strict_slashes = False

db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['JWT_SECRET_KEY'] = os.environ.get('JWT')
jwt = JWTManager(app)

MIGRATE = Migrate(app, db, compare_type=True)

jwt = JWTManager(app)
db.init_app(app)
CORS(app)
setup_admin(app)
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/register', methods=['POST'])
def create_user():
    
    body = request.json
    email = body.get('email', None)
    password = body.get('password', None)
    
    if email is None or password is None:
        return jsonify({'Error': 'email and password are required'}), 400
    
    hashed_password = generate_password_hash(password)
    new_user = User( email = email, password = hashed_password, is_active = True )
    
    db.session.add(new_user)
    try: 
        db.session.commit()
        return 'User Created'
    except Exception as error:
        print(error)
        db.session.rollback()
        return 'An Error Ocurred', 500
    
@app.route('/login', methods = ['POST'])
def user_login():
    body = request.json
    email = body.get('email', None)
    password = body.get('password', None)
    
    if email is None or password is None:
        return jsonify({'error': 'email and password are required'}), 400
    
    user = User.query.filter_by( email = email ).one_or_none()
    if user is None:
        return jsonify({'error': 'user no fount'}), 404
    
    password_match = check_password_hash(user.password, password)
    if not password_match:
        return jsonify({'error': 'is not the password'}), 401
    
    user_token = create_access_token({'id': user.id, 'email': user.email})
    return jsonify({'token': user_token}), 200

@app.route('/user/post', methods = ['POST'])
@jwt_required()
def create_post():
    body = request.json
    description = body.get('description', None)
    src = body.get('src', None)
    user = get_jwt_identity()
    
    if description is None:
        return jsonify({'Error': 'description required'}), 400
    
    current_date = datetime.now()
    new_post = Post(description = description, user_id = user['id'], time = current_date)
    
    if src:
        new_post.src = src 
        
    db.session.add(new_post)
    try: 
        db.session.commit()
        return 'Post Created'
    except Exception as error:
        db.session.rollback()
        return 'An Error Ocurred', 500
    
@app.route('/home/user', methods = ['GET'])
@jwt_required()
def get_users():
    user_email = get_jwt_identity()
    user_filter = User.query.filter.by( user_email = email ).one_or_none()
    
    if user_filter is None:
        return ({'Error': 'user not found'}), 401
    return user_filter.serialize(), 200

# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
