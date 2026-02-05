import React, { useState, useEffect } from 'react';
import NewsButtons from "./NewsButtons.jsx";
import NewsList from "./NewsList.jsx";
import NewsLogo from "./NewsLogo.jsx";
import { api } from "../../../api/client.js";

const News = () => {
    const [selectedHashtags, setSelectedHashtags] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);
        api.news
            .list()
            .then((data) => {
                if (!cancelled) setPosts(Array.isArray(data) ? data : []);
            })
            .catch((e) => {
                if (!cancelled) setError(e.message || "Не удалось загрузить новости");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, []);

    const hashtags = [...new Set(posts.map((p) => p.hashtag).filter(Boolean))];

    return (
        <section>
            <NewsLogo/>

            <div className="mt-20 container mx-auto flex flex-col justify-center items-center">
                <h1 className="text-4xl font-bold sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-5xl">Новости</h1>

                <NewsButtons
                    selectedHashtags={selectedHashtags}
                    setSelectedHashtags={setSelectedHashtags}
                    hashtags={hashtags}
                />
                <div id="news" className="absolute top-250 left-50px"></div>
                <NewsList
                    posts={posts}
                    loading={loading}
                    error={error}
                    selectedHashtags={selectedHashtags}
                    setSelectedHashtags={setSelectedHashtags}
                />
            </div>
        </section>
    );
};

export default News;
