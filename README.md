# Full-Stack Application (React + Node.js)

This is a full-stack project combining a **React.js frontend** and a **Node.js backend**. The application is built to manage forms, submissions, and API interactions. It uses **PostgreSQL** as the database, **TailwindCSS** for styling, and Docker for containerization.

---

## **Project Structure**

```

/project-root
/client # React frontend
/server # Node.js backend
docker-compose.yml (optional) # For running services

```

---

## **Technologies Used**

### Frontend (React.js)

- **React 18**: A modern JavaScript library for building user interfaces.
- **TailwindCSS**: Utility-first CSS framework for styling.
- **React Router**: For routing.
- **Redux Toolkit**: State management.
- **Form Handling**: Using libraries like `react-hook-form` and validation with `yup`.

### Backend (Node.js)

- **Express.js**: Web framework.
- **Sequelize**: ORM for PostgreSQL database interactions.
- **Security**: Helmet, CORS, and JWT for authentication.
- **Multer**: For file uploads.
- **Validation**: Joi for schema validation.

### Database

- **PostgreSQL**: Relational database.

### Containerization

- **Docker**: For bundling both the client and server into a single image.

---

## **Getting Started**

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Docker** (optional for containerized development)

### 1. Clone the Repository

```bash
git clone https://github.com/bhaggat/code-my-mobile-task
cd code-my-mobile-task
```

### 2. Install Dependencies (Manually)

#### Frontend

```bash
cd client
npm install
```

#### Backend

```bash
cd server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in both `client` and `server` directories. For example:

#### `server/.env`

```
PORT=8080
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=123456
DB_NAME=myappdb
JWT_SECRET=yourjwtsecret
MONGO_DB_CONNECTION=mongodb://localhost:27017/yourdb
```

#### `client/.env`

```
VITE_API_URL = http://localhost:8080
```

### 4. Run Locally

#### Frontend

```bash
cd client
npm run dev
```

#### Backend

```bash
cd server
npm run dev
```

## **Using Docker**

### Using Docker Compose (Recommended)

The application is containerized using Docker Compose with the following services:

- Frontend (React)
- Backend (Node.js/Express)
- PostgreSQL Database
- MongoDB Database

1. Start all services:

```bash
docker-compose up --build
```

2. Access the applications:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080

### Environment Variables

The Docker Compose configuration already includes the necessary environment variables. However, if you need to modify them:

#### Server Environment Variables

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

#### Database Credentials

- PostgreSQL:

  - User: postgres
  - Password: password
  - Database: mydatabase
  - Port: 5432

- MongoDB:
  - Port: 27017
  - Connection string: mongodb://mongo:27017/myappdb

### Persistent Data

The application uses Docker volumes for database persistence:

- `postgres_data`: PostgreSQL data
- `mongo_data`: MongoDB data

---

## **License**

This project is licensed under the MIT License. See `LICENSE` for more information.
