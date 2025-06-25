
import React, { useState, createContext, useCallback, useMemo } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import HealthPage from './pages/HealthPage';
import LearnPage from './pages/LearnPage';
import ShopPage from './pages/ShopPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import { ProfilePage } from './pages/ProfilePage';
import BottomNav from './components/layout/BottomNav';
import QuickActionsMenu from './components/layout/QuickActionsMenu';
import ToastContainer from './components/ui/ToastContainer';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Page, ProgramContextType, ToastContextType, ToastMessage } from './types';
import { PROGRAMS_DATA, DEFAULT_PROGRAM_ID } from './constants';

export const ProgramContext = createContext<ProgramContextType | undefined>(undefined);
export const ToastContext = createContext<ToastContextType | undefined>(undefined);

const App: React.FC = () => {
  const [activeProgramId, setActiveProgramId] = useState<string>(DEFAULT_PROGRAM_ID);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  const location = useLocation();

  const setActiveProgramById = useCallback((programId: string) => {
    setActiveProgramId(programId);
  }, []);

  const activeProgram = useMemo(() => {
    return PROGRAMS_DATA.find(p => p.id === activeProgramId) || PROGRAMS_DATA[0];
  }, [activeProgramId]);

  const programContextValue: ProgramContextType = useMemo(() => ({
    activeProgram,
    setActiveProgramById,
  }), [activeProgram, setActiveProgramById]);

  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
    setToasts(prevToasts => [...prevToasts, { id: Date.now(), message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);
  
  const toastContextValue: ToastContextType = useMemo(() => ({ addToast }), [addToast]);

  // Determine current page for BottomNav active state
  let currentPage: Page;
  let showBottomNav = true; // Controls whether to show bottom navigation
  
  switch (location.pathname) {
    case '/health':
      currentPage = Page.Health;
      break;
    case '/learn':
      currentPage = Page.Learn;
      break;
    case '/shop':
      currentPage = Page.Shop;
      break;
    case '/login':
    case '/signup':
    case '/profile':
    case '/auth/callback':
      currentPage = Page.Home; // Default for auth pages
      showBottomNav = false; // Hide bottom nav on auth pages
      break;
    case '/':
    default:
      currentPage = Page.Home;
      break;
  }
  
  // Apply theme class to the root of the content area based on active program
  // This will affect CSS variables for Tailwind's arbitrary value system.
  const themeClass = activeProgram.themeClass || 'theme-weight';


  return (
    <AuthProvider>
    <CartProvider>
      <ProgramContext.Provider value={programContextValue}>
        <ToastContext.Provider value={toastContextValue}>
          <div className={`w-full bg-transparent min-h-screen flex flex-col ${themeClass}`}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/health" element={<HealthPage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
            </Routes>
            
            <QuickActionsMenu
              isOpen={isQuickActionsOpen}
              onClose={() => setIsQuickActionsOpen(false)}
            />
            {showBottomNav && (
              <BottomNav
                activePage={currentPage}
                isFabActive={isQuickActionsOpen}
                onFabClick={() => setIsQuickActionsOpen(prev => !prev)}
              />
            )}
          </div>
          <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
      </ProgramContext.Provider>
    </CartProvider>
  </AuthProvider>
  );
};

export default App;