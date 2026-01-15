import React from 'react';
import NewsButtons from "./NewsButtons.jsx";

const News = () => {
    return (
        <section>
            {/*<MainLogo/>*/}

            <div className="mt-20 container mx-auto">
                <h1 className="text-4xl font-bold">Новости</h1>

                <NewsButtons/>
            </div>
        </section>
    );
};

export default News;