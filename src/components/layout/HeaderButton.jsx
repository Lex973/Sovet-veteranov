import React from 'react';

const HeaderButton = ({children, onClick}) => {
    return (
        <button
            className="hover:underline cursor-pointer"
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default HeaderButton;