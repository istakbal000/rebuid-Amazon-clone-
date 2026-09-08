# Amazon Clone (8x Assignment)

A full-stack, end-to-end ecommerce web application designed to replicate the core shopping experience of Amazon.com. This project was built to demonstrate product judgment, strong engineering practices, and excellent UX/UI.

## 🚀 Features

- **Responsive UI/UX:** Clean, modern, Amazon-inspired design built with Tailwind CSS.
- **Product Catalog:** Browse products with categories, search functionality, and detailed product pages (including image galleries, ratings, and stock status).
- **Shopping Cart:** Add items, adjust quantities, and view real-time subtotal calculations.
- **Checkout Flow:** Seamless, multi-step checkout experience including shipping address management and mock payment selection.
- **Order Management:** View order history and detailed breakdowns of past purchases.
- **Authentication:** Secure user registration and login utilizing JWT and bcrypt password hashing.

## 🛠️ Tech Stack

### Frontend
- **React.js** with Vite
- **Tailwind CSS** for responsive styling
- **React Router** for declarative navigation
- **Context API** for global state management (Auth & Cart)
- **Axios** for API requests
- **Lucide React** for icons

### Backend
- **Node.js** & **Express.js** for the RESTful API
- **MongoDB** & **Mongoose** for data modeling and persistence
- **JWT** (JSON Web Tokens) for authentication
- **bcrypt** for secure password hashing

## 📦 Running Locally

To run this project on your local machine, follow these steps:

### Prerequisites
- Node.js installed on your machine
- MongoDB running locally or a MongoDB Atlas URI

### 1. Clone the repository
```bash
git clone https://github.com/istakbal000/rebuid-Amazon-clone-.git
cd rebuid-Amazon-clone-
```

### 2. Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file inside the `server` directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/amazon-rebuild
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Seed the database (generates mock products and categories):
   ```bash
   npm run seed
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```
   *The server will run on `http://localhost:5000`*

### 3. Frontend Setup
1. Open a new terminal instance and navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The app will run on `http://localhost:5173`*

## 📁 Project Structure

```
├── .agent-logs/         # Automated prompt/response capture logs
├── client/              # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components (Header, Footer, ProductCard)
│   │   ├── context/     # React Context providers (AuthContext, CartContext)
│   │   └── pages/       # Page components (Home, Checkout, Orders, etc.)
├── server/              # Node.js Express backend API
│   ├── src/
│   │   ├── config/      # Database connection
│   │   ├── controllers/ # Request handlers for routes
│   │   ├── middleware/  # Custom middleware (JWT auth protection)
│   │   ├── models/      # Mongoose database schemas
│   │   ├── routes/      # Express API route definitions
│   │   └── scripts/     # Database seeding scripts
└── README.md
```

## 🔒 Security Practices
- Sensitive data is stored in environment variables.
- Passwords are never stored in plain text; they are hashed using `bcrypt` before entering the database.
- Commerce values (prices, subtotals, taxes, shipping) are fully calculated and validated on the backend to prevent frontend manipulation. 

## 📝 License
This project was built as an assignment and is intended for demonstration purposes.
