# MyDream E-commerce Platform v12

A modern e-commerce platform built with React, Node.js, Express, and PostgreSQL.

## Features

- User authentication and authorization
- Product catalog with categories
- Shopping cart functionality
- Checkout process with payment integration
- Order management
- Admin dashboard

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/9shankar805/mydreamv12.git
   cd mydreamv12
   ```

2. **Install dependencies**

   ```bash
   npm install
   cd client && npm install && cd ..
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` with your configuration.

4. **Set up database**

   - Create a new PostgreSQL database
   - Update the database connection details in `.env`
   - Run database migrations:
     ```bash
     npm run db:push
     ```

5. **Start the development server**
   ```bash
   # Start both frontend and backend
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/your_database
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=your_database

# Session
SESSION_SECRET=your_session_secret

# API Keys (get your own keys)
HERE_API_KEY=your_here_api_key
VITE_HERE_API_KEY=your_here_api_key
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:push` - Run database migrations

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository.
# mydreamv13
