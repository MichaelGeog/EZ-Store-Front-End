# 📱 EZ Store (Front End)

EZ Store Front End is a modern React-based web application built with Vite for lightning-fast performance. It serves as the user interface for the EZ Store Repair Management System — allowing smartphone repair store owners and staff to manage sales, repairs, inventory, and customer interactions through an intuitive dashboard.

## 🚀 Features

- 🔐 Authentication System — Login and signup integrated with backend JWT authentication
- 🛠️ Repair Management Dashboard — Manage device repairs, status updates, and technician tracking
- 💰 POS (Point of Sale) — Register sales, manage checkout, and view transaction history
- 📦 Inventory Management — View and manage devices, accessories, and spare parts
- 👥 Customer Search — Quickly find and update customer details
- 🧭 Responsive Navigation — Seamless page transitions using React Router
- ⚡ Optimized Development — Vite ensures fast builds and hot module replacement

---

## ⚙️ Tech Stack

- React 19 – Front-end library for building dynamic UIs
- React Router DOM 7 – Handles client-side routing and navigation
- Axios – For API calls to the backend
- React Cookie – For managing authentication cookies
- Font Awesome – Provides scalable vector icons for the interface
- Vite – Fast build tool and development server
- ESLint – Linting for consistent and clean code

---

## 📁 Folder Structure

```
Front End
├─ README.md
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  ├─ fullLogo.png
│  └─ logo.png
├─ src
│  ├─ App.jsx
│  ├─ components
│  │  ├─ loginForm.jsx
│  │  └─ signUpForm.jsx
│  ├─ context
│  │  └─ AuthContext.jsx
│  ├─ index.css
│  ├─ main.jsx
│  └─ pages
│     ├─ authPage
│     │  ├─ authPage.css
│     │  └─ authPage.jsx
│     ├─ mainPage
│     │  ├─ Dashboard.jsx
│     │  └─ dashboard.css
│     ├─ myStore
│     │  ├─ AccessoriesTab.jsx
│     │  ├─ CustomersTab.jsx
│     │  ├─ DevicesTab.jsx
│     │  ├─ MyStore.css
│     │  └─ MyStore.jsx
│     └─ registerSalePage
│        ├─ registerSale.css
│        └─ registerSale.jsx
└─ vite.config.js

```

---

## 🧠 Notes

- The app communicates with the EZ Store Backend API for data handling. [Backend](https://github.com/MichaelGeog/EZ-Store-Back-End)
- Ensure the backend server is running before using API features.
