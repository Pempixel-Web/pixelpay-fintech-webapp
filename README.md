# Pixel Pay

# 🏦 About
A simple banking dashboard app called **Pixel Pay** — sign up, log in, and manage a
demo account with balance tracking, quick actions, and transaction history. Built
with vanilla JavaScript and modern CSS.

## ✨ Features
- **Login & Sign Up**
  - Log in with an existing demo account or create your own.
  - New accounts are validated for unique usernames and stored locally.
  - Session persistence using `localStorage`.
- **Simple Banking Dashboard**
  - Balance, Income, and Expenses stat cards.
  - Account number, join date, and personal details.
  - Small "Recent Transactions" list plus a full sortable history in a modal.
- **Quick Actions**
  - **Add Money** — top up your balance (demo only).
  - **Send Money** — transfer to another username (demo only; if the recipient
    is a locally signed-up account, their balance is credited too).
  - **Transactions** — view the full, sortable transaction history.
- **Dark / Light mode** toggle.
- **Responsive** — clean layout on desktop, tablet, and mobile, with a mobile
  hamburger menu for account controls.
- **Data Persistence** — demo accounts, sessions, and theme preference are all
  stored in `localStorage`. No backend or real payment processing is involved.

## 🛠️ Technologies
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Styling**: CSS Grid, Flexbox, Custom Properties
- **Data Handling**: `localStorage`

## 🚀 Demo Accounts
- **User 1:** username `user1` / password `pass1`
- **User 2:** username `user2` / password `pass2`
- **User 3:** username `user3` / password `pass3`
- **User 4:** username `user4` / password `pass4`

Or create your own account from the "Create an account" link on the login page.

## ▶️ Running locally
This is a static site — no build step or server required. Just open
`index.html` directly in a browser, or serve the folder with any static file
server (e.g. `npx serve .`).

## 📝 License
All rights reserved!
