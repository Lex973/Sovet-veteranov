import React from 'react';
import HeaderButton from "./HeaderButton.jsx";

const Header = ({currentPage, setCurrentPage}) => {
    const menuItems = ['Главная', 'Новости', 'Команда', 'Комитеты', 'Обратиться', 'Контакты'];

    return (
        <header className="flex justify-between items-center container mx-auto mt-6">
            <div className="rounded-full bg-gray-600 w-18 h-18"></div>

            <nav className="flex flex-col justify-center items-center">
                <ul className="flex gap-23 text-[22px]">
                    {menuItems.map((item, index) => (
                        <HeaderButton key={index + 1} onClick={() => setCurrentPage(item)}>{item}</HeaderButton>
                    ))}
                </ul>
                <div className="bg-[#666666] w-[110%] h-1 mt-3"></div>
            </nav>
        </header>
    );
};

export default Header;