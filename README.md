# Contact Directory

A modern full-stack contact directory for managing and finding employee information.

The application provides a public contact directory with search and pagination, while authenticated administrators can create, edit and remove contacts.

## Features

- Contact search and pagination
- Employee name, department, extension, email and phone information
- Contact photo support
- Administrative authentication
- Create, edit and delete contacts
- Responsive interface
- Session and CSRF protection
- PostgreSQL database migrations with Flyway

## Tech Stack

### Frontend
- React
- TypeScript
- Vite

### Backend
- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- Flyway

### Database
- PostgreSQL

## Running Locally

### Backend

Create a PostgreSQL database and user:

```sql
CREATE ROLE contact_directory LOGIN PASSWORD 'contact_directory';
CREATE DATABASE contact_directory_db OWNER contact_directory;
```

Set an initial administrator password:

```powershell
$env:INITIAL_ADMIN_PASSWORD="your-password"
```

Then run:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

The API runs by default at:

```text
http://localhost:8080
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

## Configuration

The backend supports environment variables for production configuration, including:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `INITIAL_ADMIN_USERNAME`
- `INITIAL_ADMIN_PASSWORD`
- `SERVER_PORT`
- `SESSION_COOKIE_SECURE`
- `CORS_ALLOWED_ORIGINS`
- `CONTACT_PHOTOS_DIR`

## Author

Developed by [Lampanche Dos Santos](https://github.com/lampanche-s).
