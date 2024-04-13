import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { UserContext } from "../context/UserContext";
import api from "../api";



 export const NextCheck = () => {
    const {recentPay, payCycle, incomeId, setIncomeData } = useContext(UserContext);
    const[currentDate, setCurrentDate] = useState(moment().format("MM-DD-YYYY"));
    const[nextPayDate, setNextPayDate] = useState("");
   
    
    useEffect(() => {
        const updateDate = () => {
            setCurrentDate(moment().format("MM-DD-YYYY"));
        }

        let now = moment();
        let midnight = moment().endOf('day').add(1, 'second');
        let msToMidnight = midnight.diff(now);

        const timeoutId = setTimeout(() => {
            updateDate();
            const intervalId = setInterval(updateDate,  86400000);
            return () => clearInterval(intervalId);
        }, msToMidnight);

        return () => {
            clearTimeout(timeoutId);
        }

    },[]);

    useEffect(() => {
        if (recentPay) {
            const format = "MM-DD-YYYY";
            let nextDate = moment(recentPay).add(2, 'weeks'); // Assume bi-weekly pay cycle
    
            // Check if the next pay date falls on a weekend
            if (nextDate.day() === 6) { // Saturday
                nextDate.add(2, 'days'); // Move to Monday
            } else if (nextDate.day() === 0) { // Sunday
                nextDate.add(1, 'days'); // Move to Monday
            } 
            setNextPayDate(nextDate.format(format));
        }
    }, [recentPay, currentDate]);


    useEffect(() => {

        const updateIncomeData = async () => {
            if (nextPayDate && moment().isAfter(moment(nextPayDate, "MM-DD-YYYY"))) {
                setCurrentDate(moment().format("MM-DD-YYYY")); // Update date to trigger recalculation

                try {
                    const response = await api.put(`/income/${incomeId}`, {
                        recentPay: nextPayDate
                    }); 
                    if (response.status === 200) {
                        setIncomeData(response.data);
                    } else {
                        throw new Error('Could not update date information.');
                    }

                } catch (error) {
                    console.error();
                }
                }
                };
            updateIncomeData();
        }, [nextPayDate, incomeId, setIncomeData]);
    

    //Check current date( formatted date)
        //
    //retrieve last pay date from usercontext
        //
    //calculate next pay date
        // in two weeks
    //
    //
    //
    // 



    return        ( <div className="card">
        <div className="card-content">
            <div className="content">
                <span>Next Check: {nextPayDate || 'Calculating...'} for $640</span>
            </div>
        </div>
    </div>
    );
};



export default NextCheck;