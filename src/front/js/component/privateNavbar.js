import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const NavbarPrivate = () => {
  const { actions } = useContext(Context);

  const navigate = useNavigate();

  const logOut = () => {
    actions.logOut();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-light bg-light d-flex justify-content-between">
      <div className="container">
        <div className="ml-auto d-flex">
          <Link to="/" className="btn btn-primary">
            Home
          </Link>
        </div>
        <button className="btn btn-danger text-light" onClick={logOut}>
          <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
    </nav>
  );
};
