import React, {useState} from 'react';
import NewsButtons from "./NewsButtons.jsx";
import NewsList from "./NewsList.jsx";
import NewsLogo from "./NewsLogo.jsx";
const News = () => {
    const [selectedHashtags, setSelectedHashtags] = useState([]);

    return (
        <section>
            <NewsLogo/>

            <div className="mt-20 container mx-auto flex flex-col justify-center items-center">
                <h1 className="text-5xl font-bold">Новости</h1>

                <NewsButtons selectedHashtags={selectedHashtags} setSelectedHashtags={setSelectedHashtags}/>
                <div id="news" className="absolute top-250 left-50px"></div>
                <NewsList selectedHashtags={selectedHashtags} setSelectedHashtags={setSelectedHashtags}/>
            </div>
        </section>
    );
};

export default News;