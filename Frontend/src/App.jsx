import React, { useEffect, useState } from "react";
import SignUp from "./component/SignUp";

const App = () => {
  const [message, setMessage] = useState("");

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
    <div>
      <h1>{message}</h1>
      
    </div>
  );
};

export default App;
