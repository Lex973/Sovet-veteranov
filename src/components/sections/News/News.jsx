import React, { useState, useEffect, useCallback } from "react";
import NewsButtons from "./NewsButtons.jsx";
import NewsList from "./NewsList.jsx";
import NewsLogo from "./NewsLogo.jsx";
import { api } from "../../../api/client.js";

const News = () => {
    const [selectedHashtags, setSelectedHashtags] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadNews = useCallback(() => {
        setLoading(true);
        setError(null);
        api.news
            .list()
            .then((data) => setPosts(Array.isArray(data) ? data : []))
            .catch((e) => setError(e.message || "Не удалось загрузить новости"))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        loadNews();
    }, [loadNews]);

    const hashtags = [...new Set(posts.map((p) => p.hashtag).filter(Boolean))];

    return (
        <section className="min-h-screen">
            <NewsLogo />

            <div id="news" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0b3b2e] mb-8">Новости</h1>

                <NewsButtons
                    selectedHashtags={selectedHashtags}
                    setSelectedHashtags={setSelectedHashtags}
                    hashtags={hashtags}
                />

                <NewsList
                    posts={posts}
                    loading={loading}
                    error={error}
                    onRetry={loadNews}
                    selectedHashtags={selectedHashtags}
                    setSelectedHashtags={setSelectedHashtags}
                />
            </div>
        </section>
    );
};

export default News;
