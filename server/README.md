# Student Management API

A REST API for managing student records built with Node.js, Express, and MongoDB using Mongoose.

## Features


 MongoDB integration with Mongoose
 Student CRUD endpoints
- Node.js 18 or later
- MongoDB running locally or a MongoDB Atlas connection

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/student_management
   PORT=3000
   ```

3. Start the server:

   ```bash
   npm start
   ```

For development with automatic restarts:

```bash
npm run dev
```

The API runs at `http://localhost:3000` by default.

## Seed Database

The seed command clears the existing student collection and inserts sample records:

```bash
npm run seed
```

Use this command carefully because it deletes existing student records.

## API Endpoints

All student endpoints use the `/api/students` base path.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get a student by ID |
| POST | `/api/students` | Create a student |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |

### Create or update body

```json
{
  "name": "Aarav Sharma",
  "email": "aarav@college.edu",
  "branch": "CSE",
  "marks": 88,
  "isActive": true
}
```

Valid branches are `CSE`, `IT`, `ENTC`, `MECH`, and `CIVIL`. Marks must be between `0` and `100`.

## Project Structure

```text
config/                 MongoDB connection
middleware/             CORS, logging, validation, and error handlers
models/                 Mongoose models
routes/                 API route definitions
seed.js                 Sample data importer
server.js               Application entry point
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the production server |
| `npm run dev` | Start the server with Nodemon |
| `npm run seed` | Replace database records with sample data |
