import csv
import os

def main():

    #Get user input
    net_income, recent_pay_date, recent_pay_date_2 = get_income()

    

    #Calculate info
    total_expenses = get_expenses()

    remainder = calculate(net_income,total_expenses)

    #Output
    print("Your Spending Plan is complete!")


    print(f"Monthly income: ${net_income}")

    print(f"Monthly fixed cost: ${total_expenses}")

    print(f"Remaining balance: {remainder}")





#Get user input
def get_income():
    # Net pay(amount after taxes) what is net pay?
    #store net income to not continously ask for it
    net_income = float(input("What is your montly net income? "))

    #store info
    # Last 2 pay date and amount
    print("Enter your last two pay dates ")

    # most recent pay date
    recent_pay_date = input("Enter your most recent pay date (MM-DD-YYYY): ")

    # next pay date
    recent_pay_date_2 = input("Enter your last pay date before the most recent one (MM-DD-YYYY): ")

    return net_income, recent_pay_date, recent_pay_date_2

def get_expenses():

    #Collect expenses
        #Categories needed (Name, amount, Due Date)
    print("Enter your expenses. Include the Name, Amount, and Due Date (1-30) for each expense.")
    print("Example: Rent, 1000, 1")

    expenses_info = []
    
    # Expense counter
    total_expenses = 0

    while True:
        expense_input = input("Enter an expense (or type 'done' to finish) ").strip().capitalize()
        if expense_input.lower() == "done":
            break
        else:
            expense_name, amount, due_date = expense_input.split(",")
            expenses_info.append({"Expense": expense_name, "Amount": float(amount), "Due Date": int(due_date)})
            total_expenses += float(amount)

    #Write expenses to a csv file

    with open('expenses.csv', "a", newline='') as file:
        writer = csv.DictWriter(file, fieldnames=["Expense","Amount", "Due Date"])
        file_exists = os.path.isfile('expenses.csv')       
        if not file_exists:
        # Write header row
            writer.writeheader()
        for expense in expenses_info:
        # Write data 
            writer.writerow(expense)

    return total_expenses

def calculate(net_income, total_expenses):
    remainder = net_income - total_expenses
    return remainder








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