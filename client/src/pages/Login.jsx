import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { voteActions } from "../store/vote-slice";

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const navigate = useNavigate();
  //function to change controlle inputs
  const changeInputHandler = (e) => {
    setUserData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const loginVoter = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/voters/login`,
        userData
      );
      const newVoter = await response.data;
      // Save new voter to local storage
      localStorage.setItem("currentUser", JSON.stringify(newVoter));
      console.log("Current login user: ", newVoter);

      dispatch(voteActions.changeCurrentVoter(newVoter));

      navigate("/results");
    } catch (err) {
      console.log(err);
      setError(err.response.data.message);
    }
  };

  return (
    <section className="register">
      <div className="container register__container">
        <h2>Sign In</h2>
        <form onSubmit={loginVoter}>
          {error && (
            <p className="form__error-message" onChange={changeInputHandler}>
              {error}
            </p>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            autoComplete="true"
            autoFocus
            onChange={changeInputHandler}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="true"
            onChange={changeInputHandler}
          />

          <p>
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
          <button type="submit" className="btn primary">
            Login
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
