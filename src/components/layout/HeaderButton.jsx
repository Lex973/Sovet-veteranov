import React from 'react';

const HeaderButtons = ({children}) => {
    return (
        <button className="hover:underline cursor-pointer">
            {children}
        </button>
    );
};

export default HeaderButtons;