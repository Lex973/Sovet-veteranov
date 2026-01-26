import React from 'react';

const HeaderButton = ({children, onClick}) => {
    return (
        <button
            className="hover:underline cursor-pointer
                       text-[15px]
                       min-[1000px]:text-[19px]
                       min-[1100px]:text-[19px]
                       min-[1600px]:text-[20px]
                       min-[1700px]:text-[21px]
                       min-[1800px]:text-[22px]
                       whitespace-nowrap
                       transition-all duration-200"

            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default HeaderButton;