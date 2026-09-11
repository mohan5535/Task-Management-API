# Task Management REST API

A CRUD REST API built with Node.js and Express for an internship assignment.

## Stack
Node.js, Express, SQLite, bcryptjs, JWT, Postman

## Features
- User registration and login
- Password hashing with bcrypt
- JWT authentication
- Protected task CRUD
- Per-user task access
- Input validation
- Standard HTTP status codes

## Setup
```bash
npm install
```
Copy `.env.example` to `.env` and set a strong `JWT_SECRET`.

```env
PORT=3000
JWT_SECRET=your_long_random_secret
```

Run:
```bash
npm start
```
API: `http://localhost:3000`

## Endpoints

### Register
**POST** `/api/auth/register`

Body:
```json
{"name":"Mohan","email":"mohan@example.com","password":"secret123"}
```
**201**
```json
{"success":true,"message":"User registered successfully.","user":{"id":1,"name":"Mohan","email":"mohan@example.com"}}
```
Errors: **400** invalid input or duplicate email.

### Login
**POST** `/api/auth/login`

Body:
```json
{"email":"mohan@example.com","password":"secret123"}
```
**200**
```json
{"success":true,"message":"Login successful.","token":"JWT_TOKEN","user":{"id":1,"name":"Mohan","email":"mohan@example.com"}}
```
Errors: **400** missing input, **401** invalid credentials.

For every task request, send:
`Authorization: Bearer YOUR_JWT_TOKEN`

### Create task
**POST** `/api/tasks`

Body:
```json
{"title":"Complete API","description":"Finish the assignment","status":"pending"}
```
**201** returns `{"success":true,"message":"Task created successfully.","task":{...}}`
Errors: **400**, **401**.

### Get all tasks
**GET** `/api/tasks`

**200** returns `{"success":true,"count":1,"tasks":[{...}]}`
Error: **401**.

### Get one task
**GET** `/api/tasks/:id`

**200** returns `{"success":true,"task":{...}}`
Errors: **401**, **404**.

### Update task
**PUT** `/api/tasks/:id`

Body may contain `title`, `description`, and/or `status`.
```json
{"title":"Updated task","status":"in-progress"}
```
**200** returns `{"success":true,"message":"Task updated successfully.","task":{...}}`
Errors: **400**, **401**, **404**.

### Delete task
**DELETE** `/api/tasks/:id`

**200**
```json
{"success":true,"message":"Task deleted successfully."}
```
Errors: **401**, **404**.

## Status Codes
- 200 Success
- 201 Created
- 400 Bad Request
- 401 Unauthorized
- 404 Not Found
- 500 Internal Server Error

## Postman Test Order
1. Register
2. Login and copy token
3. Use Bearer token for task requests
4. Create, read, update and delete a task
5. Test a protected endpoint without a token and confirm `401`

## Structure
```text
task-management-api/
├── src/
│   ├── controllers/
│   ├── database/
│   ├── middleware/
│   └── routes/
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## Security
Passwords are hashed and never stored as plain text. `.env` and database files are excluded from Git.
