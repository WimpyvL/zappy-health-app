# Supabase Integration Setup Guide

This guide will help you set up Supabase with your Zappy Health app.

## 🚀 Quick Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new account
2. Create a new project
3. Wait for the project to be fully provisioned

### 2. Get Your Project Credentials

1. Go to your project dashboard
2. Navigate to **Settings** → **API**
3. Copy your:
   - **Project URL** (something like `https://your-project.supabase.co`)
   - **Anon Public Key** (starts with `eyJ...`)

### 3. Set Up Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials in `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key
   ```

### 4. Set Up the Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase/setup.sql`
3. Paste and run the SQL script

This will create:
- `profiles` table for user profiles
- `health_records` table for health data
- `orders` table for e-commerce functionality
- Row Level Security (RLS) policies
- Automatic triggers for timestamps

### 5. Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Configure your site URL (for local development: `http://localhost:5173`)
3. Add any additional redirect URLs you need

## 🏗️ Project Structure

```
├── lib/
│   └── supabase.ts          # Supabase client configuration
├── contexts/
│   └── AuthContext.tsx      # Authentication context provider
├── services/
│   └── database.ts          # Database service functions
├── components/auth/
│   ├── AuthButton.tsx       # Authentication button component
│   ├── AuthForm.tsx         # Sign in/up form
│   └── UserProfile.tsx      # User profile management
└── supabase/
    └── setup.sql            # Database setup script
```

## 🔧 Available Services

### Authentication (`useAuth` hook)

```tsx
import { useAuth } from '../contexts/AuthContext'

function MyComponent() {
  const { user, signIn, signUp, signOut, loading } = useAuth()
  
  // Check if user is authenticated
  if (user) {
    return <div>Welcome, {user.email}!</div>
  }
  
  return <div>Please sign in</div>
}
```

### Profile Management

```tsx
import { profileService } from '../services/database'

// Get user profile
const profile = await profileService.getProfile(userId)

// Update profile
await profileService.updateProfile(userId, {
  full_name: 'John Doe',
  avatar_url: 'https://example.com/avatar.jpg'
})

// Create profile (usually done automatically)
await profileService.createProfile({
  id: userId,
  email: 'user@example.com',
  full_name: 'John Doe'
})
```

### Health Records

```tsx
import { healthRecordsService } from '../services/database'

// Get user's health records
const records = await healthRecordsService.getUserHealthRecords(userId)

// Create new health record
await healthRecordsService.createHealthRecord({
  user_id: userId,
  record_type: 'blood_pressure',
  data: {
    systolic: 120,
    diastolic: 80,
    timestamp: new Date().toISOString()
  },
  notes: 'Morning reading'
})

// Update health record
await healthRecordsService.updateHealthRecord(recordId, {
  notes: 'Updated notes'
})

// Delete health record
await healthRecordsService.deleteHealthRecord(recordId)
```

### Orders/E-commerce

```tsx
import { ordersService } from '../services/database'

// Get user's orders
const orders = await ordersService.getUserOrders(userId)

// Create new order
const orderId = await ordersService.createOrder({
  user_id: userId,
  status: 'pending',
  total_amount: 99.99,
  items: [
    {
      product_id: 'prod_123',
      name: 'Health Supplement',
      quantity: 2,
      price: 49.99
    }
  ],
  shipping_address: {
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zip: '12345'
  }
})

// Update order status
await ordersService.updateOrderStatus(orderId, 'shipped')
```

### Real-time Subscriptions

```tsx
import { subscriptions } from '../services/database'

useEffect(() => {
  // Subscribe to health records changes
  const healthSubscription = subscriptions.subscribeToHealthRecords(
    userId,
    (payload) => {
      console.log('Health record changed:', payload)
      // Update your UI accordingly
    }
  )

  // Subscribe to order changes
  const orderSubscription = subscriptions.subscribeToOrders(
    userId,
    (payload) => {
      console.log('Order changed:', payload)
      // Update your UI accordingly
    }
  )

  // Cleanup subscriptions
  return () => {
    healthSubscription.unsubscribe()
    orderSubscription.unsubscribe()
  }
}, [userId])
```

## 🎨 UI Components

### Authentication Button

The `AuthButton` component is already integrated into the `Header` component and provides:

- Sign in/Sign up functionality
- User profile display
- Profile management modal

### Integration Example

```tsx
import { AuthButton } from '../components/auth/AuthButton'

function MyHeader() {
  return (
    <header>
      <h1>My App</h1>
      <AuthButton />
    </header>
  )
}
```

## 🔒 Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **JWT Authentication**: Secure token-based authentication
- **Automatic Profile Creation**: Profiles are created automatically on signup
- **Data Validation**: TypeScript interfaces ensure data consistency

## 🚨 Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Make sure your `.env` file exists and has the correct values
   - Restart your development server after adding environment variables

2. **Authentication not working**
   - Check your site URL in Supabase Authentication settings
   - Ensure your environment variables are correct

3. **Database errors**
   - Make sure you've run the setup SQL script
   - Check that RLS policies are enabled

4. **TypeScript errors**
   - Make sure `vite-env.d.ts` is included in your project
   - Restart your TypeScript server in VSCode

### Development Tips

- Use the Supabase dashboard to view and edit data during development
- Enable email confirmations in production but disable for testing
- Use the SQL Editor to test queries before implementing them in code
- Monitor real-time subscriptions in the Supabase dashboard

## 📚 Next Steps

1. Customize the database schema for your specific needs
2. Add more authentication providers (Google, GitHub, etc.)
3. Implement file storage for user avatars and documents
4. Add more complex queries and relationships
5. Set up email templates for authentication

For more information, visit the [Supabase Documentation](https://supabase.com/docs).