import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";

const Remaining = () => {
    const { token, userId, refreshData } = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState("");
    const [remain, setRemain] = useState(0);
    const formattedRemain = Number(remain.toFixed(2));


    useEffect(() => {
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
                setRemain(data.income_minus_expenses);
            } catch (error) {
                setErrorMessage(error.message);
            }
        };
        
        if (token && userId) {
            getremaining();
        }
        ;
    }, [token, userId, refreshData]); // Run the effect on component mount and when token or userId changes

    return (
        <div className="card">
            <span className="card-header-title">Remaining: ${formattedRemain}</span>
            {errorMessage && <p className="help is-danger">{errorMessage}</p>}
        </div>
    );
};

export default Remaining;
