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

### 2. Install Dependencies

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

### 1. Build the Docker Image

```bash
docker build -t fullstack-app .
```

### 2. Run the Container

```bash
docker run -p 5000:5000 fullstack-app
```

### (Optional) Using Docker Compose

```bash
docker-compose up --build
```

---

## **License**

This project is licensed under the MIT License. See `LICENSE` for more information.
