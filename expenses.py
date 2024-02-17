import csv
def main():

    #Get user input
    get_income()
    get_expenses()

    #Calculate
    #calculate()

    #Output
    #print("Your budget is complete")

#Get user input
def get_income():
        #-Net pay(amount after taxes) what is net pay?
    net_income = float(input("What is your montly net income? ")
)
        #-Last 2 pay date and amount
    print("Enter your last two pay dates ")
        #-most recent pay date
    recent_pay_date = input("Enter your most recent pay date (MM-DD-YYYY): ")
        #-next pay date
    recent_pay_date = input("Enter your last pay date before the most recent one (MM-DD-YYYY): ")

def get_expenses():

    #Collect expenses
    #Categories needed
    #- [ ] Name
    #- [ ] Amount
    #- [ ] Due Date
    print("Enter your expenses. Include the Name, Amount, and Due Date (1-30) for each expense.")
    print("Example: Rent, 1000, 1")

    expenses = []

    while True:
        expenses_input = input("Enter an expense (or type 'done' to finish) ").strip().capitalize()
        if expenses_input.lower() == "done":
            break
        else:
            expenses.append(expenses_input)
    
    #Write expenses to a csv file
    with open('expenses.csv', "a", newline='') as file:
        writer = csv.Dictwriter(file, fieldnames=["Expense","Amount", "Due Date"])
        # Write header row
        writer.writeheader()
        for expense in expenses:
            Expense_name, Amount, Due_Date = expense.split(",")
            # Write data 
            writer.writerow({"Expense": Expense_name, "Amount": Amount, "Due Date": Due_Date})
    



#Output
    #Categories 
    #Income - Expenses
    #CSP
    #-Fixed cost 50%
    #-Savings 20%
    #-Wants 30%

#Bi-weekly checks
    #-first check amount
    #—total expenses coming out of that check
    #-last check amount
    #—total expenses coming out of that check

if __name__ == "__main__":
    main()