# Business Cards Backend

Welcome to the **Business Cards Backend** project! This repository contains the backend API for managing business cards, built using Node.js and Express. The API allows for user registration, login, card creation, and management, following modern development practices like hexagonal architecture and environment-based configuration.

## Table of Contents

1. [Introduction](#introduction)
2. [Technologies Used](#technologies-used)
3. [Getting Started](#getting-started)
4. [Configuration](#configuration)
5. [Providers and Architecture](#providers-and-architecture)
6. [Logging](#logging)
7. [Account Lockout](#account-lockout)
8. [Database Seeding](#database-seeding)
9. [Testing](#testing)
10. [API Documentation](#api-documentation)

## Introduction

The **Business Cards Backend** project is designed to handle the backend services for managing business cards. It provides API endpoints for users to register, login, create, edit, and delete business cards, with support for Google OAuth 2.0 for authentication.

### Key Features
- User Registration and Login
- Google OAuth 2.0 Integration
- Business Card CRUD Operations
- Admin Panel for User Management
- Environment-Based Configuration
- Hexagonal Architecture for easy extensibility

## Technologies Used

### Backend Frameworks and Libraries
- **Express**: A minimal and flexible Node.js web application framework.
- **Mongoose**: A MongoDB object modeling tool.
- **Joi**: A data validation library.
- **Passport**: Middleware for Google OAuth 2.0 authentication.
- **JWT**: For secure transmission of information.
- **Config**: Manages multiple configuration files.
- **Cors**: Enables Cross-Origin Resource Sharing.
- **Bcryptjs**: For hashing passwords.
- **Morgan**: HTTP request logger.
- **Chalk**: Terminal string styling.
- **Vite**: Build tool for setting up the project.

### Testing Tools
- **Mocha** and **Chai**: For writing and running tests.
- **Cross-env**: Sets environment variables across platforms.
- **Axios**: HTTP client for API requests in tests.

### Environment Management
- **Dotenv**: Loads environment variables from `.env` files.
- **Nodemon**: Restarts server automatically upon changes.

## Getting Started

### Prerequisites
- **Node.js**: Version 14 or higher.
- **MongoDB**: Local or cloud-based MongoDB instance.

### Installation
1. **Clone the Repository**
   ```bash
   git clone https://github.com/roshiroku/cards-server.git
   cd cards-server
   ```
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Environment Setup**
   Create `.env`, `.development.env`, and `.test.env` files with appropriate configurations:
   ```
   NODE_ENV=development
   PORT=3000
   TOKEN_SECRET=your_jwt_secret_key
   DB_CONNECTION_STRING=mongodb://localhost:27017/cardsdb

   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

### Running the Application
- **Development Mode**: Runs with Nodemon.
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm start
  ```

### Running Tests
To run the test suite:
```bash
npm test
```

## Configuration

The project uses multiple configuration files for different environments, allowing easy switching between development, production, and testing settings.

### Configuration Files (`config` folder)
- **`default.json`**: General settings (database, authentication, validation, logging, seeding).
- **`development.json`**: Extends default with local development-specific settings (e.g., enabling CORS).
- **`production.json`**: Extends default with seeding disabled for production.
- **`test.json`**: Extends default with seeding and logging disabled for clean testing.

### Environment Variables
Environment variables are defined in `.env`, `.development.env`, and `.test.env` files for production, development, and testing, respectively.

## Providers and Architecture

This project uses hexagonal architecture, promoting separation of concerns and making the system extensible.

- **Database Providers**: Uses MongoDB by default, managed via Mongoose. Other databases can be added with minimal changes.
- **Authentication Providers**: Default authentication is via Google OAuth 2.0 using Passport.js. Additional providers like Facebook or GitHub can be added.
- **Logging Providers**: Default logging is handled using Morgan. Other logging providers can be added or replaced as needed.
- **Token Providers**: Default token handling is done using JWT, which can be replaced or extended with other token management solutions.

## Logging

The logging system is highly configurable, allowing customization in format, target, and colors.

- **Format**: Defines log message structure, supporting default and error-specific formats.
- **Target**: Specifies log destinations (console, files) based on severity levels (`info`, `success`, `error`).
- **Colors**: Uses Chalk for different colors based on severity, making log messages easy to differentiate.

## Account Lockout

To protect against brute force attacks, accounts can be locked after a configurable number of failed login attempts.

- **`maxAttempts`**: Maximum allowed failed consecutive login attempts before locking. (Default: `3`)
- **`resetTime`**: Hours before resetting failed attempts count. (Default: `1` hour)
- **`banTime`**: Duration for which an account remains locked. (Default: `24` hours)

## Database Seeding (`seed` folder)

Database seeding initializes the database with sample data for easier development and testing.

- **Seed Configuration**: Controlled via configuration files.
- **Available Seed Files**:
  - **`users.json`**: Contains an admin user, a business user, and a regular user.
  - **`cards.json`**: Contains three business cards assigned to the business user.
- **Environment Settings**:
  - **Production**: Seeding disabled to avoid data conflicts.
  - **Development**: Seeding enabled for easier development.
  - **Testing**: Seeding disabled for clean test environments.

## Testing (`test` folder)

### Testing Setup
Tests are located in the `test` folder, covering all major functionalities such as user management, authentication, card management, and admin operations.

### Test Coverage
- **User Management**: Registration, login, profile editing, and deletion.
- **Authentication**: Google OAuth and JWT-based login.
- **Business Card Management**: CRUD operations and favoriting.
- **Admin Features**: Managing users and editing privileges.

The goal is to ensure that authentication, authorization, and CRUD operations work correctly.

## API Documentation

For detailed information about available API endpoints, request parameters, and responses, refer to the complete [API Documentation on Postman](https://documenter.getpostman.com/view/37787437/2sAXxWb9t3).
