import { useState } from 'react';

export const useToast = () => {
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const hideToast = () => {
    setShowToast(false);
  };

  return {
    toastMessage,
    showToast,
    showToastMessage,
    hideToast
  };
};
