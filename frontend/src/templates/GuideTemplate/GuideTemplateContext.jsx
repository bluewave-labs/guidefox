import React, { createContext, useContext, useState } from "react";

const GuideTemplateContext = createContext({
  isOpen: false,
  openDialog: () => {},
  closeDialog: () => {},
});

export const useDialog = () => {
  const context = useContext(GuideTemplateContext);
  if (context === undefined) {
    throw new Error("useDialog must be used within a GuideTemplateProvider");
  }
  return context;
};

export const GuideTemplateProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  return (
    <GuideTemplateContext.Provider value={{ isOpen, openDialog, closeDialog }}>
      {children}
    </GuideTemplateContext.Provider>
  );
};
