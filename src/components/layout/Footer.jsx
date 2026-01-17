import React from 'react';
import HeaderButton from "./HeaderButton.jsx";

const Footer = ({setCurrentPage}) => {
    const menuItems = ['Главная', 'Новости', 'Команда', 'Комитеты', 'Обратиться', 'Районные отделения'];

    return (
        <footer className="w-full bg-[#2C2C2C] h-90 mt-10 flex justify-center items-center">
            <div className="footerContainer py-10 w-full flex justify-evenly items-center text-white">
                <nav>
                    <p className="text-2xl">Навигация:</p>
                    <ul className="flex flex-col text-xl items-start">
                        {menuItems.map((item) => (
                            <HeaderButton key={item} onClick={() => setCurrentPage(item)}>{item}</HeaderButton>
                        ))}
                    </ul>
                </nav>

                <div className="grid grid-cols-3 gap-5">
                    <div className="w-50 h-30 bg-[#D9D9D9]"></div>
                    <div className="w-50 h-30 bg-[#D9D9D9]"></div>
                    <div className="w-50 h-30 bg-[#D9D9D9]"></div>
                    <div className="w-50 h-30 bg-[#D9D9D9]"></div>
                    <div className="w-50 h-30 bg-[#D9D9D9]"></div>
                    <div className="w-50 h-30 bg-[#D9D9D9]"></div>
                </div>

                <div className="flex flex-col text-right h-65 justify-between">
                    <span>
                        <p className="text-lg">© Челябинский городской Совет ветеранов, 2019 г. <br/> Изготовлено с использованием средств Фонда <br/> президентских грантов</p>
                    </span>

                    <span>
                        <p className="text-2xl font-bold">Контакты:</p>
                        <p className="text-lg">г. Челябинск, пл. Революции, дом 2, к. 510 <br/> +7 351 266-62-88 <br/> Veteranov41@mail.ru</p>
                    </span>
                </div>

            </div>
        </footer>
    );
};

export default Footer;