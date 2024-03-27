import React, { useState, useContext } from "react";
import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../context/UserContext";

// Define submitLogin inside the Login component if it uses component state or props
const Login = () => {
  const [userName, setUserName] = useState("");
  const [passWord, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setToken } = useContext(UserContext);
  cont

  const submitLogin = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-type": "application/x-www-form-urlencoded" },
      body: JSON.stringify(`grant_type=&username=${userName}&password=${passWord}&scope=&client_id=&client_secret=`),
    };

    const response = await fetch("/token", requestOptions);

    if (!response.ok) {
      setErrorMessage("Login failed");
      return;
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    setToken(data.access_token);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitLogin();
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="column">
      <form className="box" onSubmit={handleSubmit}>
        <h1 className="title has-text-centered">Login</h1>
        {/* UserName */}
        <div className="field">
          <label className="label">Username</label>
          <div className="control">
            <input
              type="text"
              placeholder="Enter Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>
        {/* Password */}
        <div className="field">
          <label className="label">Password</label>
          <div className="control">
            <input
              type="password"
              placeholder="Enter Password"
              value={passWord}
              onChange={handlePasswordChange}
              className="input"
              minLength="8"
              required
            />
          </div>
        </div>
        <ErrorMessage message={errorMessage} />
        <br />
        {/* Button */}
        <button className="button is-primary" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
