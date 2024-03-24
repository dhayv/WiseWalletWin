import React, { useState, useContext } from "react";

import { UserContext } from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";




const SignUp = () => {
    const [firstName, setFirstName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [passWord, setPassword] = useState("");

    const [confirmationPassword, setConfirmationPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // Manages token globally
    const {setToken } = useContext(UserContext);

    // Function to submit user info(Post)
    const submitRegistration = async () => {
        //Post request to /user enpoint
        let response = await fetch("/user", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                first_name: firstName,
                email: email, 
                password: passWord,
                username: userName,
                phone_number: phoneNumber,
            }),
        });


        if (!response.ok) {
            setErrorMessage("Failed to Register");
            return;
        }
        // Login: Post request to /token endpoint
        response = await fetch("/token", {
            method: "POST",
            headers: {"Content-type": "application/x-www-form-urlencoded"},
            body: new URLSearchParams({
                username: userName,
                password: passWord,
            }),
        });

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
                if (passWord === confirmationPassword) {
                    submitRegistration();
                } else {
                    setErrorMessage("Passwords don't match")
                }
        }

    const validatePassword = (password) => {
        if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
        if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
        if (!/\d/.test(password)) return "Password must contain at least one digit";
        if (!/[!@#$%^&*(),.?\\":{}|<>]/.test(password)) return "Password must contain at least one special character";
        return "";
    };

    const handlePasswordChange = (e) => {
        const { value } = e.target;
        setPassword(value);
        const errorMessage = validatePassword(value);
        setPasswordError(errorMessage);
    };


        return(
            <div className="column">
                <form className="box" onSubmit={handleSubmit}>
                    <h1 className="title has-tex-centered">SignUp</h1>
                    {/* First Name */}
                    <div className="field">
                        <label className="label">First Name</label>
                        <div className="control">
                            <input 
                            type="text" 
                            placeholder="Enter First Name" 
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)}
                            className="input"
                            />
                        </div>
                    </div>
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
                    {/* Email */}
                    <div className="field">
                        <label className="label">Email Address</label>
                        <div className="control">
                            <input 
                            type="email" 
                            placeholder="Enter Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
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
                    {/* Password confirmation */}
                    <div className="field">
                        <label className="label">Confirm Password</label>
                        <div className="control">
                            <input 
                            type="password" 
                            placeholder="Re-enter Password to Confirm" 
                            value={confirmationPassword} 
                            onChange={(e) => setConfirmationPassword(e.target.value)}
                            className={`input ${passwordError ? 'is-danger' : ''}`}
                            minLength="8"
                            required
                            />
                            {passwordError && <p className="help is-danger">{passwordError}</p>}
                        </div>
                    </div>
                    {/* Phone Number */}
                    <div className="field">
                        <label className="label">Phone Number</label>
                        <div className="control">
                            <input 
                            type="text" 
                            placeholder="Enter Phone Number" 
                            value={phoneNumber} 
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            pattern="^(\\d{3}[-\\s]?){2}\\d{4}$"

                            className="input"
                            />
                        </div>
                        
                    </div>
                        <ErrorMessage message ={errorMessage}/>
                    <br />
                    {/* Button */}
                    <button className="button is-primary" type="submit">
                        SignUp
                    </button>
                </form>
            </div>
        );
    
};

export default SignUp;