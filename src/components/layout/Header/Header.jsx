import React, {useState} from 'react';
import HeaderButton from "../HeaderButton.jsx";
import BurgerButton from "./BurgerButton.jsx";
import MobileMenu from "./MobileMenu/MobileMenu.jsx";
import './header.css'
const Header = ({setCurrentPage}) => {
    const menuItems = ['Главная', 'Новости', 'Команда', 'Комитеты', 'Обратиться', 'Районные отделения'];
    const [modalWindow, setModalWindow] = useState(false);


    const handleClick = (item) => {
        setCurrentPage(item);
        setModalWindow(!modalWindow);

        if (item === 'Новости') {
            setTimeout(() => {
                const newsSection = document.getElementById('news');

                if (newsSection) {
                    newsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    };

    return (
        <header className="header flex justify-between items-center container mx-auto mt-6">
            <div className="rounded-full bg-[#b61111] w-18 h-18"></div>

            <nav className="hidden lg:flex flex-col justify-center items-center mr-10">
                <ul className="flex gap-6 min-[1000px]:gap-8 min-[1100px]:gap-8 min-[1200px]:gap-10 min-[1400px]:gap-22 min-[1600px]:gap-23">
                    {menuItems.map((item) => (
                        <HeaderButton key={item} onClick={() => handleClick(item)}>{item}</HeaderButton>
                    ))}
                </ul>

                <div className="hidden lg:block bg-[#666666] w-[110%] h-1 mt-3 -ml-[5%]"></div>

            </nav>

            <MobileMenu
                isOpen={modalWindow}
                setModalWindow={setModalWindow}
                onClick={handleClick}
            />

            <div className="lg:hidden flex flex-col">
                <BurgerButton modalWindow={modalWindow} setModalWindow={setModalWindow}/>
            </div>
        </header>
    );
};

export default Header;