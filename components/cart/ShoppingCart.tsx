
import React, { useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import { redirectToPaymentCheckout } from '../../utils/stripeCheckout'; // Definition not provided
import { X, Trash2, Plus, Minus, ShoppingCart as CartIconLucide } from 'lucide-react';
// import { message } from 'antd'; // Removed antd dependency
import { ToastContext } from '../../App'; // Import ToastContext
import { ToastContextType } from '../../types'; // Assuming ToastContextType is in types

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define a richer CartItem type based on usage in this component
interface CartItem {
  doseId: string;
  productName: string;
  doseValue?: string;
  price: number;
  quantity: number;
  requiresPrescription?: boolean;
  imageUrl?: string;
}

// Local dummy useCart implementation
const useCart = () => {
  return {
    cartItems: [] as CartItem[], // Use the defined CartItem type
    addItemToCart: (item: CartItem) => { 
      console.log("Dummy: Add to cart", item.productName);
    },
    removeItem: (doseId: string) => {
      console.log("Dummy: Remove item", doseId);
    },
    updateQuantity: (doseId: string, quantity: number) => {
      console.log("Dummy: Update quantity", doseId, quantity);
    },
    clearCart: () => {
      console.log("Dummy: Clear cart");
    },
    getCartTotal: () => 0,
    getCartItemCount: () => 0,
  };
};

// Dummy redirectToPaymentCheckout as it's not provided
const redirectToPaymentCheckout = async (items: CartItem[], toastAdder?: (message: string, type?: 'info' | 'success' | 'error' | 'warning') => void) => {
  console.log("Dummy: Redirecting to payment checkout for items:", items);
  toastAdder?.("Checkout process is not implemented in this version.", 'info');
  // In a real scenario, this would interact with a payment provider
  return Promise.resolve(); 
};


const ShoppingCart: React.FC<ShoppingCartProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const toastContext = useContext<ToastContextType | undefined>(ToastContext);
  
  const {
    cartItems,
    removeItem,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
  } = useCart();

  const cartRef = useRef<HTMLDivElement>(null);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toastContext?.addToast('Your cart is empty.', 'warning');
      return;
    }

    try {
      const prescriptionItems = cartItems.filter(
        (item) => item.requiresPrescription
      );

      if (prescriptionItems.length > 0) {
        navigate('/intake-form', { 
          state: {
            prescriptionItems, 
          },
        });
        onClose(); 
        return;
      }

      await redirectToPaymentCheckout(cartItems, toastContext?.addToast); 
    } catch (error) {
      toastContext?.addToast(`Checkout failed: ${(error as Error).message}`, 'error');
    }
  };

  const handleQuantityChange = (doseId: string, change: number) => {
    const item = cartItems.find((i) => i.doseId === doseId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity >= 1) { 
        updateQuantity(doseId, newQuantity);
        // toastContext?.addToast(`Updated quantity of ${item.productName}`, 'success'); // Message comes from dummy hook now
      } else if (newQuantity === 0) {
        removeItem(doseId); 
        // toastContext?.addToast(`${item.productName} removed from cart.`, 'info'); // Message comes from dummy hook now
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end">
      <div
        ref={cartRef}
        className="bg-white w-full max-w-md h-full shadow-xl flex flex-col dark:bg-gray-800"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-10">
              <CartIconLucide size={48} className="mx-auto mb-4 text-gray-400 dark:text-gray-500" />
              Your cart is empty.
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.doseId} 
                className="flex items-start space-x-3 border-b pb-3 last:border-b-0 dark:border-gray-700"
              >
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-gray-400 dark:text-gray-500">
                  {item.imageUrl ? <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover rounded"/> : <CartIconLucide size={24} />}
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {item.productName}
                  </p>
                  {item.doseValue && <p className="text-xs text-gray-500 dark:text-gray-400">{item.doseValue}</p>}
                  {item.requiresPrescription && (
                    <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded mt-1 dark:bg-blue-900 dark:text-blue-200">
                      Requires Prescription
                    </span>
                  )}
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                    ${item.price.toFixed(2)}
                  </p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => handleQuantityChange(item.doseId, -1)}
                      className="p-1 border rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                      disabled={item.quantity <= 1 && !item.requiresPrescription} 
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 text-sm dark:text-gray-200">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.doseId, 1)}
                      className="p-1 border rounded text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    removeItem(item.doseId);
                    // toastContext?.addToast(`${item.productName} removed from cart.`, 'info'); // Message from dummy hook
                  }}
                  className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                  aria-label="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">
                Subtotal ({getCartItemCount()} items)
              </span>
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                ${getCartTotal().toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full px-4 py-3 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={() => {
                clearCart();
                toastContext?.addToast('Cart cleared.', 'info'); 
              }}
              className="w-full text-center text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 mt-2"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
