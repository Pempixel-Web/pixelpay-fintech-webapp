// =====================================================
// Pixel Pay — app.js
// =====================================================

// --- Default demo users (embedded so the app works with or without a server) ---
const DEFAULT_USERS = [
  {
    username: "user1",
    password: "pass1",
    fullName: "Vincent Ezekiel Oluwapelumi",
    email: "tech.pempixel@gmail.com",
    joinDate: "2023-01-01",
    accountNumber: "8129473352",
    balance: 5000,
    transactions: [
      { transactionId: "TXN001", type: "deposit", amount: 500, date: "2023-10-01", description: "Account Charge", category: "Income", status: "Successful" },
      { transactionId: "TXN002", type: "withdrawal", amount: 200, date: "2023-10-02", description: "Online Payment", category: "Purchase", status: "Successful" },
    ],
  },
  {
    username: "user2",
    password: "pass2",
    fullName: "Maryam Mohammadi",
    email: "maryam@example.com",
    joinDate: "2023-02-15",
    accountNumber: "ACC002",
    balance: 1700,
    transactions: [
      { transactionId: "TXN003", type: "deposit", amount: 1000, date: "2023-09-15", description: "Gift Received", category: "Income", status: "Successful" },
      { transactionId: "TXN004", type: "deposit", amount: 1000, date: "2023-09-20", description: "Salary Deposit", category: "Income", status: "Successful" },
      { transactionId: "TXN005", type: "withdrawal", amount: 300, date: "2023-09-25", description: "Electricity Bill Payment", category: "Bill Payment", status: "Pending" },
    ],
  },
  {
    username: "user3",
    password: "pass3",
    fullName: "Reza Rezaee",
    email: "reza@example.com",
    joinDate: "2023-03-10",
    accountNumber: "ACC003",
    balance: 2000,
    transactions: [
      { transactionId: "TXN006", type: "deposit", amount: 700, date: "2023-10-05", description: "Salary Deposit", category: "Income", status: "Successful" },
      { transactionId: "TXN007", type: "withdrawal", amount: 200, date: "2023-10-06", description: "Grocery Shopping", category: "Purchase", status: "Successful" },
    ],
  },
  {
    username: "user4",
    password: "pass4",
    fullName: "Sara Karimi",
    email: "sara@example.com",
    joinDate: "2023-04-20",
    accountNumber: "ACC004",
    balance: 3500,
    transactions: [
      { transactionId: "TXN008", type: "deposit", amount: 1000, date: "2023-09-10", description: "Gift Received", category: "Income", status: "Successful" },
      { transactionId: "TXN009", type: "deposit", amount: 1500, date: "2023-09-15", description: "Salary Deposit", category: "Income", status: "Successful" },
      { transactionId: "TXN010", type: "withdrawal", amount: 500, date: "2023-09-20", description: "Rent Payment", category: "Payment", status: "Pending" },
    ],
  },
];

// Global variable to track sort order (true = ascending, false = descending)
let ascending = true;

// --- DOM Selections ---
// Login
const loginFormEl = document.getElementById("login-form-el");
const loginPanel = document.querySelector(".login-form:not(.signup-form)");
const usernameInput = document.querySelector(".input-username");
const passwordInput = document.querySelector(".input-password");
const messageDiv = document.querySelector(".login-form:not(.signup-form) .message");

// Signup
const signupFormEl = document.getElementById("signup-form-el");
const signupPanel = document.querySelector(".signup-form");
const fullnameInput = document.querySelector(".input-fullname");
const newUsernameInput = document.querySelector(".input-new-username");
const emailInput = document.querySelector(".input-email");
const newPasswordInput = document.querySelector(".input-new-password");
const signupMessageDiv = document.querySelector(".signup-message");

const showSignupLink = document.getElementById("show-signup");
const showLoginLink = document.getElementById("show-login");

// Dashboard
const dashboard = document.querySelector(".user-panel");
const fullName = document.querySelector(".fullName");
const email = document.querySelector(".email");
const balance = document.querySelector(".balance");
const income = document.querySelector(".income");
const expenses = document.querySelector(".expenses");
const id = document.querySelector(".id");
const joinDate = document.querySelector(".joinDate");

// Logout Buttons
const logoutBtn = document.querySelector(".btn-logout");
const logoutBtnMobile = document.querySelector(".btn-logout-mobile");

