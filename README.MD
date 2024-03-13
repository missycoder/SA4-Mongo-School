# Mongo School Express API

This is an Express.js API for managing professors, modules, and user authentication for a fictional educational platform called Mongo School. The API utilizes MongoDB as the database and provides endpoints for CRUD operations on professors and modules, as well as user authentication and registration.

## Features

- Create, read, update, and delete professors
- Create, read, update, and delete modules
- User authentication with JWT (JSON Web Tokens)
- User registration with hashed passwords stored in the database

## Prerequisites

Before running the application, make sure you have the following installed:

- Node.js
- MongoDB
- npm or yarn package manager

## Getting Started

## Clone the repository:

   ```bash
   git clone https://github.com/your-username/mongo-school-express-api.git

# Install dependencies:

cd mongo-school
npm install

# Configure environment variables:
Create a `.env` file in the root directory and add the following:

MONGO_URI=your_mongodb_connection_string
TOKEN_SECRET=your_jwt_secret

# Run the application:

npm start

# Access the API:

The API will be running on 'http://localhost:3000'.

# Endpoints
- GET /professors: Retrieve all professors

- POST /professors: Add a new professor

- PUT /professors/:id: Update a professor by ID

- DELETE /professors/:id: Delete a professor by ID

- GET /modules: Retrieve all modules

- POST /modules: Add a new module

- PUT /modules/:id: Update a module by ID

- DELETE /modules/:id: Delete a module by ID

- POST /signup: User signup

- POST /login: User login (authentication)

- GET /profile: Retrieve user profile (protected route)

- GET /payment: Access protected payment route (example)

