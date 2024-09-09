import { useContext, useEffect, useState } from 'react'
import moment from 'moment'
import { UserContext } from '../context/UserContext'
import api from '../api'
import { Table, Modal, Button } from 'react-bootstrap'

export const NextCheck = () => {
  const { recentPay, incomeId, setIncomeData, incomeData, expenseData, refreshData } = useContext(UserContext)
  const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD'))
  const [nextPayDate, setNextPayDate] = useState('')
  const [expensesDue, setExpensesDue] = useState([])
  const [showModal, setShowModal] = useState(false)

  const handleOpen = () => {
    setShowModal(true)
  }

  const handleClose = (event) => {
    event.stopPropagation()
    setShowModal(false)
  }

  // Consolidate logic into one useEffect for efficiency
  useEffect(() => {
    if (!recentPay || !incomeData || !expenseData) return

    const nextPay = moment(recentPay, 'YYYY-MM-DD').add(14, 'days') // bi-weekly pay cycle
    setNextPayDate(nextPay.format('YYYY-MM-DD'))

    // future forecast calculator to help users plan ahead an extra two week
    const startPeriod = moment(nextPay, 'YYYY-MM-DD') // start counting from next pay date
    const endPeriod = moment(startPeriod, 'YYYY-MM-DD').add(14, 'days') // 2 weeks after next pay date include pay date

    const dueExpenses = expenseData.filter(expense => {
      let expenseDueDate = moment(recentPay, 'YYYY-MM-DD').set('date', expense.due_date)
      if (!expenseDueDate.isValid()) {
        expenseDueDate = expenseDueDate.clone().endOf('month')
      }
      if (expenseDueDate.isBefore(startPeriod)) {
        expenseDueDate = expenseDueDate.clone().add(1, 'month') // Clone before mutating
      }
      return expenseDueDate.isBetween(startPeriod, endPeriod, null, '[]')
    })

    setExpensesDue(dueExpenses)

    // Update income data if next pay date is past
    const updateIncomeData = async () => {
      if (nextPayDate && moment().isAfter(moment(nextPayDate, 'YYYY-MM-DD'))) {
        try {
          const response = await api.put(`/income/${incomeId}`, {
            recent_pay: nextPayDate
          })
          if (response.status === 200) {
            setIncomeData(response.data)
          } else {
            throw new Error('Failed to update income data')
          }
        } catch (error) {
          console.error('Error updating income data:', error)
        }
      }
    }

    updateIncomeData()
  }, [expenseData, incomeData, incomeId, setIncomeData])

  // Update current date once a day at midnight
  useEffect(() => {
    const updateDate = () => setCurrentDate(moment().format('MM-DD-YYYY'))

    const now = moment()
    const midnight = moment().endOf('day').add(1, 'second')
    const msToMidnight = midnight.diff(now)

    const timeoutId = setTimeout(() => {
      updateDate()
      setInterval(updateDate, 86400000) // Set interval to update every 24 hours after the first update
    }, msToMidnight)

    return () => clearTimeout(timeoutId)
  }, [])

  const totalDueExpenses = expensesDue.reduce((sum, expense) => sum + expense.amount, 0)
  const sortedExpenseDue = [...expensesDue].sort((a, b) => a.due_date - b.due_date)

  return (
    <div className='card' style={{ width: '400px' }} onClick={handleOpen}>
      <div className='card-content'>
        <div className='content has-text-centered'>
          <button className='has-text-weight-bold subtitle'>
            <span>
              Next Check: {nextPayDate ? moment(nextPayDate, 'YYYY-MM-DD').format('MMM Do') : 'Calculating...'} for ${totalDueExpenses}
            </span>
          </button>
          <Modal
            show={showModal}
            onHide={handleClose}
            size='lg'
            aria-labelledby='contained-modal-title-vcenter'
            centered
          >
            <Modal.Header onClick={(event) => handleClose(event)}>
              <Modal.Title id='contained-modal-title-vcenter'>Expenses Due</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <div>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Amount</th>
                      <th>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedExpenseDue.map(exp => (
                      <tr key={exp._id || exp.name}>
                        <td>{exp.name}</td>
                        <td>${exp.amount}</td>
                        <td>{exp.due_date}</td>
                        <td />
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

            </Modal.Body>

            <Modal.Footer>
              <Button variant='secondary' onClick={(event) => handleClose(event)}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  )
}

export default NextCheck
