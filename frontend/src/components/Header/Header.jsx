import React, { useState } from 'react';
import './Header.css';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Avatar from '../Avatar/Avatar';
import DropdownMenu from './DropdownMenu/DropdownMenu';
import { useAuth } from '../../services/authProvider';

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { userInfo } = useAuth();

    const handleDropdownClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="top-banner">
            <div className="logo">GuideFox</div>
            <div className="user-info">
                <Avatar src="/vendetta.png" alt="User" size="medium" />
                <div className="user-details">
                    <div className="user-name">{userInfo.fullName}</div>
                    <div className="user-role">{userInfo.role}</div>
                </div>
                <button className="dropdown-button" onClick={handleDropdownClick}>
                    {isDropdownOpen ? (
                        <>
                            <KeyboardArrowUpIcon />
                            <DropdownMenu />
                        </>
                    ) : (
                        <KeyboardArrowDownOutlinedIcon />
                    )}
                </button>
            </div>
        </div>
    );
};

export default Header;
