import React, { useContext, useEffect, useState } from "react";
import Header from "./component/Header";
import { UserContext } from "./context/UserContext";
import Login from "./component/Login";
import SignUp from "./component/SignUp";
import Income from "./component/Income";
import Remaining from "./component/Remaining";
import NextCheck from "./component/NextCheck"

const App = () => {
  const [message, setMessage] = useState("");
  // Signup is not shown first due to be setting as False
  const [showSignUp, setShowSignUp] = useState(false)
  const {token} = useContext(UserContext);

  const getMessage = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Corrected content type
      },
    };

    try {
      const response = await fetch("/api", requestOptions);
      if (!response.ok) {
        // If the response status is not OK, throw an error
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setMessage(data.message); // Assuming the response contains a "message" field
    } catch (error) {
      console.error("Failed to fetch message: ", error);
    }
  };

useEffect(() => {
    getMessage();
  }, []);

  return (
    <>
      <Header title={message} />
      <div className="columns">
        <div className="column"></div>
        <div className="column m-5 is-two-thirds">
          {!token ? (
            <div className="columns">
              {/* Conditional rendering for SignUp/Login based on showSignUp state */}
              {
              /*
             {showSignUp ? (
                <div className="column">
                  <SignUp setShowSignUp={setShowSignUp} />
                </div>
              ) : (
                <div className="column">
                  <Login setShowSignUp={setShowSignUp} />
                </div>
              )}
              /*
                } 
              {/* Income and Remaining Components */}
              <div className="columns">
                <div className="column">
                  <Income />
                </div>
              </div>
              <div className="columns">
                <div className="column">
                  <Remaining />
                </div>
              </div>
              <div className="columns">
                <div className="column">
                  <NextCheck />
                </div>
              </div>
            <h3 class="title">Expenses</h3>
            </div>
          ) : (
            <p>Table</p> // Placeholder for authenticated state
          )}
        </div>
        <div className="column"></div>
      </div>
    </>
  );
};

export default App;
