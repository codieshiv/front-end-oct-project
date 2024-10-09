import { gsap } from "gsap";

const expenseList = document.getElementById('expense-list');
const totalAmount = document.getElementById('total-amount');
let total = 0;

document.getElementById('add-expense').addEventListener('click', () => {
    const expenseName = document.getElementById('expense-name').value;
    const expenseAmount = parseFloat(document.getElementById('expense-amount').value);

    if (expenseName && !isNaN(expenseAmount)) {
        addExpense(expenseName, expenseAmount);
        document.getElementById('expense-name').value = '';
        document.getElementById('expense-amount').value = '';
    } else {
        alert('Please enter valid expense details.');
    }
});

function addExpense(name, amount) {
    total += amount;
    totalAmount.textContent = total.toFixed(2);

    const expenseItem = document.createElement('div');
    expenseItem.className = 'expense-item';
    expenseItem.innerHTML = `${name}: ${amount.toFixed(2)}`;
    
    // Animate the new expense item
    gsap.from(expenseItem, { duration: 0.5, opacity: 0, y: -20 });
    
    expenseList.appendChild(expenseItem);
}