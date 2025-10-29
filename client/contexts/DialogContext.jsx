import React, { createContext, useContext, useState } from 'react';

const DialogContext = createContext();

export const DialogProvider = ({ children }) => {
  const [dialogCount, setDialogCount] = useState(0);

  const openDialog = () => {
    setDialogCount(prev => prev + 1);
  };

  const closeDialog = () => {
    setDialogCount(prev => Math.max(0, prev - 1));
  };

  const isAnyDialogOpen = dialogCount > 0;

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog, isAnyDialogOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

export const useDialogState = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialogState must be used within DialogProvider');
  }
  return context;
};
