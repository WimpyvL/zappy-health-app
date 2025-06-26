# User Registration & Patient Record Integration

## Overview
Updated the authentication flow to ensure that when a user registers for the first time, they are automatically added to the patients list in the database.

## Changes Made

### 1. Enhanced Database Services (`services/database.ts`)
- Added patient-related interfaces (`PatientRow`, `PatientInsert`, `PatientUpdate`)
- Created `patientService` with methods:
  - `getPatient(userId)` - Retrieve patient by user ID
  - `createPatient(patient)` - Create new patient record
  - `updatePatient(userId, updates)` - Update patient information

### 2. Enhanced Database Service (`services/databaseService.ts`)
- Added patient creation methods to the centralized database service
- Methods include:
  - `createPatient()` - Create new patient with user data
  - `getPatientByUserId()` - Retrieve patient by user ID
  - `updatePatient()` - Update patient profile

### 3. Updated AuthContext (`contexts/AuthContext.tsx`)
- Enhanced authentication flow to handle patient creation
- Added `handleNewUserRegistration()` function that:
  - Creates both profile and patient records for new users
  - Extracts first/last name from user metadata
  - Logs creation success/failure for debugging
- Updated `loadProfile()` to ensure existing users also have patient records
- Modified auth state change handler to differentiate between new and existing users

### 4. User Registration Flow
When a user registers:
1. **Profile Creation**: User profile is created in the `profiles` table
2. **Patient Record Creation**: Patient record is automatically created in the `patients` table with:
   - `user_id`: Links to the auth user
   - `first_name`: Extracted from full name or defaults to "Patient"
   - `last_name`: Remaining parts of full name
   - `email`: User's email address
   - Timestamps for creation and updates

### 5. Backward Compatibility
- Existing users without patient records will have them created automatically on next login
- No disruption to current user experience
- All profile functionality remains intact

## Benefits
- **Centralized Patient Management**: All users are now tracked as patients in the database
- **Complete Data Integration**: Patient records link directly to auth users
- **Healthcare Workflow Ready**: Enables patient-specific features like appointments, health records, orders
- **Automatic Migration**: Existing users get patient records without manual intervention

## Database Schema Requirements
The implementation assumes a `patients` table with the following structure:
```sql
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT NOT NULL,
  date_of_birth DATE,
  weight DECIMAL,
  height DECIMAL,
  target_weight DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Logging & Debugging
Added console logging to track:
- New user registration events
- Profile creation success/failure
- Patient record creation success/failure
- Existing user patient record creation

This ensures transparency in the registration process and aids in troubleshooting any issues.
- **Automatic Migration**: Existing users get patient records without manual intervention

## Database Schema Requirements
The implementation assumes a `patients` table with the following structure:
```sql
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT NOT NULL,
  date_of_birth DATE,
  weight DECIMAL,
  height DECIMAL,
  target_weight DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Logging & Debugging
Added console logging to track:
- New user registration events
- Profile creation success/failure
- Patient record creation success/failure
- Existing user patient record creation

This ensures transparency in the registration process and aids in troubleshooting any issues.
