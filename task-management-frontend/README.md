# TaskFlow — React Frontend

Responsive React frontend consuming the Task Management REST API.

## Stack
React, Vite, React Router, JavaScript, Context API/useState, Fetch API, CSS.

## Features
- Registration and login
- JWT authentication and protected routes
- Live task data from the backend API (no mock task arrays)
- Task list and details
- Create, edit and delete tasks
- Client-side validation
- Visible loading and error states
- Responsive mobile and desktop UI
- Logout

## Routes
- `/login`
- `/register`
- `/tasks`
- `/tasks/:id`
- `/tasks/new`
- `/tasks/:id/edit`

## Setup
1. Start the Task Management API on `http://localhost:3000`.
2. Run `npm install`.
3. Copy `.env.example` to `.env` if you need to change the API URL.
4. Run `npm run dev`.
5. Open the Vite URL shown in the terminal.

Default API URL: `http://localhost:3000/api`

## Build
Run `npm run build` before submission.

## Related backend
https://github.com/mohan5535/Task-Management-API
