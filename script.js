// ===== DOM Elements =====
const form = document.getElementById('form');
const typeSelect = document.getElementById('type');
const categorySelect = document.getElementById('category');
const amountInput = document.getElementById('amount');
const transactionsList = document.getElementById('transactions');
const balanceDisplay = document.getElementById('balance');

// ===== Data Store =====
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// ===== Categories =====
const incomeCategories = ['Salary', 'Freelance', 'Interest', 'Investment', 'Bonus'];
const expenseCategories = ['Rent', 'Groceries', 'Utilities', 'Transport', 'Entertainment', 'Shopping', 'Medical'];

// ===== Utility Functions =====
const formatCurrency = amount =>
  `${amount < 0 ? '-' : ''}$${Math.abs(amount).toFixed(2)}`;

const formatDate = date =>
  new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

// ===== Category Handling =====
function updateCategoryOptions() {
  categorySelect.innerHTML = '';
  const currentCategories = typeSelect.value === 'income' ? incomeCategories : expenseCategories;
  currentCategories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

// ===== Transaction Handling =====
function handleAddTransaction(e) {
  e.preventDefault();

  const type = typeSelect.value;
  const category = categorySelect.value;
  const amount = parseFloat(amountInput.value);

  if (!category || isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount and select a category.');
    return;
  }

  const newTransaction = {
    id: Date.now(),
    type,
    category,
    amount: type === 'income' ? amount : -amount,
    date: new Date().toISOString()
  };

  transactions.push(newTransaction);
  saveTransactions();
  renderTransactions();
  amountInput.value = '';
}

// ===== Render Functions =====
function renderTransactions() {
  transactionsList.innerHTML = '';
  transactions.forEach(transaction => {
    const li = document.createElement('li');
    li.classList.add(transaction.amount < 0 ? 'expense' : 'income');

    li.innerHTML = `
      <div class="transaction-info">
        <strong>${transaction.category}</strong>
        <small>${formatDate(transaction.date)}</small>
      </div>
      <div>
        <span>${formatCurrency(transaction.amount)}</span>
        <button class="delete-btn" aria-label="Delete" onclick="handleDeleteTransaction(${transaction.id})">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;
    transactionsList.appendChild(li);
  });

  updateBalance();
}

function updateBalance() {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2);
  balanceDisplay.textContent = `$${total}`;
}

// ===== Deletion Handling =====
window.handleDeleteTransaction = function (id) {
  const confirmDelete = confirm('Are you sure you want to delete this transaction?');
  if (!confirmDelete) return;

  transactions = transactions.filter(t => t.id !== id);
  saveTransactions();
  renderTransactions();
};

// ===== Local Storage =====
function saveTransactions() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// ===== Init =====
function init() {
  updateCategoryOptions();
  renderTransactions();
}

// ===== Events =====
form.addEventListener('submit', handleAddTransaction);
typeSelect.addEventListener('change', updateCategoryOptions);

// ===== Run App =====
init();
