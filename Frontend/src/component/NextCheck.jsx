import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { UserContext } from "../context/UserContext";
import api from "../api";

export const NextCheck = () => {
    const { recentPay, payCycle, incomeId, setIncomeData, incomeData } = useContext(UserContext);
    const [currentDate, setCurrentDate] = useState(moment().format("MM-DD-YYYY"));
    const [nextPayDate, setNextPayDate] = useState("");

    useEffect(() => {
        const updateDate = () => setCurrentDate(moment().format("MM-DD-YYYY"));
        
        let now = moment();
        let midnight = moment().endOf('day').add(1, 'second');
        let msToMidnight = midnight.diff(now);
        
        const intervalId = setInterval(updateDate, 86400000);
        const timeoutId = setTimeout(updateDate, msToMidnight);

        return () => {
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        if (recentPay) {
            const format = "MM-DD-YYYY";
            let nextDate = moment(recentPay).add(2, 'weeks');

            if (nextDate.day() === 6) { // Adjust for weekends
                nextDate.add(2, 'days');
            } else if (nextDate.day() === 0) {
                nextDate.add(1, 'days');
            }
            setNextPayDate(nextDate.format(format));
        }
    }, [recentPay, currentDate]);

    useEffect(() => {
        const updateIncomeData = async () => {
            if (nextPayDate && moment().isAfter(moment(nextPayDate, "MM-DD-YYYY"))) {
                setCurrentDate(moment().format("MM-DD-YYYY")); // This might be redundant
                try {
                    const response = await api.put(`/income/${incomeId}`, {
                        recentPay: nextPayDate
                    });
                    if (response.status === 200) {
                        setIncomeData(response.data);
                    } else {
                        throw new Error('Failed to update income data');
                    }
                } catch (error) {
                    console.error('Error updating income data:', error);
                }
            }
            console.log("Income Data Updated:", incomeData);
        };
        
        


        updateIncomeData();
    }, [nextPayDate, incomeId, setIncomeData]);

    return (
        <div className="card">
            <div className="card-content">
                <div className="content">
                    <span className="has-text-weight-bold ">Next Check: {nextPayDate || 'Calculating...'} for $640</span>
                </div>
            </div>
        </div>
    );
};

export default NextCheck;
