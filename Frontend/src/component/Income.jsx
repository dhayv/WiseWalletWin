import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment'
import { UserContext } from '../context/UserContext'
import api from '../api' // Importing your API instance
import { Form, Modal, Button } from 'react-bootstrap'

const Income = () => {
  const { userId, incomeId, setIncomeId, recentPay, setRecentPay, incomeData, setIncomeData } = useContext(UserContext)
  const [showModal, setShowModal] = useState(false)
  const [setErrorMessage] = useState('')
  const [amount, setAmount] = useState('')
  const [lastPay, setLastPay] = useState('')
  const [loading, setLoading] = useState(true) // Add a loading state

  const handleOpen = (e) => {
    e.stopPropagation()
    setShowModal(true)
  }

  const handleClose = (e) => {
    if (e) e.stopPropagation()
    setShowModal(false)
  }

  // Correct date format for the server
  const formatRecent = recentPay && moment(recentPay).format('MM-DD-YYYY')
  const formatLast = lastPay && moment(lastPay).format('MM-DD-YYYY')

  useEffect(() => {
    const getIncome = async () => {
      if (!userId) {
        return
      }
      try {
        const response = await api.get(`/income/${userId}`)
        const data = response.data || []
        // console.log('Income data fetched:', data)

        setIncomeData(data)
        // console.log('income data is: ', { incomeData })
        setShowModal(data.length === 0) // Show form if no data
        if (data.length > 0) {
          setIncomeId(data[0]._id)
        }
      } catch (error) {
        setErrorMessage(error.message)
      } finally {
        setLoading(false) // Set loading to false after data is fetched
      }
    }
    getIncome()
  }, [userId, setIncomeId, setIncomeData])

  const submitIncome = async (e) => {
    e.preventDefault()

    const endpointUrl = incomeData.length === 0 ? `/income/${userId}` : `/income/${incomeId}`
    const method = incomeData.length === 0 ? 'post' : 'put'

    const payload = {
      amount: parseFloat(amount), // Ensure amount is a float
      recent_pay: formatRecent, // Correct date format
      last_pay: lastPay ? formatLast : null // Correct date format
    }

    // console.log('Submitting payload:', payload)

    try {
      const response = await api({
        method,
        url: endpointUrl,
        data: payload
      })
      const data = response.data
      if (method === 'post') {
        // For POST, append the new income entry
        setIncomeData(prevData => [...prevData, data])
      } else if (method === 'put') {
        // For PUT, update the existing entry
        setIncomeData(prevData =>
          prevData.map(income => income._id === incomeId ? data : income)
        )
      }
      handleClose()
    } catch (error) {
      console.error('Error response:', error.response)
      setErrorMessage(error.response?.data?.message || error.message)
      // Log the detailed validation error messages
      console.log('Validation Errors:', error.response?.data?.detail)
      // Optional: Display validation errors to the user
      setErrorMessage(error.response?.data?.detail.join(', '))
    }
  }

  useEffect(() => {
    if (incomeData && incomeData.length > 0) {
      const { amount, recent_pay, last_pay } = incomeData[0]
      setAmount(amount.toString()) // Ensure amount is a string for the input field
      setRecentPay(recent_pay)
      setLastPay(last_pay)
    } else {
      setAmount('')
      setRecentPay('')
      setLastPay('')
    }
  }, [incomeData, setRecentPay])

  if (loading) {
    return <div>Loading...</div> // Render loading indicator while data is being fetched
  }

  if (!userId) {
    return <div>Loading...</div> // Return a loading message or spinner
  }

  return (
    <div className='card ' style={{ width: '400px' }} onClick={handleOpen}>
      <div className='card-content'>
        <div className='content has-text-centered is-hoverable'>

          <button className='has-text-weight-bold subtitle'>
            <span className='has-text-weight-bold'>Income: ${amount || ''} </span>
          </button>

          <Modal
            show={showModal}
            onHide={handleClose}
            size='lg'
            aria-labelledby='contained-modal-title-vcenter'
            centered
          >
            <Modal.Header closeButton onClick={(e) => handleClose(e)}>
              <Modal.Title id='contained-modal-title-vcenter'>Income</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form>
                <label className='label'>Amount</label>
                <input
                  className='input mb-5'
                  type='number'
                  placeholder='Amount'
                  value={amount || ''}
                  onChange={(e) => setAmount(e.target.value)}
                  autoFocus
                />
                <label className='label'>Recent Pay Date</label>
                <input
                  className='input mb-5'
                  type='date'
                  placeholder='Recent Pay Date'
                  value={recentPay || ''}
                  onChange={(e) => setRecentPay(e.target.value)}
                />

              </Form>

            </Modal.Body>

            <Modal.Footer>
              <Button variant='secondary' onClick={(event) => handleClose(event)}>Close</Button>
              <Button className='button is-success' type='submit' onClick={submitIncome}>
                {incomeData.length === 0 ? 'Add Income' : 'Save Changes'}
              </Button>
            </Modal.Footer>
          </Modal>

        </div>
      </div>
    </div>
  )
}

export default Income
