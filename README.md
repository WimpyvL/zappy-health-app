# Zappy Health App

A modern healthcare platform built with React, TypeScript, and a modular API integration layer.

## Quick Start

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Configure your API endpoint credentials
   VITE_API_BASE_URL="https://api.your-domain.com"
   # Optional: provide a bootstrap token for local development
   VITE_API_AUTH_TOKEN="dev-access-token"
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

## 📚 Documentation

All documentation is organized by date in the `docs/` directory:

- **[Complete Documentation Index](docs/DOCUMENTATION_INDEX.md)** - Comprehensive overview of all docs
- **[Implementation Guides](docs/2025-06-26/)** - Feature development and best practices
  - [Treatment Components](docs/2025-06-26/TREATMENT_COMPONENTS_IMPLEMENTATION.md)
  - [Enhanced Profile System](docs/2025-06-26/enhanced-profile-system.md)
  - [Data Acquisition Best Practices](docs/2025-06-26/PATIENT_APP_DATA_ACQUISITION_BEST_PRACTICES.md)

### For AI Builders

Before creating documentation, read: [AI Builder Instructions](docs/AI_BUILDER_INSTRUCTIONS.md)

## Features

- 🔐 **Authentication**: Token-based auth with Google OAuth support
- 👤 **Dynamic Profiles**: API-driven user profiles
- 🏥 **Patient Management**: Automatic patient record creation
- 📱 **Responsive Design**: Mobile-first healthcare interface
- 🔄 **Real-time Data Ready**: Hooks prepared for WebSocket/event-stream integrations

## Architecture

- **Frontend**: React + TypeScript + Vite
- **API Layer**: Configurable REST client (fetch-based)
- **Styling**: Tailwind CSS
- **State Management**: React Context + Custom Hooks
