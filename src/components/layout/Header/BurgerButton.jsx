import React, {useState} from 'react';

const BurgerButton = ({setModalWindow, modalWindow}) => {
    const handleClick = () => {
        setModalWindow(!modalWindow)
    }
    return (
        <button type="button" className="flex lg:hidden flex-col gap-1.5 cursor-pointer p-1" onClick={handleClick} aria-label="Меню">
            <span className="w-7 h-0.5 bg-white rounded"></span>
            <span className="w-7 h-0.5 bg-white rounded"></span>
            <span className="w-7 h-0.5 bg-white rounded"></span>
        </button>
    );
};

export default BurgerButton;