import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import moment from "moment";

const Income = () => {
    const { token, userId } = useContext(UserContext);
    const [incomeData, setIncomeData] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const getIncome = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const response = await fetch(`/income/${userId}`, requestOptions);
            if (!response.ok) {
                throw new Error('Something went wrong. Could not load income information.');
            }
            const data = await response.json();
            setIncomeData(data);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    useEffect(() => {
        if (userId) {
            getIncome();
        }
    }, [userId, token]);

    return (
        <div className="card">
            <div className="card-content">
                <div className="content">
                    <span>Income: 2000</span>
                        <button className="button is-info is-small" style={{ marginLeft: "10px" }}>
                            {errorMessage && <p>{errorMessage}</p>}
                            {incomeData ? (
                                    <table className="table is-fullwidth">
                                        <thead>
                                            <tr>
                                                <th>Amount</th>
                                            </tr>
                                            <tr>              \
                                                <th>Recent Pay</th>
                                            </tr>
                                            <tr>
                                                <th>Last Pay</th>
                                            </tr>
                                        </thead>
                                        <tbody>  
                                            {incomeData.map((incomeData) => (                                 
                                                <tr  key={incomeData.id}>
                                                    <td>{incomeData.amount}</td>
                                                    <td>{moment(incomeData.recent_pay).format("MMM Do YY")}</td>
                                                    <td>{moment(incomeData.last_pay).format("MMM Do YY")}</td>
                                                    <td>
                                                        <button className="button mr-2 is-info is-light">
                                                            Update
                                                        </button>
                                                        <button className="button mr-2 is-danger is-light">
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}               
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>Edit</p>
                            )}
                        </button>
                </div>
            </div>
        </div>
    );
};

export default Income;
