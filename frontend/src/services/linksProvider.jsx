import PropTypes from "prop-types";
import { createContext, useMemo, useState } from "react";
import { getLinks } from "./linkService";

export const DEFAULT_VALUES = {
  title: '',
  headerBackgroundColor: '#F8F9F8',
  linkFontColor: '#344054',
  iconColor: '#7F56D9',
  url: 'https://',
  active: true,
  absolutePath: false,
};

export const HelperLinkContext = createContext({
  helper: DEFAULT_VALUES,
  setHelper: (helper) => {},
  links: [],
  setLinks: (links) => {},
  showSettings: false,
  setShowSettings: (showSettings) => {},
  toggleSettings: (e, link) => {},
  itemToDelete: null,
  setItemToDelete: (link) => {},
  isPopupOpen: false,
  setIsPopupOpen: (openPopup) => {},
  deletedLinks: [],
  setDeletedLinks: (deletedLinks) => {},
  linkToEdit: null,
  setLinkToEdit: (link) => {},
  renderLinks: () => {},
  helperToEdit: null,
  setHelperToEdit: (helperId) => {},
});

const HelperLinkProvider = ({ children }) => {
  const [helper, setHelper] = useState(DEFAULT_VALUES);
  const [links, setLinks] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [deletedLinks, setDeletedLinks] = useState([]);
  const [linkToEdit, setLinkToEdit] = useState(null);
  const [helperToEdit, setHelperToEdit] = useState(null);

  const toggleSettings = (e, link = null) => {
    if (e.target.closest("#delete") || e.target.closest("#drag")) return;

    if (!showSettings && link) {
      setLinkToEdit(link);
    }
    setShowSettings(!showSettings); // Toggle the settings visibility
  };

  const renderLinks = async () => {
    if (helper.id) {
      const data = await getLinks(helper.id);
      setLinks(
        data
          .map((it) => ({ ...it, x: 0, y: 0 }))
          .sort((a, b) => a.order - b.order)
      );
    } else {
      renderLinks();
    }
  };

  const value = useMemo(
    () => ({
      helper,
      setHelper,
      links,
      setLinks,
      showSettings,
      setShowSettings,
      toggleSettings,
      itemToDelete,
      setItemToDelete,
      isPopupOpen,
      setIsPopupOpen,
      deletedLinks,
      setDeletedLinks,
      linkToEdit,
      setLinkToEdit,
      renderLinks,
      helperToEdit,
      setHelperToEdit,
    }),
    [helper, links, showSettings, isPopupOpen, linkToEdit]
  );
  return (
    <HelperLinkContext.Provider value={value}>
      {children}
    </HelperLinkContext.Provider>
  );
};

HelperLinkProvider.propTypes = {
  children: PropTypes.node,
};

export default HelperLinkProvider;
