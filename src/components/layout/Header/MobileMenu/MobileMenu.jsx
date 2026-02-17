import React, {useEffect, useState} from 'react';
import MobileMenuButton from "./MobileMenuButton.jsx";

const MobileMenu = ({setModalWindow, onClick, isOpen}) => {
    const menuItems = ['Главная', 'Новости', 'Команда', 'Обратиться', 'Районные отделения'];
    const handleItemClick = (element) => {
        // Закрываем меню перед навигацией
        setModalWindow(false);
        // Вызываем обработчик навигации
        onClick(element);
    };

    const closeMenu = () => {
        setModalWindow(false)
    }

    return (
        <>
            <div className={`fixed inset-0 bg-black z-40 lg:hidden ${isOpen ? 'opacity-40' : 'opacity-0 pointer-events-none'}`} onClick={() => setModalWindow(false)}></div>

            <div className={`w-80 h-full fixed right-0 top-0 bg-white z-50 lg:hidden p-6 overflow-y-auto duration-200 ${isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none opacity-0'}`}
            >

                <h1 className="text-4xl text-black">Меню</h1>

                <ul className="flex flex-col gap-5 justify-center items-start mt-7 mb-3 text-[22px]">
                    {menuItems.map(element => (
                        <li
                            key={element}
                            className="w-full hover:bg-gray-200 px-2 rounded-xl cursor-pointer"
                        >
                            <MobileMenuButton
                                onClick={() => {
                                    handleItemClick(element);
                                }}
                            >
                                {element}
                            </MobileMenuButton>
                        </li>
                    ))}
                </ul>

                <button
                    className="w-full text-center mt-5 bg-emerald-100 py-3 rounded-xl text-[#0b3b2e] cursor-pointer hover:bg-emerald-200 text-md"
                    onClick={closeMenu}>
                    Закрыть меню
                </button>
            </div>
        </>
    );
};

export default MobileMenu;