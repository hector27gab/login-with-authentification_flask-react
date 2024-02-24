import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="navbar navbar-light bg-light d-flex justify-content-between">
      <div className="container">
        <div className="ml-auto d-flex justify-content-end">
          <Link to="/" className="btn btn-primary">
            Home
          </Link>
        </div>
        <Link to="/login" className="btn btn-primary">
          Log In
        </Link>
        <Link to="/register" className="btn btn-primary">
          Register
        </Link>
      </div>
    </nav>
  );
};
