import React from 'react';
import classes from "./Button.module.css";
const Button = ({children, isActive, onClick}) => {
    const defaultStyles = "border-2 border-black py-[6px] px-8 rounded-4xl text-[17px] mr-3 mb-3 cursor-pointer"
    return (
        <button
            className={isActive ? `${classes.isActive} ${defaultStyles}` : `${defaultStyles}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;