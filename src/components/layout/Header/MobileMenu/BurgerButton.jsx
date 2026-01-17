import React, {useState} from 'react';

const BurgerButton = () => {
    const [modalWindow, setModalWindow] = useState(false);

    const showModalWindow = () => {
        setModalWindow(!modalWindow)
    }
    console.log(modalWindow)
    return (
        <button className="flex lg:hidden flex-col gap-2 cursor-pointer" onClick={() => showModalWindow(modalWindow)}>
            <span className="w-9 h-1 bg-black"></span>
            <span className="w-9 h-1 bg-black"></span>
            <span className="w-9 h-1 bg-black"></span>
        </button>
    );
};

export default BurgerButton;