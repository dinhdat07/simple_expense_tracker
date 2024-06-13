const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

const list = document.getElementById('transactionList');
const form = document.getElementById("transactionForm");
const status = document.getElementById('status');
const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');

form.addEventListener('submit', addTransaction);

const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    signDisplay: "always"
}) 

function updateTotal() {
    const totalIncome = transactions.filter((trans) => trans.type === "income")
                                     .reduce((total, trans) => total + trans.amount, 0);
    const totalExpense = transactions.filter((trans) => trans.type === "expense")
                                     .reduce((total, trans) => total + trans.amount, 0);
    const totalBalance = totalIncome - totalExpense;
    balance.textContent = formatter.format(totalBalance);
    income.textContent = formatter.format(totalIncome);
    expense.textContent = formatter.format(totalExpense*(-1));
}
    
    
function renderList() {
    list.innerHTML = "";
    if (transactions.length === 0) {
        status.textContent = "No Transactions.";
        return;
    }

    transactions.forEach(({id, name, date, amount, type}) => {
        const li = document.createElement("li");
        if (type == 'expense') amount *= -1;
        li.innerHTML = `
            <div class="name">
                <h4>${name}</h4>
                <p>${new Date(date).toLocaleDateString()}</p>
            </div>
                
            <div class="amount ${type}">
                <span>${formatter.format(amount)}</span>
            </div>

            <div class="action"> 
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" onclick="deleteTransaction(${id})">
                <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </div>
        `;


        list.appendChild(li);
    });
}

renderList();
updateTotal();

function deleteTransaction(id) {
    const deleteConfirm = confirm('Are you sure you want to delete this transaction?');
    if (deleteConfirm) {
        const index = transactions.findIndex((trans) => trans.id === id);
        transactions.splice(index, 1);
    }
    saveTransactions();
    renderList();
    updateTotal();
}


function addTransaction(e) {
    e.preventDefault();
    const formData = new FormData(this);
    transactions.sort((a, b) => a.id - b.id);
    let new_id = 1;
    for (let trans of transactions) {
        if (new_id != trans.id) break;
        new_id++;
    }

    transactions.push({
        id: new_id,
        name: formData.get("name"),
        amount: parseFloat(formData.get("amount")),
        date: new Date(formData.get("date")),
        type: formData.get("type") === "on" ? "income" : "expense"
    })

    this.reset();
    saveTransactions();
    renderList();
    updateTotal();
}


function saveTransactions() {
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    localStorage.setItem("transactions", JSON.stringify(transactions));
}