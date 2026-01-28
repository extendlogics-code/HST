# HST 80G Certificate Generator

A full-stack NGO compliance system for "Help To Self Help Trust" to manage donors, donations, and generate transaction-safe 80G certificates.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Axios, React Router.
- **Backend**: Node.js, Express, Knex (MySQL), JWT, Puppeteer (PDF), Multer.
- **Database**: MySQL.

## Features

- **RBAC**: 
  - `ADMIN`: User management, system settings, void certificates, audit logs.
  - `STAFF`: Donor management, donation entry, certificate generation.
- **NGO Compliance**:
  - CASH > ₹2000 warning/confirmation.
  - Transaction-safe yearly-reset certificate numbering.
  - A4 PDF generation via Puppeteer.
  - Comprehensive audit logging.
- **Local Storage**: All uploads (signatures, seals, PDFs) are stored locally.

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- MySQL Server

### 1. Backend Setup

1. Navigate to the `backend` directory.
2. Create a `.env` file based on `.env.example`:
   ```env
   PORT=5000
   NODE_ENV=development
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=root
   DB_NAME=hst_80g_db
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES_IN=8h
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create the database and run migrations/seeds:
   ```bash
   node create_db.js
   npm run migrate
   npm run seed
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Default Credentials

- **Admin**: `admin@hst.org` / `admin123`
- **Staff**: `staff@hst.org` / `staff123`

## Directory Structure

- `/backend`: Express API, Knex migrations, Puppeteer templates.
- `/frontend`: React application, Tailwind styles, Auth context.
- `/uploads`: Local storage for PDFs and images (organized by type).

## Compliance Notes

- All critical actions are logged in the `audit_logs` table.
- Certificate numbers follow the format `HST-80G-YYYY-XXXX` and are transaction-safe.
- Voided certificates retain their numbers but are marked as `VOIDED` in history.
