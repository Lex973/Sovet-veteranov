import React from 'react';
import NewsElement from "./NewsElement.jsx";

const NewsList = ({ posts = [], loading, error, onRetry, selectedHashtags }) => {
    const filteredPosts = selectedHashtags.length === 0
        ? posts
        : posts.filter((element) => selectedHashtags.includes(element.hashtag));

    if (loading) {
        return (
            <section className="container mx-auto px-4 py-10 text-center text-gray-600">
                Загрузка новостей...
            </section>
        );
    }

    if (error) {
        return (
            <section className="container mx-auto px-4 py-10 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="px-4 py-2 rounded-lg bg-[#0b3b2e] text-white hover:bg-[#145c3b] transition-colors"
                    >
                        Повторить попытку
                    </button>
                )}
            </section>
        );
    }

    if (filteredPosts.length === 0) {
        return (
            <section className="container mx-auto px-4 py-10 text-center text-gray-600">
                Новостей пока нет.
            </section>
        );
    }

    return (
        <section className="mt-8 space-y-12">
            {filteredPosts.map((element) => (
                <NewsElement key={element.id} props={element} />
            ))}
        </section>
    );
};

export default NewsList;
