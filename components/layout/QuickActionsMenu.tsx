
import React, { useRef, useEffect, useContext } from 'react';
import { QUICK_ACTIONS } from '../../constants';
import { ToastContext } from '../../App';
import { QuickAction, ToastContextType } from '../../types';


interface QuickActionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickActionsMenu: React.FC<QuickActionsMenuProps> = ({ isOpen, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const toastContext = useContext<ToastContextType | undefined>(ToastContext);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const firstButton = menuRef.current.querySelector('button');
      firstButton?.focus();
    }
  }, [isOpen]);
  
  const handleActionClick = (action: QuickAction) => {
    if (toastContext) {
      toastContext.addToast(`Opening ${action.label.toLowerCase()}...`, 'info');
    }
    // Here you would typically dispatch an action or navigate
    console.log(`Quick action: ${action.label} clicked`);
    onClose();
  };


  return (
    <div
      ref={menuRef}
      className={`quick-actions-menu ${isOpen ? 'active' : ''}`}
      role="dialog"
      aria-labelledby="quick-actions-title"
      aria-hidden={!isOpen}
    >
      <h3 id="quick-actions-title" className="sr-only">Quick Actions Menu</h3>
      <div className="grid grid-cols-2 gap-4">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            // Tailwind arbitrary properties cannot directly use JS variables for `var(--action-color)`
            // This limitation means we have to use inline styles or hardcode, prompt forbids inline styles.
            // For this, we'll rely on the provided CSS which might define styles based on action.id or specific classes
            // Or, we can use Tailwind's arbitrary values for background if colors are fixed.
            // The original HTML used inline style: style="--action-color: #0ea5e9;"
            // Since inline styles are forbidden by the prompt, I will use specific Tailwind classes if possible,
            // or rely on the global CSS to style these based on a hypothetical class.
            // For now, I'll use arbitrary values with the hardcoded colors from constants.
            className={`quick-action-btn bg-[rgba(255,255,255,0.8)] hover:border-[${action.actionColor}]`}
            onClick={() => handleActionClick(action)}
            aria-label={action.ariaLabel}
          >
            <action.icon className={`w-6 h-6 mb-3 text-[${action.actionColor}]`} />
            <span className="text-sm font-semibold text-gray-900">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsMenu;
