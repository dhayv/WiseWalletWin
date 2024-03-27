import React, { useContext, useEffect, useState } from "react";
import SignUp from "./component/SignUp";
import Header from "./component/Header";
import { UserContext } from "./context/UserContext";
import Login from "./component/Login";


const App = () => {
  const [message, setMessage] = useState("");
  const [showLogin, setShowLogin] =useState(true);
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
  }, []); // Added an empty dependency array to run only once after the component mounts

  return (
    <>
    <Header title={message} />
      <div className="columns">
        <div className="column"></div>
        <div className="column m-5 is-two-thirds">
          {!token ? (
              <div className="columns">
                {showLogin ? <Login /> : <SignUp/>}
                <button onClick={() => setShowLogin(!showLogin)}>
                  {showLogin ? "Don't have an account? Sign Up" : " Already have an account? Login"}
                </button>
                
                 
              </div>
            ): (
              <p>Table</p>
            )
          }
        </div>
        <div className="column"></div>
      </div>
    </>
  );
};

export default App;
