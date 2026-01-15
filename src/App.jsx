import './App.css'
import Header from "./components/layout/Header.jsx";
import {useState} from "react";
import News from "./components/sections/News/News.jsx";''
function App() {
    const [currentPage, setCurrentPage] = useState('Главная');

    // const renderPage = function (currentPage) {
    //     switch (currentPage) {
    //         case 'Новости':
    //             return <News/>
    //     }
    // }
  return (
    <>
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage}/>

        <News/>
        {/*{renderPage(currentPage)}*/}
    </>
  )
}

export default App
