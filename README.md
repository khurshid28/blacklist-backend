# Blacklist Backend - NestJS + Prisma

Backend API for the Blacklist application built with NestJS and Prisma ORM.

## Features

- **NestJS Framework**: Modern Node.js framework
- **Prisma ORM**: Type-safe database access
- **MySQL Database**: Relational database
- **File Upload**: Multer integration for image uploads
- **CRUD Operations**: Complete CRUD for User, Phone, and Card models
- **Validation**: Input validation with class-validator

## Prerequisites

- Node.js (v20.9.0 or higher)
- MySQL database
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure the database connection in `.env`:
```env
PORT=5555
DATABASE_URL="mysql://root:password@localhost:3306/blacklist_db"
```

3. Create the database:
```bash
# Login to MySQL and create database
mysql -u root -p
CREATE DATABASE blacklist_db;
```

4. Run Prisma migrations:
```bash
npm run prisma:migrate
```

5. Generate Prisma Client:
```bash
npm run prisma:generate
```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

The server will start on `http://localhost:5555`

## API Endpoints

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user (with image upload)
- `PATCH /users/:id` - Update user (with image upload)
- `DELETE /users/:id` - Delete user

### Phones
- `GET /phones` - Get all phones
- `GET /phones/:id` - Get phone by ID
- `GET /phones/user/:userId` - Get phones by user ID
- `POST /phones` - Create new phone
- `PATCH /phones/:id` - Update phone
- `DELETE /phones/:id` - Delete phone

### Cards
- `GET /cards` - Get all cards
- `GET /cards/:id` - Get card by ID
- `GET /cards/user/:userId` - Get cards by user ID
- `POST /cards` - Create new card
- `PATCH /cards/:id` - Update card
- `DELETE /cards/:id` - Delete card

## Models

### User
- `id`: Auto-increment ID
- `image`: Image path (stored in /public/uploads)
- `sudlangan`: Boolean (default: false)
- `name`: String
- `surname`: String
- `username`: String (unique)
- `birthdate`: String (format: DD.MM.YYYY)
- `phone`: String (format: +998XXXXXXXXX)
- `pinfl`: String (14 characters)
- `gender`: Boolean (true = male, false = female)
- `createdAt`: Auto-generated
- `updatedAt`: Auto-generated

### Phone
- `id`: Auto-increment ID
- `phone`: String
- `userId`: Foreign key to User
- `createdAt`: Auto-generated
- `updatedAt`: Auto-generated

### Card
- `id`: Auto-increment ID
- `bankName`: String
- `number`: String
- `expired`: String (format: MMYY)
- `userId`: Foreign key to User
- `createdAt`: Auto-generated
- `updatedAt`: Auto-generated

## Project Structure

```
src/
├── app.module.ts          # Main application module
├── main.ts                # Application entry point
├── prisma/                # Prisma service
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── user/                  # User module
│   ├── dto/
│   ├── user.controller.ts
│   ├── user.service.ts
│   └── user.module.ts
├── phone/                 # Phone module
│   ├── dto/
│   ├── phone.controller.ts
│   ├── phone.service.ts
│   └── phone.module.ts
└── card/                  # Card module
    ├── dto/
    ├── card.controller.ts
    ├── card.service.ts
    └── card.module.ts
```

## Upload Directory

Images are stored in `public/uploads/` directory.