// Recent + full transactions tables
const tbody = document.querySelector(".tbody");
const tbodyFull = document.querySelector(".tbody-full");

// Quick actions
const actionSend = document.getElementById("action-send");
const actionAdd = document.getElementById("action-add");
const actionTransactions = document.getElementById("action-transactions");
const sendForm = document.getElementById("send-form");
const addForm = document.getElementById("add-form");

const input_send_to = document.querySelector(".input-send-to");
const input_send_amount = document.querySelector(".input-send-amount");
const btn_send = document.querySelector(".btn-send");

const input_deposit = document.querySelector(".input-deposit");
const btn_deposit = document.querySelector(".btn-deposit");

// Modal
const transactionsModal = document.getElementById("transactions-modal");
const closeTransactionsModal = document.getElementById("close-transactions-modal");

// Chevron Icon for Sorting Amount Column (in modal now)
const chevron_down = document.querySelector(".chevron-head");

// Dark mode
const toggleButton = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const mobileToggleButton = document.getElementById("mobile-theme-toggle");
const mobileThemeIcon = document.getElementById("mobile-theme-icon");
const body = document.body;

// Mobile menu
const hamburgerBtn = document.getElementById("hamburger-btn");
const mobileMenu = document.getElementById("mobile-menu");

// Reset User
let currentUser = null;

// =====================================================
// --- Local account storage helpers (signup accounts) ---
// =====================================================
function getCustomUsers() {
  try {
    return JSON.parse(localStorage.getItem("pixelpayUsers")) || [];
  } catch (e) {
    return [];
  }
}

function saveCustomUsers(users) {
  localStorage.setItem("pixelpayUsers", JSON.stringify(users));
}

function getAllUsers() {
  return [...DEFAULT_USERS, ...getCustomUsers()];
}

function usernameExists(username) {
  return getAllUsers().some(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );
}

function generateAccountNumber() {
  return String(Math.floor(1000000000 + Math.random() * 8999999999));
}

// --- Validate login credentials against demo + signup accounts ---
function validationUser(username, password) {
  const user = getAllUsers().find(
    (u) => u.username === username && u.password === password
  );
  return user || null;
}

// --- Persist a user's updated data (balance/transactions) ---
function persistUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));

  // If this is a custom (signed-up) user, also update it in pixelpayUsers
  if (user.isCustom) {
    const customUsers = getCustomUsers();
    const idx = customUsers.findIndex((u) => u.username === user.username);
    if (idx !== -1) {
      customUsers[idx] = user;
      saveCustomUsers(customUsers);
    }
  }
}

// =====================================================
// --- Form switching (Login <-> Signup) ---
// =====================================================
showSignupLink?.addEventListener("click", (e) => {
  e.preventDefault();
  loginPanel.style.display = "none";
  signupPanel.style.display = "flex";
});

showLoginLink?.addEventListener("click", (e) => {
  e.preventDefault();
  signupPanel.style.display = "none";
  loginPanel.style.display = "flex";
});

// =====================================================
// --- User Login ---
// =====================================================
loginFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  const user = validationUser(username, password);
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    loginPanel.style.display = "none";
    signupPanel.style.display = "none";
    dashboard.style.display = "grid";
    loadDashboard();
  } else {
    messageDiv.style.display = "flex";
    messageDiv.textContent = "Username or password is incorrect!";
  }
});

// =====================================================
// --- User Signup ---
// =====================================================
signupFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const fullNameVal = fullnameInput.value.trim();
  const usernameVal = newUsernameInput.value.trim();
  const emailVal = emailInput.value.trim();
  const passwordVal = newPasswordInput.value;

  signupMessageDiv.style.display = "flex";

  if (!fullNameVal || !usernameVal || !emailVal || !passwordVal) {
    signupMessageDiv.textContent = "Please fill in all fields.";
    return;
  }

  if (usernameExists(usernameVal)) {
    signupMessageDiv.textContent = "That username is already taken.";
    return;
  }

  const newUser = {
    username: usernameVal,
    password: passwordVal,
    fullName: fullNameVal,
    email: emailVal,
    joinDate: new Date().toISOString().split("T")[0],
    accountNumber: generateAccountNumber(),
    balance: 0,
    isCustom: true,
    transactions: [],
  };

  const customUsers = getCustomUsers();
  customUsers.push(newUser);
  saveCustomUsers(customUsers);

  signupMessageDiv.style.color = "#bff7c9";
  signupMessageDiv.textContent = "Account created! You can now log in.";

  signupFormEl.reset();

  // Switch back to login after a short pause and prefill username
  setTimeout(() => {
    signupPanel.style.display = "none";
    loginPanel.style.display = "flex";
    usernameInput.value = usernameVal;
    passwordInput.value = "";
    passwordInput.focus();
    signupMessageDiv.style.color = "";
  }, 1200);
});

