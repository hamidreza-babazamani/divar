<div dir="ltr" align="left">

# Divar Backend

Backend for the Divar project (online classified ads platform), built with Node.js, Express, and MongoDB.

## About the Project

This project is the backend of an online classified ads website similar to Divar. Users can register, create ads, browse categories, and upload images.

This repository contains **only the backend**. The frontend is in a separate repository.

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Swagger
- Multer

## Features

- OTP-based authentication (SMS login)
- User management
- Category management
- Option management
- Create and delete ads
- Image upload
- API documentation with Swagger
- Centralized error handling

## Project Structure

divar/
├── public/ Static files
├── src/
│ ├── common/ Shared utilities
│ ├── config/ Configuration
│ ├── modules/ Feature modules
│ │ ├── auth/ Authentication
│ │ ├── user/ Users
│ │ ├── category/ Categories
│ │ ├── option/ Options
│ │ └── post/ Ads
│ ├── app.routes.js Main router
│ └── main.js Entry point
├── .env
├── package.json
└── README.md

## Installation

### Prerequisites

- Node.js v18 or higher
- MongoDB

### Steps

1. Clone the repository:

git clone https://github.com/hamidreza-babazamani/divar.git
cd divar

2. Install dependencies:

npm install

3. Create a .env file and add the following variables:

PORT=3400
MONGODB_URL=mongodb://localhost:27017/divar
COOKIE_SECRET_KEY=your-secret-key-here
NODE_ENV=development

4. Start the server:

npm start

5. Server URL:

http://localhost:3400

## API Documentation

http://localhost:3400/swagger

## API Endpoints

### Auth

- POST /auth/send-otp — Send OTP code
- POST /auth/check-otp — Verify OTP and login
- GET /auth/logout — Logout

### User

- GET /user/whoami — Get current user profile
- PATCH /user/edit — Edit profile

### Category

- POST /category — Create a new category
- GET /category — Get all categories
- DELETE /category/:id — Delete a category

### Option

- POST /option — Create a new option
- GET /option — Get all options
- GET /option/by-category/:categoryId — Get options of a category
- GET /option/:id — Get a single option
- DELETE /option/:id — Delete an option

### Post

- POST /post/create — Create a new ad
- GET /post/my — Get my ads
- GET /post/:id — Get a single ad
- DELETE /post/:id — Delete an ad

## Important Notes

- Do not upload the .env file to GitHub
- Do not upload the node_modules folder to GitHub
- Make sure MongoDB is running before starting the server

## Contact

GitHub: @hamidreza-babazamani

</div>
