# SmartEnrol

## Overview
SmartEnrolis a web application built using Next.js. It provides an interface for managing activities, where administrators can create, view, and delete activities. The app leverages NextAuth.js for authentication and MongoDB as the database for storing user and activity data. The system includes role-based access control, ensuring that only authorized users can perform certain actions.

## Features
- User Authentication: Implemented with NextAuth.js, supporting Google OAuth for user login.
- Role-Based Access Control: Different roles ('user', 'admin') have specific permissions.
- Activity Management: Admin users can create, view, and delete activities.
- User Management: Supports viewing and managing user information and their roles.

## Tech Stack
- Frontend: Next.js, React, Tailwind CSS
- Backend: Next.js API routes
- Authentication: NextAuth.js
- Database: MongoDB with Mongoose

## Project Structure
- components: Contains reusable UI components (e.g., Header).
lib: Utility functions, such as database connection setup (mongodb.js).
- models: Mongoose schemas for Activity and User.
- pages: Main pages and API routes.
- activities: User-facing pages related to activities.
- admin: Pages for admin functionalities, such as managing activities.
- api: Backend API routes for data handling.
- auth: Authentication-related pages (login, callback).
- profile: User profile management pages.
- index.js: The main entry point of the application.
- public: Static assets like images and icons.
- styles: Global and component-specific styles.
- utils: Helper functions and configurations.

## Getting Started
Prerequisites
- Node.js (v14.x or higher)
- MongoDB (for database operations)
- Google OAuth credentials (for integrating NextAuth.js)

Installation

Clone the Repository

```bash
git clone https://github.com/tonylai2022/smartEnrol.git
cd smartEnrol
```

```bash
npm install
```


Create a .env.local file in the root directory with the following variables:

```bash
MONGODB_URI=<your-mongodb-uri>
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<your-nextauth-secret>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```
Replace placeholders with your actual credentials.

Run the Development Server

```bash
npm run dev
```
The application will be accessible at http://localhost:3000.