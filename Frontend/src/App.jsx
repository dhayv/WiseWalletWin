import React, { useContext, useEffect, useState } from 'react';
import Header from './component/Header';
import { UserContext } from './context/UserContext';
import Income from './component/Income';
import Remaining from './component/Remaining';
import NextCheck from './component/NextCheck';
import Expenses from './component/Expenses';
import Footer from './component/Footer';
import 'bulma/css/bulma.min.css';


const App = () => {
  const [message, setMessage] = useState('');
  const { totalExpenses } = useContext(UserContext);

  useEffect(() => {
    getMessage();  // Assuming getMessage is defined elsewhere in your app
  }, []);

  return (
    <>
      <div className="container">
        <div>
          <div>
            <Income />
          </div>
          <div>
            <Remaining />
          </div>
          <div>
            <NextCheck />
          </div>
        </div>
        <div className="columns is-centered">
          <div>
            <h3 className="has-text-weight-bold subtitle ml-3 has-text-centered">
              Expenses: ${totalExpenses?.total_expenses || 0}
            </h3>
            <Expenses />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
