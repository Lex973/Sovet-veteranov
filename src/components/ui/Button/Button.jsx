import React from 'react';
import classes from "./Button.module.css";
const Button = ({children}) => {
    console.log(children)
    return (
        <button
            className="border-2 border-black py-[6px] px-7 rounded-4xl text-[17px]"
        >
            {children}
        </button>
    );
};

export default Button;