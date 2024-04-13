import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { UserContext } from "../context/UserContext";




 export const NextCheck = () => {
    const {recentPay, setRecentPay } = useContext(UserContext);
    const[currentDate, setCurrentDate] = useState(new Date());
    const[nexyPayDate, setNextPayDate] = useState("");


    const formatCurrentDate = currentDate && moment(currentDate).format("MM-DD-YYYY");
  

        useEffect(() => {

        }
    )
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
                <span>Next Check: $640</span>
            </div>
        </div>
    </div>
    );
};



export default NextCheck