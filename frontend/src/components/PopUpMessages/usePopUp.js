import { useState } from "react";

//Use this hook where we want to control the PopUp
export const usePopUp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const showPopUp = () => {
    setIsOpen(true);
  };
  const hidePopUp = () => {
    setIsOpen(false);
  };

  return { isOpen, showPopUp, hidePopUp };
};
