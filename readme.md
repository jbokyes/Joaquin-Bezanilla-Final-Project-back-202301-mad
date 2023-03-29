# Joaquin's Final Project Back end

This REST API allows you to manage users and food dishes for the Latino foods project. This project is the my (Joaquín Bezanilla) final project for the ISDI Bootcamp - Madrid 2023.

## Users

- POST /users to create a new user
- GET /users to get all users
- GET /users/:id to get a single user by id
- PATCH /users/:id to update a user
- DELETE /users/:id to delete a user

## Foods

- POST /foods to create a new food item
- GET /foods to get all foods
- GET /foods/:id to get a single food by id
- PATCH /foods/:id to update a food
- DELETE /foods/:id to delete a food

## Technologies used

- Express
- Node.js
- MongoDB

## Installation

1. Clone the repo
2. Install dependencies with npm install
3. Create a .env file and add MONGO_URL=your_mongo_db_url
4. Run npm start to start the API

## Usage

You can access the API endpoints through your favorite HTTP client like Postman, Insomnia, etc.

## Contributing

Please fork and submit pull requests for any bugs or new features.
Let me know if you have any issues or questions!
