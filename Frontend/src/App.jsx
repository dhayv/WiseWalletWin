import React, { useContext, useEffect, useState } from "react";
import Header from "./component/Header";
import { UserContext} from "./context/UserContext";
import Login from "./component/Login";
import SignUp from "./component/SignUp";
import Income from "./component/Income";
import Remaining from "./component/Remaining";
import NextCheck from "./component/NextCheck";
import Expenses from "./component/Expenses";
import api from "./api";

const App = () => {
  const [message, setMessage] = useState("");
  const [showSignUp, setShowSignUp] = useState(false); // State to toggle between sign up and login
  const { token , totalExpenses} = useContext(UserContext);

  // Function to get a message from your API
  const getMessage = async () => {
    // ... existing getMessage logic ...
  };

  // Effect for fetching the message on component mount
  useEffect(() => {
    getMessage();
  }, []);

  const fixedSizeStyle = {
    width: '200px',
    minWidth: '200px',
    maxWidth: '200px',
  };

  return (
    <>
      <Header title={message} />
      <div className="columns">
        <div className="column"></div>
        <div className="column m-5 is-two-thirds">
          {!token ? (
            // Show the login or sign up forms if no token is found (user is not logged in)
            <div className="columns is-centered">
              {showSignUp ? (
                <SignUp setShowSignUp={setShowSignUp} />
              ) : (
                <Login setShowSignUp={setShowSignUp} />
              )}
            </div>
          ) : (
            // Show the income, remaining, and next check components when the user is logged in
            <>
              <div className="columns">
                <div className="column" >
                  <Income />
                </div>
                <div className="column" >
                  <Remaining />
                </div>
                <div className="column">
                  <NextCheck />
                </div>
              </div>
              
              <h3 className="subtitle">Expenses: ${totalExpenses?.total_expenses}</h3>
                <Expenses/>
              {/* ... Additional components for when the user is logged in ... */}
            </>
          )}
        </div>
        <div className="column"></div>
      </div>
    </>
  );
};

export default App;
