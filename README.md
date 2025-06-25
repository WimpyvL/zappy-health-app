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

- **[Setup Guides](docs/2025-06-25/)** - Initial configuration and setup
  - [Supabase Setup](docs/2025-06-25/SUPABASE_SETUP.md)
  - [Google OAuth Setup](docs/2025-06-25/GOOGLE_OAUTH_SETUP.md)
- **[Implementation Notes](docs/2025-06-25/)** - Feature development details
  - [Patient Integration](docs/2025-06-25/PATIENT_INTEGRATION.md)

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
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Styling**: Tailwind CSS
- **State Management**: React Context + Custom Hooks
