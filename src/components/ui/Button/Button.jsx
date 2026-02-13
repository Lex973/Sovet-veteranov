import React from 'react';
import classes from "./Button.module.css";

const Button = ({ children, isActive, onClick, width, height, noMargin, type, disabled }) => {
    const defaultStyles = noMargin
        ? "border-2 border-black rounded-4xl cursor-pointer duration-300 whitespace-nowrap px-5 py-3" +
        "text-sm h-10 " +
        "sm:text-base sm:h-11 " +
        "md:text-base md:h-11 " +
        "lg:text-lg lg:h-12 lg:mr-3 lg:mb-3 " +
        "xl:text-xl xl:h-12 xl:mr-3 xl:mb-3 " +
        "2xl:text-xl 2xl:h-12 2xl:mr-3 2xl:mb-3"
        : "border-2 border-black rounded-4xl cursor-pointer duration-300 whitespace-nowrap px-5 py-3" +
        "text-sm h-10 mr-2 mb-2 " +
        "sm:text-base sm:h-11 sm:mr-2.5 sm:mb-2.5 " +
        "md:text-base md:h-11 md:mr-3 md:mb-3 " +
        "lg:text-lg lg:h-12 lg:mr-3 lg:mb-3 " +
        "xl:text-xl xl:h-12 xl:mr-3 xl:mb-3 " +
        "2xl:text-xl 2xl:h-12 2xl:mr-3 2xl:mb-3";

    width = width ? width : "";
    height = height ? height : "";

    return (
        <button
            type={type ?? "button"}
            disabled={disabled}
            className={isActive ? `${classes.isActive} ${defaultStyles} ${width} ${height}` : `${defaultStyles} ${width} ${height}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;