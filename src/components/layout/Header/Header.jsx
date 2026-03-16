import React, { useState } from "react";
import HeaderButton from "../HeaderButton.jsx";
import BurgerButton from "./BurgerButton.jsx";
import MobileMenu from "./MobileMenu/MobileMenu.jsx";
import "./header.css";
import logoImage from "../../../../logo.png";

const Header = ({ setCurrentPage }) => {
  const menuItems = ["Главная", "Новости", "Команда", "Обратиться", "Районные отделения"];
  const [modalWindow, setModalWindow] = useState(false);

  const handleClick = (item) => {
    // Обработка "Главная" - переходим на Новости
    const pageToSet = item === "Главная" ? "Новости" : item;
    setCurrentPage(pageToSet);
    setModalWindow(false);
    
    // Прокрутка к началу страницы при переключении
    setTimeout(() => {
      if (pageToSet === "Новости") {
        const newsSection = document.getElementById("news");
        if (newsSection) {
          newsSection.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        // Для остальных страниц прокручиваем к началу
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <>
      <header className="header">
        <div className="header__inner container mx-auto px-4 flex justify-between items-center gap-4 py-3 md:py-4">
          {/* Логотип + название */}
          <a href="#news" className="flex items-center gap-3 md:gap-4 shrink-0" onClick={(e) => { e.preventDefault(); setCurrentPage("Новости"); }}>
            <div className="header__logo w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#f4e4c8] border-2 border-white/50 flex items-center justify-center shadow-md shrink-0 overflow-hidden">
              <img
                src={logoImage}
                alt="Логотип Совета ветеранов города Челябинска"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-white/90 text-xs uppercase tracking-wider">Челябинск</p>
              <p className="text-white font-semibold text-sm md:text-base leading-tight">Совет ветеранов</p>
            </div>
          </a>

          {/* Десктоп-меню */}
          <nav className="hidden lg:flex items-center">
            <ul className="flex flex-wrap justify-end gap-5 md:gap-6 lg:gap-8">
              {menuItems.map((item) => (
                <HeaderButton key={item} onClick={() => handleClick(item)}>
                  {item}
                </HeaderButton>
              ))}
            </ul>
          </nav>

          <MobileMenu isOpen={modalWindow} setModalWindow={setModalWindow} onClick={handleClick} />
          <div className="lg:hidden">
            <BurgerButton modalWindow={modalWindow} setModalWindow={setModalWindow} />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;