// =====================================================
// --- Load Dashboard ---
// =====================================================
function loadDashboard() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) return;

  // Top Dashboard: Display user details
  fullName.textContent = user.fullName;
  email.textContent = `(${user.email})`;
  balance.textContent = user.balance.toLocaleString();
  id.textContent = user.accountNumber;
  joinDate.textContent = `(${user.joinDate})`;

  // Calculate income (successful deposits) and expenses (successful withdrawals)
  const depositTotal = user.transactions.reduce((acc, curr) => {
    return curr.type === "deposit" && curr.status === "Successful" ? acc + curr.amount : acc;
  }, 0);
  income.textContent = depositTotal.toLocaleString();

  const withdrawTotal = user.transactions.reduce((acc, curr) => {
    return curr.type === "withdrawal" && curr.status === "Successful" ? acc + curr.amount : acc;
  }, 0);
  expenses.textContent = withdrawTotal.toLocaleString();

  // --- Recent transactions (small list): most recent 5 by date ---
  const recent = [...user.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  tbody.innerHTML = renderRows(recent);
  colorStatuses(tbody);

  // --- Full transactions (modal): sortable by amount ---
  renderFullTransactions(user);
}

function renderRows(list) {
  return list
    .map(
      (transaction) => `
    <tr>
      <td>${transaction.type === "deposit" ? "Deposit" : "Withdraw"}</td>
      <td>${transaction.type === "deposit" ? "+" : "-"}${transaction.amount.toLocaleString()}</td>
      <td>${transaction.date.replace(/-/g, "/")}</td>
      <td>${transaction.description}</td>
      <td>${transaction.status}</td>
    </tr>
  `
    )
    .join("");
}

function colorStatuses(tableBody) {
  tableBody.querySelectorAll("tr td:nth-child(5)").forEach((td) => {
    if (td.textContent.trim() === "Successful") {
      td.style.color = "#16a34a"; // green
    } else if (td.textContent.trim() === "Pending") {
      td.style.color = "#d97706"; // amber
    }
  });
}

function renderFullTransactions(user) {
  const sorted = [...user.transactions].sort((a, b) => {
    const effectiveAmountA = a.type === "deposit" ? a.amount : -a.amount;
    const effectiveAmountB = b.type === "deposit" ? b.amount : -b.amount;
    return ascending ? effectiveAmountA - effectiveAmountB : effectiveAmountB - effectiveAmountA;
  });

  tbodyFull.innerHTML = renderRows(sorted);
  colorStatuses(tbodyFull);
}

// =====================================================
// --- Sorting Functionality (full transactions modal) ---
// =====================================================
function sortByAmount() {
  ascending = !ascending;
  if (ascending) {
    chevron_down.classList.remove("fa-chevron-up");
    chevron_down.classList.add("fa-chevron-down");
  } else {
    chevron_down.classList.remove("fa-chevron-down");
    chevron_down.classList.add("fa-chevron-up");
  }
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (user) renderFullTransactions(user);
}

chevron_down?.addEventListener("click", sortByAmount);

// =====================================================
// --- Quick Actions: toggle inline forms ---
// =====================================================
function closeAllActionForms() {
  sendForm.style.display = "none";
  addForm.style.display = "none";
}

actionSend.addEventListener("click", () => {
  const isOpen = sendForm.style.display === "flex";
  closeAllActionForms();
  sendForm.style.display = isOpen ? "none" : "flex";
});

actionAdd.addEventListener("click", () => {
  const isOpen = addForm.style.display === "flex";
  closeAllActionForms();
  addForm.style.display = isOpen ? "none" : "flex";
});

actionTransactions.addEventListener("click", () => {
  transactionsModal.classList.add("open");
});

closeTransactionsModal.addEventListener("click", () => {
  transactionsModal.classList.remove("open");
});

transactionsModal.addEventListener("click", (e) => {
  if (e.target === transactionsModal) {
    transactionsModal.classList.remove("open");
  }
});

