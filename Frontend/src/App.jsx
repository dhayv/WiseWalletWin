import React, { useContext, useEffect, useState } from 'react'
import Header from './component/Header'
import { UserContext } from './context/UserContext'
import Income from './component/Income'
import Remaining from './component/Remaining'
import NextCheck from './component/NextCheck'
import Expenses from './component/Expenses'
import Footer from './component/Footer'
import 'bulma/css/bulma.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Row, Col } from 'react-bootstrap'

const App = () => {
  const [message, setMessage] = useState('')
  const { totalExpenses } = useContext(UserContext)

  return (
    <>
      <div className='container'>
        <Row className='mb-4 p-2 justify-content-center'>
          <Col xs={12} md={4} className='p-2 d-flex justify-content-center'>
            <Income />
          </Col>
          <Col xs={12} md={4} className='p-2 d-flex justify-content-center'>
            <NextCheck />
          </Col>
        </Row>
        {/* <Row>
            <Remaining />
          </Row> */}

        <Row className='mt-0 justify-content-center p-2'>
          <Col className='text-center'>
            <span className='has-text-weight-bold subtitle has-text-centered mb-3'>
              Expenses: ${totalExpenses?.total_expenses || 0}
            </span>

          </Col>
        </Row>

        <Row className='justify-content-center mt-3 p-2 mb-5'>
          <Col md='auto' className='text-center'>
            <Expenses />
          </Col>
        </Row>
      </div>
    </>
  )
}

export default App
