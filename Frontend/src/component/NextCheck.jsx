import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment'
import { UserContext } from '../context/UserContext'
import api from '../api'
import { Table, Modal, Button } from 'react-bootstrap'

export const NextCheck = () => {
  const { recentPay, incomeId, setIncomeData, incomeData, expenseData, refreshData } = useContext(UserContext)
  const [currentDate, setCurrentDate] = useState(moment().format('MM-DD-YYYY'))
  const [nextPayDate, setNextPayDate] = useState('')
  const [expensesDue, setExpensesDue] = useState([])
  const [showModal, setShowModal] = useState(false)

  const handleOpen = () => {
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
  }

  useEffect(() => {
    console.log('Expense Data:', expenseData)
    console.log('Income Data:', incomeData)
    console.log('Recent Pay Date:', recentPay)

    if (recentPay) {
      const nextPay = moment(recentPay, 'YYYY-MM-DD').add(14, 'days') // assuming bi-weekly pay cycle
      setNextPayDate(nextPay.format('YYYY-MM-DD'))
      console.log('Next Pay Date:', nextPay.format('YYYY-MM-DD'))

      const startOfNextPeriod = moment(recentPay, 'YYYY-MM-DD').add(1, 'days') // Day after recent pay date
      const endOfNextPeriod = moment(recentPay, 'YYYY-MM-DD').add(15, 'days') // 14 days after recent pay date
      console.log('Start of Next Period:', startOfNextPeriod.format('YYYY-MM-DD'))
      console.log('End of Next Period:', endOfNextPeriod.format('YYYY-MM-DD'))

      const startPostPayPeriod = moment(startOfNextPeriod, 'YYYY-MM-DD').add(15, 'days')
      const endPostPayPeriod = moment(startOfNextPeriod, 'YYYY-MM-DD').add(25, 'days')
      console.log('Start of Post Period:', startPostPayPeriod.format('YYYY-MM-DD'))
      console.log('End of Post Period:', endPostPayPeriod.format('YYYY-MM-DD'))

      const dueExpenses = expenseData.filter(expense => {
        // Convert due_date integer to a date for the current month
        let expenseDueDate = moment().date(expense.due_date)

        // If due_date is before the start of next period, consider it for the next month
        if (expenseDueDate.isBefore(startPostPayPeriod)) {
          expenseDueDate = expenseDueDate.add(1, 'months')
        }

        console.log('Expense Due Date:', expenseDueDate.format('YYYY-MM-DD'))
        return expenseDueDate.isBetween(startPostPayPeriod, endPostPayPeriod, null, '[]')
      })

      console.log('Due Expenses:', dueExpenses)
      setExpensesDue(dueExpenses)
    }
  }, [expenseData, incomeData, recentPay, refreshData])

  useEffect(() => {
    const updateDate = () => setCurrentDate(moment().format('MM-DD-YYYY'))

    const now = moment()
    const midnight = moment().endOf('day').add(1, 'second')
    const msToMidnight = midnight.diff(now)

    const intervalId = setInterval(updateDate, 86400000)
    const timeoutId = setTimeout(updateDate, msToMidnight)

    return () => {
      clearTimeout(timeoutId)
      clearInterval(intervalId)
    }
  }, [refreshData])

  useEffect(() => {
    const updateIncomeData = async () => {
      if (nextPayDate && moment().isAfter(moment(nextPayDate, 'YYYY-MM-DD'))) {
        setCurrentDate(moment().format('MM-DD-YYYY')) // This might be redundant
        try {
          const response = await api.put(`/income/${incomeId}`, {
            recent_pay: moment(nextPayDate).format('MM-DD-YYYY')
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
      console.log('Income Data Updated:', incomeData)
    }

    updateIncomeData()
  }, [nextPayDate, incomeId, setIncomeData, refreshData])

  const totalDueExpenses = expensesDue.reduce((sum, expense) => sum + expense.amount, 0)
  console.log('Total Due Expenses:', totalDueExpenses)

  const sortedExpenseDue = [...expensesDue].sort((a, b) => a.due_date - b.due_date)

  return (
    <div className='card'>
      <div className='card-content'>
        <div className='content'>
          <button onClick={handleOpen} className='button'>
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
            <Modal.Header closeButton={handleClose}>
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
                     <tr key={exp.id}>
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
              <Button variant='secondary' onClick={handleClose}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  )
}

export default NextCheck
