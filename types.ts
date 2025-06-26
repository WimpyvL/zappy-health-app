
export enum Page {
  Home = 'Home',
  Health = 'Health',
  Learn = 'Learn',
  Shop = 'Shop',
}

export interface NavItemType {
  id: Page;
  label: string;
  path: string;
  icon: (props: { className?: string }) => React.ReactNode;
  ariaLabel: string;
}

export interface Program {
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

export interface ToastMessage {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

export interface QuickAction {
  id: string;
  label: string;
  icon: (props: { className?: string }) => React.ReactNode;
  actionColor: string;
  ariaLabel: string;
}

export interface ProgramContextType {
  activeProgram: Program;
  setActiveProgramById: (programId: string) => void;
}

export interface ToastContextType {
  addToast: (message: string, type?: ToastMessage['type']) => void;
}

// Health Page Specific Types
export interface Message {
  id: string;
  doctorName: string;
  specialty: string;
  timeAgo: string;
  dateTime: string;
  content: string;
  isUnread: boolean;
  themeColor: string; // e.g. 'blue' or 'purple' for message-blue/message-purple
  avatarIcon: (props: { className?: string }) => React.ReactNode;
}

// Real-time messaging types
export interface DatabaseMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  metadata: any;
  created_at: string;
  updated_at: string;
  read_at: string | null;
  is_edited: boolean;
  edited_at: string | null;
}

export interface DatabaseConversation {
  id: string;
  created_at: string;
  updated_at: string;
  patient_id: string;
  doctor_id: string;
  subject: string | null;
  status: string;
  last_message_at: string;
}

export interface DatabaseDoctor {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  specialty: string;
  license_number: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_active: boolean;
  theme_color: string;
}

export interface TreatmentCategory {
  id: string;
  title: string;
  viewAllLabel: string;
  treatments: Treatment[];
  themeColorClass: string; // e.g. text-blue-600
}

export interface Treatment {
  id: string;
  name: string;
  description: string;
  themeClass: string; // e.g. program-weight
  icon: (props: { className?: string }) => React.ReactNode;
  tag?: 'New' | 'Popular';
}

export interface TreatmentWithCategory extends Treatment {
  category: string;
  categoryColor: string;
}

// Shop Page Specific Types
export interface ProductDataForShop {
  id: string; // Unique ID for the product/service offering
  name: string; // Display name for the product teaser
  productName: string; // Name used for cart item
  doseId: string; // Unique ID for this specific dose/variant for cart
  price: number; // Numeric price for calculations
  priceText: string; // Display price string, e.g., "$39/month"
  subtitle: string; // Short description or tagline
  iconName: string; // Key to look up in ICON_MAP
  requiresPrescription: boolean;
  description: string; // Longer description for cart/details page
  category: string; // Category ID
  imageUrl?: string; // Optional image URL for cart/details
  themeClass?: string; // Optional theme for individual card icon styling
}

export interface ShopCategoryMainCardData {
  title: string; // Text to overlay on the main card (e.g., "Sexual Health")
  imageUrl: string;
  productCountText: string; // e.g., "26 products"
}

export interface ShopPageCategorySectionData {
  id: string; // Unique ID for the section, e.g., "sexual-health"
  sectionTitle: string; // Display title for the whole section, e.g., "Sexual Health"
  themeClass: string; // CSS class for theming icons in this section, e.g., "theme-ed"
  mainCard: ShopCategoryMainCardData;
  productTeasers: ProductDataForShop[]; // Array of 3 product teasers
}

export interface ShopPageHeroData {
  backgroundImageUrl: string;
  heroCards: ProductDataForShop[];
}

// Cart Item interface
export interface CartItem {
  doseId: string;
  productName: string;
  doseValue?: string;
  price: number;
  quantity: number;
  requiresPrescription?: boolean;
  imageUrl?: string;
}
