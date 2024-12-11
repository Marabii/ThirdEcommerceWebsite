# E-Commerce Platform

Welcome to the E-Commerce Platform repository! This project is a full-stack e-commerce website built with a React frontend and a Node.js backend. It leverages modern build tools and automation to streamline development and deployment processes.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Build Automation](#build-automation)
- [Contributing](#contributing)
- [Contact](#contact)

## Features

- **Frontend:** Developed using React and Vite for fast and efficient development.
- **Backend:** Built with Node.js and Express, utilizing MongoDB for data storage.
- **Authentication:** Implemented with Passport.js for secure user authentication.
- **Payment Integration:** Stripe for handling payments.
- **Search Functionality:** Algolia for efficient and scalable search.
- **Cloud Storage:** Integration with Google Cloud Storage for managing assets.
- **Real-time Updates:** Nodemon for automatic server restarts during development.

## Project Structure

The project is organized into two main directories: `client` and `server`.

### Client

Contains all frontend-related code.

```
client/
├── src/
│   ├── assets/          # Static assets (images, styles, etc.)
│   ├── components/      # Reusable React components
│   │   ├── CardItem.jsx
│   │   ├── CartItemId.jsx
│   │   ├── CartContainer.jsx
│   │   ├── CartItem.jsx
│   │   ├── Comment.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Input.jsx
│   │   ├── SearchResults.jsx
│   │   ├── SideBarHeader.jsx
│   │   └── TopSection.jsx
│   ├── pages/           # Page components
│   │   ├── About.jsx
│   │   ├── Admin.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── Contact.jsx
│   │   ├── ErrorFallback.jsx
│   │   ├── LandingPage.jsx
│   │   ├── Login.jsx
│   │   ├── PaymentStatus.jsx
│   │   ├── Product.jsx
│   │   ├── Profile.jsx
│   │   ├── Register.jsx
│   │   └── Shop.jsx
│   ├── utils/           # Utility functions and hooks
│   │   ├── convertCurrency.jsx
│   │   ├── useAdminAccess.js
│   │   ├── VerifyJWT.js
│   │   └── verifyUser.js
│   └── main.jsx         # Entry point
├── package.json
└── vite.config.js
```

### Server

Contains all backend-related code.

```
server/
├── assets/              # Static resources (e.g., slider images)
├── config/
│   ├── database.js      # MongoDB connection setup
│   └── passport.js      # Passport.js configuration for authentication
├── lib/                 # Utility functions
├── models/              # Mongoose models
├── products_example/
│   └── products.json    # Sample data to initialize the database
├── routes/              # API route handlers
│   ├── admin.js
│   └── ...              # Other route files
├── .env.example         # Example environment variables
├── package.json
└── server.js            # Entry point
```

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB** instance
- **Stripe** account for payment processing
- **Algolia** account for search functionality
- **Google Cloud Storage** account for asset management

## Installation

### Clone the Repository

```bash
git clone https://github.com/Marabii/ThirdEcommerceWebsite.git
cd ThirdEcommerceWebsite
```

### Install Dependencies

#### Frontend

```bash
cd client
npm install
```

#### Backend

```bash
cd ../server
npm install
```

## Environment Variables

The backend requires several environment variables to function correctly. These variables manage database connections, authentication, payment processing, and more. To obtain the necessary values for these environment variables, please contact [minehamza97@gmail.com].

### Required Environment Variables

- **DB_STRING**: MongoDB connection string.
- **PORT**: Port number on which the server runs.
- **FRONT_END**: URL of the frontend application.
- **BACK_END**: URL of the backend API.
- **STRIPE_PRIVATE_KEY**: Secret key for Stripe payment processing.
- **WEBHOOK_SECRET**: Secret for verifying Stripe webhooks.
- **ALGOLIA_APPLICATION_ID**: Application ID for Algolia search.
- **ALGOLIA_WRITE_API_KEY**: Write API key for Algolia.
- **ALGOLIA_SEARCH_API_KEY**: Search-only API key for Algolia.
- **BUCKET_NAME**: Google Cloud Storage bucket name.
- **GOOGLE_APPLICATION_CREDENTIALS_BASE64**: Base64-encoded credentials for Google Cloud.
- **GoogleOAuth_Client_ID**: Client ID for Google OAuth.
- **GoogleOAuth_Client_Secret**: Client Secret for Google OAuth.

### Setting Up Environment Variables

Create a `.env` file in both `client` and `server` directories based on the `.env.example` file and populate them with the required values.

## Running the Project

### Start the Frontend

```bash
cd client
npm run dev
```

The frontend will be available at `http://localhost:3000` (default Vite port).

### Start the Backend

```bash
cd server
npm run dev
```

The backend server will start using Nodemon for automatic restarts on code changes.

## Build Automation

This project utilizes **npm** as the build tool to automate various tasks:

- **Dependency Management**: Managed via `package.json` for both frontend and backend.
- **Compilation**: React components are compiled using Vite, and backend code is transpiled as needed.
- **Project Version Management**: Handled through `package.json` versioning.
- **Packaging**: Frontend assets are bundled for production, and backend can be packaged into executable formats if required.

### Replicating the Build

The build process is fully replicable using simple commands:

- **Install Dependencies**: `npm install`
- **Start Development Server**: `npm run dev`
- **Build for Production**: `npm run build` (in `client` directory)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## Contact

For any inquiries or to obtain the necessary environment variable values, please contact:

- **Email**: minehamza97@gmail.com
- **GitHub**: [Marabii](https://github.com/Marabii)

---

© 2024 E-Commerce Platform. All rights reserved.
