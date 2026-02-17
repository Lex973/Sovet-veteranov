import React, { useState, useEffect } from "react";
import HeaderButton from "./HeaderButton.jsx";
import { api } from "../../api/client.js";
import { API_BASE } from "../../api/config.js";

const Footer = ({ setCurrentPage }) => {
  const menuItems = ["Главная", "Новости", "Команда", "Обратиться", "Районные отделения"];
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    let cancelled = false;
    api.partners
      .list()
      .then((data) => {
        if (!cancelled) setPartners(Array.isArray(data) ? data : []);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const partnerImageSrc = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  return (
    <footer className="w-full bg-[#2C2C2C] mt-10">
      <div className="container mx-auto px-4">
        <div className="
                    max-w-7xl mx-auto py-10
                    flex justify-between items-center
                    text-white
                ">
          <nav>
            <p className="text-sm sm:text-lg lg:text-2xl mb-2">Навигация:</p>
            <ul className="flex flex-col gap-1 sm:gap-2 text-xs sm:text-base lg:text-xl items-start">
              {menuItems.map((item) => (
                <li key={item} className="w-full">
                  <HeaderButton onClick={() => setCurrentPage(item)}>
                    {item}
                  </HeaderButton>
                </li>
              ))}
            </ul>
          </nav>

          {partners.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 lg:gap-5 place-items-center">
              {partners.map((p) => {
                const content = p.image ? (
                  <img src={partnerImageSrc(p.image)} alt="Логотип партнёра" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full bg-[#D9D9D9] min-w-[4rem] min-h-[3rem] sm:min-w-[6rem] sm:min-h-[4rem]" />
                );
                return (
                  <a
                    key={p.id}
                    href={p.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-16 h-12 sm:w-24 sm:h-16 lg:w-40 lg:h-24 rounded overflow-hidden bg-[#D9D9D9] hover:opacity-90 transition-opacity"
                  >
                    {content}
                  </a>
                );
              })}
            </div>
          )}

                    <div className="text-right">
                        <p className="text-[10px] sm:text-sm lg:text-lg leading-relaxed mb-3">
                            © Челябинский городской Совет ветеранов, 2019–{new Date().getFullYear()} г. <br />
                            Изготовлено с использованием средств Фонда <br />
                            президентских грантов
                        </p>

                        <p className="text-sm sm:text-lg lg:text-2xl font-bold mb-1">
                            Контакты:
                        </p>

                        <p className="text-xs sm:text-base lg:text-lg leading-relaxed">
                            г. Челябинск, пл. Революции, дом 2, к. 510 <br />
                            <a href="tel:+73512666288" className="text-white hover:underline">+7 351 266-62-88</a> <br />
                            <a href="mailto:Veteranov41@mail.ru" className="text-white hover:underline">Veteranov41@mail.ru</a>
                        </p>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;