# 📦 E-Commerce Platform: A Step-by-Step Tutorial

Welcome to the **E-Commerce Platform** tutorial! This guide will walk you through setting up, running, and contributing to a full-stack e-commerce website built with **React** and **Node.js**. Let's get started!

---

## Table of Contents

1. [Features Overview](#1-features-overview)
2. [Project Structure](#2-project-structure)
3. [Prerequisites](#3-prerequisites)
4. [Installation](#4-installation)
5. [Setting Up Environment Variables](#5-setting-up-environment-variables)
6. [Running the Project](#6-running-the-project)
7. [Build Automation](#7-build-automation)
8. [Contributing](#8-contributing)
9. [Contact](#9-contact)
10. [License](#10-license)

---

## 1. Features Overview

This e-commerce platform includes:

- **Frontend:** React with Vite for efficient development.
- **Backend:** Node.js and Express with MongoDB for storage.
- **Authentication:** Passport.js for secure login.
- **Payments:** Stripe for processing payments.
- **Search:** Algolia for advanced search.
- **Cloud Storage:** Google Cloud Storage for media assets.
- **Real-time Updates:** Nodemon for automatic backend restarts.

---

## 2. Project Structure

### 📂 **Client (Frontend)**

The `client` folder contains the frontend code.

```
client/
├── src/
│   ├── assets/          # Images, styles, etc.
│   ├── components/      # Reusable components
│   ├── pages/           # Page-level components
│   ├── utils/           # Utility functions and hooks
│   └── main.jsx         # App entry point
├── package.json
└── vite.config.js
```

### 📂 **Server (Backend)**

The `server` folder contains the backend code.

```
server/
├── assets/              # Static resources
├── config/              # Configuration files
├── lib/                 # Utility functions
├── models/              # Database models
├── routes/              # API route handlers
├── products_example/    # Sample data
├── .env.example         # Example environment variables
├── package.json
└── server.js            # Entry point
```

---

## 3. Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v14 or higher): [Download Node.js](https://nodejs.org/)
2. **npm** (v6 or higher): Comes with Node.js
3. **MongoDB**: [Download MongoDB](https://www.mongodb.com/)
4. **Stripe** Account: [Sign up for Stripe](https://stripe.com/)
5. **Algolia** Account: [Sign up for Algolia](https://www.algolia.com/)
6. **Google Cloud Storage** Account: [Set up Google Cloud](https://cloud.google.com/storage)

---

## 4. Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/Marabii/ThirdEcommerceWebsite.git
cd ThirdEcommerceWebsite
```

### Step 2: Install Dependencies

#### Frontend Installation

```bash
cd client
npm install
```

#### Backend Installation

```bash
cd ../server
npm install
```

---

## 5. Setting Up Environment Variables

### Step 1: Create `.env` Files

Copy the `.env.example` file in both `client` and `server` directories and rename them to `.env`.

### Step 2: Populate Environment Variables

Add the following variables to your `.env` files:

#### Backend `.env` File

```plaintext
DB_STRING=<Your MongoDB Connection String>
PORT=5000
FRONT_END=http://localhost:3000
BACK_END=http://localhost:5000
STRIPE_PRIVATE_KEY=<Your Stripe Secret Key>
WEBHOOK_SECRET=<Your Stripe Webhook Secret>
ALGOLIA_APPLICATION_ID=<Your Algolia App ID>
ALGOLIA_WRITE_API_KEY=<Your Algolia Write API Key>
ALGOLIA_SEARCH_API_KEY=<Your Algolia Search API Key>
BUCKET_NAME=<Your Google Cloud Storage Bucket>
GOOGLE_APPLICATION_CREDENTIALS_BASE64=<Base64-encoded Google Credentials>
GoogleOAuth_Client_ID=<Google OAuth Client ID>
GoogleOAuth_Client_Secret=<Google OAuth Client Secret>
```

---

## 6. Running the Project

### Step 1: Start the Backend

Navigate to the `server` directory and run:

```bash
npm run dev
```

- The backend server will run at: **`http://localhost:5000`**

### Step 2: Start the Frontend

Open a new terminal, navigate to the `client` directory, and run:

```bash
npm run dev
```

- The frontend app will be available at: **`http://localhost:3000`**

---

## 7. Build Automation

### Available Commands

#### Frontend

- **Start Development Server**:
  ```bash
  npm run dev
  ```
- **Build for Production**:
  ```bash
  npm run build
  ```

#### Backend

- **Start Backend with Nodemon**:
  ```bash
  npm run dev
  ```

---

## 8. Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the Repository**.
2. **Create a New Branch**:
   ```bash
   git checkout -b feature/YourFeature
   ```
3. **Commit Your Changes**:
   ```bash
   git commit -m 'Add a new feature'
   ```
4. **Push to Your Branch**:
   ```bash
   git push origin feature/YourFeature
   ```
5. **Submit a Pull Request**.

---

## 9. Contact

For inquiries or environment variable access, contact:

- 📧 **Email**: [minehamza97@gmail.com](mailto:minehamza97@gmail.com)
- 🐙 **GitHub**: [Marabii](https://github.com/Marabii)

---

## 10. License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

---

© 2024 E-Commerce Platform. All rights reserved.
