# MindConnect Backend

Spring Boot backend for the MindConnect mental health support platform.

## Features

- JWT Authentication & Authorization
- Role-based access control (Admin, User, Therapist)
- RESTful APIs for all entities
- PostgreSQL database integration
- Comprehensive entity relationships
- Sample data initialization

## Setup

1. **Database Setup**
   \`\`\`bash
   # Create PostgreSQL database
   createdb mindconnect
   \`\`\`

2. **Configuration**
   - Update `src/main/resources/application.properties` with your database credentials

3. **Run Application**
   \`\`\`bash
   mvn spring-boot:run
   \`\`\`

4. **API Base URL**
   \`\`\`
   http://localhost:8080/api
   \`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User/Therapist login
- `POST /api/auth/register` - User registration
- `POST /api/auth/register-therapist` - Therapist registration

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Therapists
- `GET /api/therapists` - Get all therapists
- `GET /api/therapists/available` - Get available therapists
- `PUT /api/therapists/{id}` - Update therapist

### Sessions
- `GET /api/sessions/user/{userId}` - Get user sessions
- `GET /api/sessions/therapist/{therapistId}` - Get therapist sessions
- `POST /api/sessions` - Create session
- `PUT /api/sessions/{id}/status` - Update session status

### Journals
- `GET /api/journals/user/{userId}` - Get user journals
- `POST /api/journals` - Create journal entry
- `PUT /api/journals/{id}` - Update journal entry
- `DELETE /api/journals/{id}` - Delete journal entry

### Motivational Content
- `GET /api/motivations/active` - Get active motivational content
- `GET /api/motivations/type/{type}` - Get content by type

## Sample Login Credentials

**Therapist:**
- Email: `sarah.johnson@mindconnect.com`
- Password: `password123`

## Technologies Used

- Spring Boot 3.2.0
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL
- Maven
\`\`\`

## Frontend (React) - `/frontend` folder
