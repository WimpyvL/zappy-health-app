# Zappy Health App

A modern healthcare platform built with React, TypeScript, and Supabase.

## Quick Start

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (see [Setup Guide](docs/2025-06-25/SUPABASE_SETUP.md)):
   ```bash
   cp .env.example .env
   # Add your Supabase credentials
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

## 📚 Documentation

All documentation is organized by date in the `docs/` directory:

- **[Complete Documentation Index](docs/DOCUMENTATION_INDEX.md)** - Comprehensive overview of all docs
- **[Setup Guides](docs/2025-06-25/)** - Initial configuration and setup
  - [Supabase Setup](docs/2025-06-25/SUPABASE_SETUP.md)
  - [Google OAuth Setup](docs/2025-06-25/GOOGLE_OAUTH_SETUP.md)
  - [Patient Integration](docs/2025-06-25/PATIENT_INTEGRATION.md)
- **[Implementation Guides](docs/2025-06-26/)** - Feature development and best practices
  - [Treatment Components](docs/2025-06-26/TREATMENT_COMPONENTS_IMPLEMENTATION.md)
  - [Enhanced Profile System](docs/2025-06-26/enhanced-profile-system.md)
  - [Data Acquisition Best Practices](docs/2025-06-26/PATIENT_APP_DATA_ACQUISITION_BEST_PRACTICES.md)

### For AI Builders

Before creating documentation, read: [AI Builder Instructions](docs/AI_BUILDER_INSTRUCTIONS.md)

## Features

- 🔐 **Authentication**: Supabase Auth with Google OAuth
- 👤 **Dynamic Profiles**: Database-driven user profiles
- 🏥 **Patient Management**: Automatic patient record creation
- 📱 **Responsive Design**: Mobile-first healthcare interface
- 🔄 **Real-time Data**: Live updates from Supabase

## Architecture

- **Frontend**: React + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Auth + Real-time) with an Express API proxy
- **Styling**: Tailwind CSS
- **State Management**: React Context + Custom Hooks

## Backend API Server

The project now includes a Node.js API located in `server/` that proxies all Supabase database access. The frontend communicates with this API instead of calling Supabase directly.

### Environment Variables

Create a `.env` file at the repository root with the following variables to run the backend:

```
SUPABASE_URL=<your-supabase-project-url>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
PORT=4000                    # optional, defaults to 4000
FRONTEND_URL=http://localhost:5173  # allowed CORS origin
```

Update your frontend `.env` file to point to the API server:

```
VITE_API_BASE_URL=http://localhost:4000
```

### Install and Run

```
cd server
npm install
npm run dev
```

The API exposes REST endpoints for authentication, profiles, patients, health records, orders, and aggregated homepage data. All endpoints require a valid Supabase access token in the `Authorization: Bearer <token>` header.
