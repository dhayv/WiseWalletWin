import React, { useContext, useEffect, useState } from 'react';
import Header from './component/Header';
import { UserContext } from './context/UserContext';
import Login from './component/Login';
import SignUp from './component/SignUp';
import Income from './component/Income';
import Remaining from './component/Remaining';
import NextCheck from './component/NextCheck';
import Expenses from './component/Expenses';
import 'bulma/css/bulma.min.css';
import './styles/App.css';

const App = () => {
  const [message, setMessage] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);
  const { token, totalExpenses } = useContext(UserContext);

  const getMessage = async () => {
    // ... existing getMessage logic ...
  };

  useEffect(() => {
    getMessage();
  }, []);

  return (
    <>
      <Header title={message} />
      <div className="container">
        {!token ? (
          <div>
            <div>
              {showSignUp ? (
                <SignUp setShowSignUp={setShowSignUp} />
              ) : (
                <Login setShowSignUp={setShowSignUp} />
              )}
            </div>
          </div>
        ) : (
          <>
            <div >
              <div >
                <div >
                  <div >
                    <Income />
                  </div>
                  <div >
                    <Remaining />
                  </div>
                </div>
                <div >
                  <div >
                    <NextCheck />
                  </div>
                </div>
              </div>
            </div>

            <div className="columns is-centered">
              <div className="">
                <h3 className="has-text-weight-bold subtitle ml-3 has-text-centered">
                  Expenses: ${totalExpenses?.total_expenses || 0}
                </h3>
                <Expenses />
                {/* Additional components for when the user is logged in */}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default App;
