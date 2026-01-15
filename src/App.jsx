import './App.css'
import Header from "./components/layout/Header.jsx";
import {useState} from "react";
import News from "./components/sections/News/News.jsx";
import Footer from "./components/layout/Footer.jsx";
import Team from "./components/sections/Team/Team.jsx";
import Committees from "./components/sections/Committees/Committees.jsx";
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
            default:
                return <News/>
        }
    }
  return (
    <>
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage}/>

        {renderPage(currentPage)}

        <Footer/>
    </>
  )
}

export default App
