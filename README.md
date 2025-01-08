# Full-Stack Application (React + Node.js)

This is a full-stack project combining a **React.js frontend** and a **Node.js backend**. The application is built to manage forms, submissions, and API interactions. It uses **PostgreSQL** as the database, **TailwindCSS** for styling, and Docker for containerization.

> **Note**: AI tools were only used for creating the README, Docker configuration, and file upload functionalities. The frontend utilizes Shadcn components to accelerate development.

## **Project Structure**

```
/project-root
├── /client     # React frontend
├── /server     # Node.js backend
└── docker-compose.yml
```

## **Technologies Used**

### Frontend

- React 18
- TailwindCSS
- React Router
- Redux Toolkit
- Shadcn UI Components
- Form handling: `react-hook-form` + `yup`

### Backend

- Express.js
- Sequelize (PostgreSQL ORM)
- Security: Helmet, CORS, JWT
- Multer (file uploads)
- Joi validation

### Database

- PostgreSQL

## **Getting Started**

### Prerequisites

- Node.js (v20)
- npm or yarn
- Docker (optional)

### 1. Clone the Repository

```bash
git clone https://github.com/bhaggat/code-my-mobile-task
cd code-my-mobile-task
```

### 2. Using Docker (Recommended)

1. Start all services:

```bash
docker-compose up --build
```

2. Access the applications:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080

#### Environment Variables

Create a `.env` file in both directories:

`server/.env`:

```env
PORT=8080
DB_HOST=postgres
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=mydatabase
DB_PORT=5432
JWT_SECRET=yourjwtsecret
MONGO_DB_CONNECTION=mongodb://mongo:27017/myappdb
```

`client/.env`:

```env
VITE_API_URL=http://localhost:8080
```

### 3. Manual Setup (Alternative)

#### Frontend

```bash
cd client
npm install
npm run dev
```

#### Backend

```bash
cd server
npm install
npm run dev
```

## **License**

This project is licensed under the MIT License.
