import React, { useContext, useEffect, useState } from 'react';
import Header from './component/Header';
import { UserContext } from './context/UserContext';
import Income from './component/Income';
import Remaining from './component/Remaining';
import NextCheck from './component/NextCheck';
import Expenses from './component/Expenses';
import Footer from './component/Footer';
import 'bulma/css/bulma.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from 'react-bootstrap';



const App = () => {
  const [message, setMessage] = useState('');
  const { totalExpenses } = useContext(UserContext);



  return (
    <>
      <div className="container">
        <Row>
          <Col>
            <Income />
          </Col>
          <Col>
            <Remaining />
          </Col>
          <div>
            <NextCheck />
          </div>
        </Row>
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
