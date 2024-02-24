import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../component/navbar";
import "../../styles/home.css";

export const Login = () => {
  const { actions } = useContext(Context);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await actions.login({
      email: email,
      password: password,
    });
    if (response) {
      navigate("/home/user");
    }
  };

  return (
    <>
      <Navbar />
      <h3 className="d-flex justify-content-center mt-4 fw-bold">Login</h3>
      <form
        className="container w-50 bg-dark text-light rounded"
        onSubmit={handleSubmit}
      >
        <div className="form-group mt-4 mx-3">
          <label className="mt-3">Email address</label>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Enter email"
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="form-group mx-3">
          <label for="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary mx-3 my-3">
            log in
          </button>
        </div>
      </form>
    </>
  );
};
