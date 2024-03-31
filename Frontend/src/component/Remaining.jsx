import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

const Remaining = () => {
    const [isActive, setIsActive] = useState(false);
    const {token, userId} = useContext(UserContext);
    const toggleDropdown = () => setIsActive(!isActive);
    const [errorMessage, setErrorMessage] = useState("");
    const [remain, setRemain] = useState("");
    

    const getremaining = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const response = await fetch(`/user/${userId}/income_minus_expenses`, requestOptions);
            if (!response.ok) {
                throw new Error('Could not load remainder information.');
            }
            const data = await response.json();
            setRemain(data);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };


    return ( 
        <div className="card">
            <div className="card-content">
                <div className="content">
                    <div className={`dropdown ${isActive ? "is-active" : ""}`}>
                        <div className="dropdown-trigger">
                            <button className="" aria-haspopup="true" aria-controls="dropdown-menu" onClick={toggleDropdown}>
                                <span class="card-header-title">Remaining: ${getremaining}</span>
                                <i className="fas fa-angle-down" aria-hidden="true"></i>
                            </button>
                        </div>
                        <div className="dropdown-menu" id="dropdown-menu" role="menu">
                            <div className="dropdown-content">
                                <a href="#" className="dropdown-item">Dropdown item</a>
                                <a className="dropdown-item">Other dropdown item</a>
                                <a href="#" className="dropdown-item is-active">Active dropdown item</a>
                                <a href="#" className="dropdown-item">Other dropdown item</a>
                                <hr className="dropdown-divider" />
                                <a href="#" className="dropdown-item">With a divider</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Remaining;
