import React, { useState, useRef, useEffect } from 'react';
import DropdownMenuList from './DropdownMenuList/DropdownMenuList';
import styles from './DropdownMenu.module.css';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import PropTypes from 'prop-types';

const DropdownMenu = ({ menuItems, direction = 'up' }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleDropdownClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const renderOpenArrowIcon = () => {
    switch (direction) {
      case 'up':
        return <KeyboardArrowUpIcon />;
      case 'down':
        return <KeyboardArrowDownOutlinedIcon />;
      case 'left':
        return <KeyboardArrowLeftIcon />;
      case 'right':
        return <KeyboardArrowRightIcon />;
      default:
        return <KeyboardArrowDownOutlinedIcon />;
    }
  };

  const renderClosedArrowIcon = () => {
    switch (direction) {
      case 'up':
        return <KeyboardArrowDownOutlinedIcon />;
      case 'down':
        return <KeyboardArrowUpIcon />;
      case 'left':
        return <KeyboardArrowRightIcon />;
      case 'right':
        return <KeyboardArrowLeftIcon />;
      default:
        return <KeyboardArrowUpIcon />;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef}>
      <button
        className={styles['dropdownButton']}
        onClick={handleDropdownClick}
      >
        {isDropdownOpen ? (
          <>
            {renderOpenArrowIcon()}
            <DropdownMenuList menuItems={menuItems} direction={direction} />
          </>
        ) : (
          <>{renderClosedArrowIcon()}</>
        )}
      </button>
    </div>
  );
};

DropdownMenu.propTypes = {
  menuItems: PropTypes.array.isRequired,
  direction: PropTypes.oneOf(['up', 'down', 'left', 'right']),
};

export default DropdownMenu;
