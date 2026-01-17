import React from 'react';
import classes from "./Button.module.css";
const Button = ({children, isActive, onClick, width, height, noMargin}) => {
    const defaultStyles = noMargin 
        ? "border-2 border-black py-[7px] px-10 rounded-4xl text-[20px] cursor-pointer duration-300"
        : "border-2 border-black py-[7px] px-10 rounded-4xl text-[20px] mr-3 mb-3 cursor-pointer duration-300";
    width = width ? width : "auto";
    height = height ? height : "auto";

    return (
        <button
            className={isActive ? `${classes.isActive} ${defaultStyles} ${width} ${height}` : `${defaultStyles} ${width} ${height}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;