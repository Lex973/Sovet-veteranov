import './App.css'
import Header from "./components/layout/Header/Header.jsx";
import React, { useState, useEffect } from "react";
import News from "./components/sections/News/News.jsx";
import Footer from "./components/layout/Footer.jsx";
import Team from "./components/sections/Team/Team.jsx";
import Contacts from "./components/sections/Contacts/Contacts.jsx";
import ToApply from "./components/sections/ToApply/ToApply.jsx";
import AdminReg from "./Admin/AdminReg/AdminReg.jsx";
import AdminPanel from "./Admin/AdminPanel/AdminPanel.jsx";
import { getHolidayTheme, HOLIDAY_THEME_EVENT } from "./utils/holidayTheme.js";

const getPageFromHash = () => {
    const hash = (window.location.hash || "").replace(/^#/, "");
    if (hash === "admin") return "Админ панель";
    if (hash === "admin-login") return "Вход в админ-панель";
    return null;
};

const ADMIN_STORAGE_KEY = "sv_admin";

function App() {
    const [currentPage, setCurrentPage] = useState(() => getPageFromHash() || "Новости");
    const [holiday, setHoliday] = useState(getHolidayTheme);
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
        () => typeof sessionStorage !== "undefined" && sessionStorage.getItem(ADMIN_STORAGE_KEY) === "1"
    );

    useEffect(() => {
        const onHashChange = () => {
            const page = getPageFromHash();
            if (page) setCurrentPage(page);
        };
        window.addEventListener("hashchange", onHashChange);
        return () => window.removeEventListener("hashchange", onHashChange);
    }, []);

    useEffect(() => {
        const onThemeChange = () => setHoliday(getHolidayTheme());
        window.addEventListener(HOLIDAY_THEME_EVENT, onThemeChange);
        return () => window.removeEventListener(HOLIDAY_THEME_EVENT, onThemeChange);
    }, []);

    const setPage = (page) => {
        setCurrentPage(page);
        if (page === "Админ панель") window.location.hash = "admin";
        else if (page === "Вход в админ-панель") window.location.hash = "admin-login";
        else window.location.hash = "";
    };

    const onAdminSuccess = () => {
        sessionStorage.setItem(ADMIN_STORAGE_KEY, "1");
        setIsAdminLoggedIn(true);
        setPage("Админ панель");
    };

    const onAdminLogout = () => {
        sessionStorage.removeItem(ADMIN_STORAGE_KEY);
        setIsAdminLoggedIn(false);
        setPage("Новости");
    };

    const renderPage = function (currentPage) {
        switch (currentPage) {
            case "Новости":
                return <News />
            case "Команда":
                return <Team />
            case "Районные отделения":
                return <Contacts />
            case "Обратиться":
                return <ToApply />
            case "Вход в админ-панель":
                return <AdminReg onSuccess={onAdminSuccess} />
            case "Админ панель":
                if (!isAdminLoggedIn) return <AdminReg onSuccess={onAdminSuccess} />
                return <AdminPanel onLogout={onAdminLogout} />
            default:
                return <News />
        }
    }
    const holidayClasses = [
        holiday.newYearDecor && "holiday-newyear-decor",
        holiday.newYearEffects && "holiday-newyear-effects",
        holiday.victoryDayDecor && "holiday-victory-decor",
        holiday.victoryDayEffects && "holiday-victory-effects",
    ].filter(Boolean).join(" ");

  return (
    <div className={`relative ${holidayClasses}`.trim()}>


        <Header currentPage={currentPage} setCurrentPage={setPage}/>
        {renderPage(currentPage)}

        <Footer setCurrentPage={setPage}/>
    </div>
  )
}

export default App
