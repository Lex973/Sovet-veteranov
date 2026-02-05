import React from 'react';
import NewsElement from "./NewsElement.jsx";

const NewsList = ({ posts = [], loading, error, selectedHashtags }) => {
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
            <section className="container mx-auto px-4 py-10 text-center text-red-600">
                {error}
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
        <section className="">
            {filteredPosts.map((element) => (
                <NewsElement key={element.id} props={element} />
            ))}
        </section>
    );
};

export default NewsList;
