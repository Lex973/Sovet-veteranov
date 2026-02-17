import React from 'react';

const MobileMenuButton = ({children, onClick}) => {
    const handleClick = (e) => {
        if (onClick) {
            onClick(e);
        }
    };

    return (
        <button
            className="cursor-pointer w-full text-left h-10 text-green-600 font-medium"
            onClick={handleClick}
        >
            {children}
        </button>
    );
};

export default MobileMenuButton;