// =====================================================
// --- Transaction: Add Money (deposit) ---
// =====================================================
btn_deposit.addEventListener("click", () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const amount = parseFloat(input_deposit.value);

  if (!amount || amount <= 0) {
    alert("Invalid amount!");
    return;
  }

  const newTransaction = {
    transactionId: "TXN" + Date.now(),
    type: "deposit",
    amount: amount,
    date: new Date().toISOString().split("T")[0],
    description: "Money Added",
    category: "Income",
    status: "Successful",
  };

  user.balance += amount;
  user.transactions.push(newTransaction);
  persistUser(user);
  loadDashboard();
  input_deposit.value = "";
  closeAllActionForms();
});

// =====================================================
// --- Transaction: Send Money (demo transfer) ---
// =====================================================
btn_send.addEventListener("click", () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const recipient = input_send_to.value.trim();
  const amount = parseFloat(input_send_amount.value);

  if (!recipient) {
    alert("Please enter a recipient username.");
    return;
  }
  if (recipient === user.username) {
    alert("You can't send money to yourself.");
    return;
  }
  if (!amount || amount <= 0) {
    alert("Invalid amount!");
    return;
  }
  if (amount > user.balance) {
    alert(`Insufficient funds! Available balance: ${user.balance.toLocaleString()}`);
    return;
  }

  const newTransaction = {
    transactionId: "TXN" + Date.now(),
    type: "withdrawal",
    amount: amount,
    date: new Date().toISOString().split("T")[0],
    description: `Sent to ${recipient}`,
    category: "Transfer",
    status: "Successful",
  };

  user.balance -= amount;
  user.transactions.push(newTransaction);
  persistUser(user);

  // If the recipient is a known local (signed-up) user, credit them too — demo only.
  const customUsers = getCustomUsers();
  const recipientIdx = customUsers.findIndex((u) => u.username === recipient);
  if (recipientIdx !== -1) {
    customUsers[recipientIdx].balance += amount;
    customUsers[recipientIdx].transactions.push({
      transactionId: "TXN" + (Date.now() + 1),
      type: "deposit",
      amount: amount,
      date: new Date().toISOString().split("T")[0],
      description: `Received from ${user.username}`,
      category: "Transfer",
      status: "Successful",
    });
    saveCustomUsers(customUsers);
  }

  loadDashboard();
  input_send_to.value = "";
  input_send_amount.value = "";
  closeAllActionForms();
});

// =====================================================
// --- Logout ---
// =====================================================
function doLogout() {
  localStorage.removeItem("currentUser");
  dashboard.style.display = "none";
  loginPanel.style.display = "flex";
  signupPanel.style.display = "none";
  usernameInput.value = "";
  passwordInput.value = "";
  messageDiv.style.display = "none";
  mobileMenu.classList.remove("open");
}

logoutBtn.addEventListener("click", doLogout);
logoutBtnMobile?.addEventListener("click", doLogout);

// =====================================================
// --- Preserve User Status on Page Load ---
// =====================================================
window.addEventListener("load", () => {
  if (localStorage.getItem("currentUser")) {
    loginPanel.style.display = "none";
    signupPanel.style.display = "none";
    dashboard.style.display = "grid";
    loadDashboard();
  }
});

// =====================================================
// --- Dark / Light mode ---
// =====================================================
function applyTheme(theme) {
  if (theme === "dark") {
    body.classList.add("dark-theme");
    themeIcon.textContent = "🌞";
    if (mobileThemeIcon) mobileThemeIcon.textContent = "🌞";
  } else {
    body.classList.remove("dark-theme");
    themeIcon.textContent = "🌙";
    if (mobileThemeIcon) mobileThemeIcon.textContent = "🌙";
  }
}

if (localStorage.getItem("theme") === "dark") {
  applyTheme("dark");
}

function toggleTheme() {
  const isDark = body.classList.toggle("dark-theme");
  if (isDark) {
    localStorage.setItem("theme", "dark");
    applyTheme("dark");
  } else {
    localStorage.setItem("theme", "light");
    applyTheme("light");
  }
}

toggleButton.addEventListener("click", toggleTheme);
mobileToggleButton?.addEventListener("click", toggleTheme);

// =====================================================
// --- Mobile menu toggle ---
// =====================================================
hamburgerBtn?.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
});
