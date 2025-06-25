# Complete Data Models & Types Reference

## Core Application Types

### Navigation & UI
```typescript
enum Page {
  Home = 'Home',
  Health = 'Health',
  Learn = 'Learn',
  Shop = 'Shop',
}

interface NavItemType {
  id: Page;
  label: string;
  path: string;
  icon: (props: { className?: string }) => React.ReactNode;
  ariaLabel: string;
}

interface Program {
  id: string;
  name: string;
  themeClass: string;
  priorityText: string;
  colors: {
    primary: string;
    lightBg: string;
    darkText: string;
    light: string;
    gradient: string;
    shadow: string;
    glow: string;
  };
}
```

### Toast & Notification System
```typescript
interface ToastMessage {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

interface QuickAction {
  id: string;
  label: string;
  icon: (props: { className?: string }) => React.ReactNode;
  actionColor: string;
  ariaLabel: string;
}
```

### Context Types
```typescript
interface ProgramContextType {
  activeProgram: Program;
  setActiveProgramById: (programId: string) => void;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastMessage['type']) => void;
}
```

## Authentication & User Management

### Authentication Context
```typescript
interface AuthContextType {
  user: User | null;           // Supabase User type
  session: Session | null;     // Supabase Session type
  loading: boolean;
  signUp: (email: string, password: string, options?: { data?: any }) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}
```

## Health & Medical Data

### Health Page Types
```typescript
interface Message {
  id: string;
  doctorName: string;
  specialty: string;
  timeAgo: string;
  dateTime: string;
  content: string;
  isUnread: boolean;
  themeColor: string;
  avatarIcon: (props: { className?: string }) => React.ReactNode;
}

interface TreatmentCategory {
  id: string;
  title: string;
  viewAllLabel: string;
  treatments: Treatment[];
  themeColorClass: string;
}

interface Treatment {
  id: string;
  name: string;
  description: string;
  themeClass: string;
  icon: (props: { className?: string }) => React.ReactNode;
  tag?: 'New' | 'Popular';
}
```

## E-commerce & Shopping

### Product & Shop Types
```typescript
interface ProductDataForShop {
  id: string;                    // Unique ID for the product/service offering
  name: string;                  // Display name for the product teaser
  productName: string;           // Name used for cart item
  doseId: string;               // Unique ID for this specific dose/variant for cart
  price: number;                // Numeric price for calculations
  priceText: string;            // Display price string, e.g., "$39/month"
  subtitle: string;             // Short description or tagline
  iconName: string;             // Key to look up in ICON_MAP
  requiresPrescription: boolean;
  description: string;          // Longer description for cart/details page
  category: string;             // Category ID
  imageUrl?: string;            // Optional image URL for cart/details
  themeClass?: string;          // Optional theme for individual card icon styling
}

interface ShopCategoryMainCardData {
  title: string;                // Text to overlay on the main card
  imageUrl: string;
  productCountText: string;     // e.g., "26 products"
}

interface ShopPageCategorySectionData {
  id: string;                   // Unique ID for the section
  sectionTitle: string;         // Display title for the whole section
  themeClass: string;           // CSS class for theming icons in this section
  mainCard: ShopCategoryMainCardData;
  productTeasers: ProductDataForShop[]; // Array of 3 product teasers
}

interface ShopPageHeroData {
  backgroundImageUrl: string;
  heroCards: ProductDataForShop[];
}
```

### Cart System
```typescript
interface CartItem {
  doseId: string;
  productName: string;
  doseValue?: string;
  price: number;
  quantity: number;
  requiresPrescription?: boolean;
  imageUrl?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addItemToCart: (item: CartItem) => void;
  removeItemFromCart: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}
```

## Database Schema Types (Supabase)

### Database Interface
```typescript
interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
      };
      health_records: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
          record_type: string;
          data: any;
          notes: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
          record_type: string;
          data: any;
          notes?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
          record_type?: string;
          data?: any;
          notes?: string | null;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
          status: string;
          total_amount: number;
          items: any;
          shipping_address: any | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
          status: string;
          total_amount: number;
          items: any;
          shipping_address?: any | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
          status?: string;
          total_amount?: number;
          items?: any;
          shipping_address?: any | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
```

### Database Service Types
```typescript
type Tables = Database['public']['Tables'];
type Profile = Tables['profiles']['Row'];
type HealthRecord = Tables['health_records']['Row'];
type Order = Tables['orders']['Row'];
```

## Component Props Interfaces

### UI Components
```typescript
interface ToastProps extends ToastMessage {
  onRemove: (id: number) => void;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: number) => void;
}

interface ProgramTabsProps {
  programs: Program[];
  activeProgram: Program;
  onProgramChange: (program: Program) => void;
}

interface NotificationBannerProps {
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isVisible: boolean;
  onClose: () => void;
}
```

### Layout Components
```typescript
interface QuickActionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

interface BottomNavProps {
  activePage: Page;
  isFabActive: boolean;
  onFabClick: () => void;
}
```

### Shopping & Cart Components
```typescript
interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProductTeaserCardProps {
  product: ProductDataForShop;
  onAddToCart: (product: ProductDataForShop) => void;
}

interface MainCategoryDisplayCardProps {
  mainCard: ShopCategoryMainCardData;
}

interface CategorySectionDisplayProps {
  section: ShopPageCategorySectionData;
  onAddToCart: (product: ProductDataForShop) => void;
}
```

### Authentication Components
```typescript
interface GoogleSignInButtonProps {
  text?: string;
  className?: string;
}

interface AuthFormProps {
  mode: 'login' | 'signup';
  onToggleMode: () => void;
  onClose: () => void;
  showToggle?: boolean;
  isModal?: boolean;
}
```

## Environment & Configuration Types

### Vite Environment
```typescript
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_APP_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### Auth Configuration
```typescript
interface AuthConfig {
  redirectUrl: string;
  siteUrl: string;
  isDevelopment: boolean;
  googleOAuthOptions: {
    access_type: string;
    prompt: string;
    state: string;
  };
}
```

## External Library Types

### Supabase Types (Imported)
- `User` - Supabase user object
- `Session` - Supabase session object  
- `AuthError` - Supabase authentication error

### React Types (Implicit)
- `React.ReactNode` - React component children
- `React.FC` - React functional component
- `React.FormEvent` - Form event handling
- `React.MouseEvent` - Mouse event handling
- `React.KeyboardEvent` - Keyboard event handling

## Summary

**Total Interfaces**: 25+
**Total Enums**: 1
**Total Type Aliases**: 4+
**Database Tables**: 3 (profiles, health_records, orders)
**Context Providers**: 4 (Auth, Cart, Program, Toast)
**Component Props**: 12+

This comprehensive type system provides:
- Strong type safety across the entire application
- Clear data contracts between components
- Database schema validation
- Authentication flow typing
- E-commerce functionality typing
- UI component prop validation
