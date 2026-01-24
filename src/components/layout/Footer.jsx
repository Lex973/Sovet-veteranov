import React from 'react';
import HeaderButton from "./HeaderButton.jsx";

const Footer = ({ setCurrentPage }) => {
    const menuItems = ['Главная', 'Новости', 'Команда', 'Комитеты', 'Обратиться', 'Районные отделения'];

    return (
        <footer className="w-full bg-[#2C2C2C] mt-10">
            <div className="container mx-auto px-4">
                <div className="
                    max-w-7xl mx-auto py-10
                    flex justify-between items-center
                    text-white
                ">

                    {/* Навигация */}
                    <nav>
                        <p className="text-sm sm:text-lg lg:text-2xl mb-2">
                            Навигация:
                        </p>
                        <ul className="flex flex-col gap-1 sm:gap-2 text-xs sm:text-base lg:text-xl">
                            {menuItems.map((item) => (
                                <HeaderButton
                                    key={item}
                                    onClick={() => setCurrentPage(item)}
                                >
                                    {item}
                                </HeaderButton>
                            ))}
                        </ul>
                    </nav>

                    {/* Галерея (ВСЕГДА ПО ЦЕНТРУ) */}
                    <div className="
                        grid grid-cols-3
                        gap-2 sm:gap-4 lg:gap-5
                        place-items-center
                    ">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="
                                    bg-[#D9D9D9]
                                    w-16 h-12
                                    sm:w-24 sm:h-16
                                    lg:w-40 lg:h-24
                                "
                            />
                        ))}
                    </div>

                    {/* Контакты */}
                    <div className="text-right">
                        <p className="text-[10px] sm:text-sm lg:text-lg leading-relaxed mb-3">
                            © Челябинский городской Совет ветеранов, 2019 г. <br />
                            Изготовлено с использованием средств Фонда <br />
                            президентских грантов
                        </p>

                        <p className="text-sm sm:text-lg lg:text-2xl font-bold mb-1">
                            Контакты:
                        </p>
                        <p className="text-xs sm:text-base lg:text-lg leading-relaxed">
                            г. Челябинск, пл. Революции, дом 2, к. 510 <br />
                            +7 351 266-62-88 <br />
                            Veteranov41@mail.ru
                        </p>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;