import React from 'react';

const HeaderButton = ({children}) => {
    return (
        <button className="hover:underline cursor-pointer">
            {children}
        </button>
    );
};

export default HeaderButton;