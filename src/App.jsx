import './App.css'
import Header from "./components/layout/Header/Header.jsx";
import {useState} from "react";
import News from "./components/sections/News/News.jsx";
import Footer from "./components/layout/Footer.jsx";
import Team from "./components/sections/Team/Team.jsx";
import Committees from "./components/sections/Committees/Committees.jsx";
import Contacts from "./components/sections/Contacts/Contacts.jsx";
import ToApply from "./components/sections/ToApply/ToApply.jsx";
import AdminReg from "./Admin/AdminReg/AdminReg.jsx";
import AdminPanel from "./Admin/AdminPanel/AdminPanel.jsx";
import Button from "./components/ui/Button/Button.jsx";
function App() {
    const [currentPage, setCurrentPage] = useState('Новости');

    const renderPage = function (currentPage) {
        switch (currentPage) {
            case 'Новости':
                return <News/>
            case 'Команда':
                return <Team/>
            case 'Комитеты':
                return <Committees/>
            case 'Районные отделения':
                return <Contacts/>
            case 'Обратиться':
                return <ToApply/>
            case 'Вход в админ-панель':
                return <AdminReg/>
            case 'Админ панель':
                return <AdminPanel/>
            default:
                return <News/>
        }
    }
  return (
    <>
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage}/>
        <section className="container mx-auto mt-5">
            <Button onClick={() => setCurrentPage('Вход в админ-панель')}>Вход в админ-панель</Button>
            <Button onClick={() => setCurrentPage('Админ панель')}>Админ панель</Button>
        </section>

        {renderPage(currentPage)}

        <Footer setCurrentPage={setCurrentPage}/>
    </>
  )
}

export default App
