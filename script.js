document.addEventListener('DOMContentLoaded', function () {
  const transactionForm = document.getElementById('transactionForm');
  const transactionList = document.getElementById('transactionList');
  const netIncome = document.getElementById('netIncome');
  const netExpenses = document.getElementById('netExpenses');
  const netBalance = document.getElementById('netBalance');

  let transactions = [];

  // Load transactions from local storage
  if (localStorage.getItem('transactions')) {
    transactions = JSON.parse(localStorage.getItem('transactions'));
    renderTransactions();
    updateSummary();
  }

  // Handle form submission
  transactionForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const type = transactionForm.type.value;
    const description = transactionForm.description.value;
    const amount = parseFloat(transactionForm.amount.value);

    if (type && description && amount) {
      const transaction = {
        id: Date.now(),
        type,
        description,
        amount
      };

      transactions.push(transaction);
      saveTransactions();
      renderTransaction(transaction);
      updateSummary();

      // Reset form fields
      transactionForm.reset();
    }
  });

  // Handle transaction deletion
  transactionList.addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-button')) {
      const transactionId = parseInt(event.target.parentElement.dataset.id);
      transactions = transactions.filter(transaction => transaction.id !== transactionId);
      saveTransactions();
      event.target.parentElement.remove();
      updateSummary();
    }
  });

  // Save transactions to local storage
  function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }

  // Render transaction list
  function renderTransactions() {
    transactionList.innerHTML = '';

    transactions.forEach(transaction => {
      renderTransaction(transaction);
    });
  }

  // Render a single transaction
  function renderTransaction(transaction) {
    const item = document.createElement('li');
    item.classList.add('transaction-item');
    item.classList.add(transaction.type);
    item.dataset.id = transaction.id;
    item.innerHTML = `
        <span>${transaction.description}</span>
        <span>Rs.${transaction.amount}</span>
        <button type="button" class="btn btn-outline-danger">Delete</button>

      `;
    transactionList.appendChild(item);
  }

  // Update summary values
  function updateSummary() {
    const income = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0);

    const expenses = transactions
      .filter(transaction => transaction.type === 'expense')
      .reduce((total, transaction) => total + transaction.amount, 0);

    const balance = income - expenses;

    netIncome.textContent = income.toFixed(2);
    netExpenses.textContent = expenses.toFixed(2);
    netBalance.textContent = balance.toFixed(2);
  }
});
