import React, {useState} from 'react';

const BurgerButton = ({setModalWindow, modalWindow}) => {
    const handleClick = () => {
        setModalWindow(!modalWindow)
    }
    return (
        <button className="flex lg:hidden flex-col gap-2 cursor-pointer" onClick={handleClick}>
            <span className="w-9 h-1 bg-black"></span>
            <span className="w-9 h-1 bg-black"></span>
            <span className="w-9 h-1 bg-black"></span>
        </button>
    );
};

export default BurgerButton;