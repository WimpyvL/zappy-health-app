
import React, { useEffect } from 'react';
import { ToastMessage } from '../../types';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '../../constants'; // Assuming XCircleIcon for error

interface ToastProps extends ToastMessage {
  onDismiss: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const baseClasses = "fixed top-6 right-6 px-4 py-3 rounded-xl z-[100] shadow-2xl transform transition-all duration-300 ease-out border max-w-sm backdrop-blur-sm";
  let typeClasses = "";
  let IconComponent: React.FC<{className?: string}> | null = null;

  switch (type) {
    case 'success':
      typeClasses = "bg-green-600 text-white border-green-500";
      IconComponent = CheckCircleIcon;
      break;
    case 'error':
      typeClasses = "bg-red-600 text-white border-red-500";
      IconComponent = ExclamationCircleIcon; // Placeholder, consider XCircleIcon
      break;
    case 'warning':
      typeClasses = "bg-yellow-500 text-black border-yellow-400";
      IconComponent = ExclamationCircleIcon;
      break;
    case 'info':
    default:
      typeClasses = "bg-blue-600 text-white border-blue-500";
      IconComponent = InformationCircleIcon;
      break;
  }
  
  // Animation classes - apply after mount for entry animation
  const [animationClass, setAnimationClass] = React.useState('translate-x-full opacity-0');
  React.useEffect(() => {
    setAnimationClass('translate-x-0 opacity-100'); // Animate in
    return () => { // Animate out on unmount (though dismiss handles removal mostly)
       setAnimationClass('translate-x-full opacity-0');
    }
  }, []);


  return (
    <div className={`${baseClasses} ${typeClasses} ${animationClass}`}>
      <div className="flex items-center">
        {IconComponent && <IconComponent className="w-5 h-5 mr-2 flex-shrink-0" />}
        <span className="font-medium text-sm">{message}</span>
      </div>
    </div>
  );
};


interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: number) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-0 right-0 z-[1000] p-4 space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onDismiss={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;
