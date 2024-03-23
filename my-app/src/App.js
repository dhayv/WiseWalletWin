import React, {useState, useEffect} from "react"
import api from "./api"

/* Visual components
1. MM/DD/YYYY check (amount) tab 
  -displays date of check and a drop down of the expenses to pay
  -will use reacts dom to pull data from api and do business logic calculations
    -Recent pay date will be used and to calculate next pay 
    -The due date integer will be used filter which expenses are due
2. Income tab (- show total amount of income-)
  -drop down of income listed using apis crud
3. Expenses tab 
  -Total amount of expenses and percentage of income to expene ratio using dom
  -will be three columns
  -drop down of expense list and utilizing apis crud
  */ 


const App = () => {
  const [expense, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    due_date: '',
  });

  const fetchExpenses = async () => {
    const response = await api.get('/expenses/{income_id}');
    setExpenses(response.data)
  };
  
  useEffect(() => {
    fetchExpenses
  }, []);  
}





export default App;