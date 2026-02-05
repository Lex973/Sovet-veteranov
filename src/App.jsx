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
import Button from "./components/ui/Button/Button.jsx";

const getPageFromHash = () => {
    const hash = (window.location.hash || "").replace(/^#/, "");
    if (hash === "admin") return "Админ панель";
    if (hash === "admin-login") return "Вход в админ-панель";
    return null;
};

function App() {
    const [currentPage, setCurrentPage] = useState(() => getPageFromHash() || "Новости");

    useEffect(() => {
        const onHashChange = () => {
            const page = getPageFromHash();
            if (page) setCurrentPage(page);
        };
        window.addEventListener("hashchange", onHashChange);
        return () => window.removeEventListener("hashchange", onHashChange);
    }, []);

    const setPage = (page) => {
        setCurrentPage(page);
        if (page === "Админ панель") window.location.hash = "admin";
        else if (page === "Вход в админ-панель") window.location.hash = "admin-login";
    };

    const renderPage = function (currentPage) {
        switch (currentPage) {
            case 'Новости':
                return <News/>
            case 'Команда':
                return <Team/>
            case 'Районные отделения':
                return <Contacts/>
            case 'Обратиться':
                return <ToApply/>
            case 'Вход в админ-панель':
                return <AdminReg onSuccess={() => setPage('Админ панель')} />
            case 'Админ панель':
                return <AdminPanel/>
            default:
                return <News/>
        }
    }
  return (
    <div className="relative">


        <Header currentPage={currentPage} setCurrentPage={setCurrentPage}/>
        <section className="container mx-auto mt-5 flex flex-wrap gap-3 px-4">
            <Button onClick={() => setPage('Вход в админ-панель')}>Вход в админ-панель</Button>
            <Button onClick={() => setPage('Админ панель')}>Админ панель</Button>
        </section>

        {renderPage(currentPage)}

        <Footer setCurrentPage={setCurrentPage}/>
    </div>
  )
}

export default App
