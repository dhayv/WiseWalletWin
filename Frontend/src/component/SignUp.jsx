import React, { useState } from "react";

import { UserContext } from "../context/UserContext";


const SignUp = () => {
    const [firstName, setFirstName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [confirmationPassword, setConfirmationPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const { token, setToken } = useContext(UserContext);

    const validatePassword = (password) => {
        if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
        if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
        if (!/\d/.test(password)) return "Password must contain at least one digit";
        if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) return "Password must contain at least one special character";
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
                <form className="box">
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
                            />
                        </div>
                    </div>
                    {/* Email */}
                    <div className="field">
                        <label className="label">Email Address</label>
                        <div className="control">
                            <input 
                            type="text" 
                            placeholder="Enter Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                            />
                        </div>
                    </div>
                    {/* Password */}
                    <div className="field">
                        <label className="label">Password</label>
                        <div className="control">
                            <input 
                            type="text" 
                            placeholder="Enter Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                            />
                        </div>
                    </div>
                    {/* Password confirmation */}
                    <div className="field">
                        <label className="label">Confirm Password</label>
                        <div className="control">
                            <input 
                            type="text" 
                            placeholder="Re-enter Password to Confirm" 
                            value={confirmationPassword} 
                            onChange={(e) => setConfirmationPassword(e.target.value)}
                            className="input"
                            />
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
                            className="input"
                            />
                        </div>
                    </div>
                    {/* Button */}
                    <button className="button is-primary" type="submit">
                        SignUp
                    </button>
                </form>
            </div>
        );
    
};

export default SignUp