import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../component/navbar";
import "../../styles/home.css";

export const Register = () => {
  const { actions } = useContext(Context);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      await actions.createUser({
        email: email,
        password: password,
      })
    ) {
      navigate("/login");
    } else {
      alert("get away from here");
    }
  };

  return (
    <>
      <Navbar />
      <h3 className="d-flex justify-content-center mt-4 fw-bold">Register</h3>
      <form
        className="container bg-dark w-50 text-light rounded"
        onSubmit={handleSubmit}
      >
        <div className="form-group mt-4 mx-3">
          <label className="mt-3">Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            onChange={(event) => setEmail(event.target.value)}
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group mx-3 mb-3">
          <label for="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-success mx-3 mb-3">
            Submit
          </button>
        </div>
      </form>
    </>
  );
};
