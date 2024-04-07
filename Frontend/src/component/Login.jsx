import React, { useState, useContext } from "react";
import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../context/UserContext";
import api from "../api";


// Define submitLogin inside the Login component if it uses component state or props
const Login = ({setShowSignUp}) => {
  const [userName, setUserName] = useState("");
  const [passWord, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setToken, token, setUserId } = useContext(UserContext);



  const submitLogin = async () => {
    try{
      
      const params = new URLSearchParams();
      params.append('username', userName);
      params.append('password', passWord);
      params.append('grant_type', '');
      params.append('scope', '');
      params.append('client_id', '');
      params.append('client_secret', '');

      const response = await api.post("/token", params);
    
      localStorage.setItem('token', response.data.access_token);
      setToken(response.data.access_token);
      
      const userInfoResponse = await api.get("/user/me", {
        headers: { 'Authorization': `Bearer ${response.data.access_token}` }
    });
    if (userInfoResponse.status === 200) {
        const userData = userInfoResponse.data;
        localStorage.setItem('userId', userData.id); // Save userId to local storage
        setUserId(userData.id); // Update userId in the context
    }
} catch (error) {

      setErrorMessage(error.response?.data?.detail || "Login failed");
    }
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
      <button on onClick={()=> setShowSignUp(true)}>Don't have an account? Sign Up</button>
    </div>
  );
};

export default Login;
