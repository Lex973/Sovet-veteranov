import React from 'react';
import posts from "../../../data/News.js";
import NewsElement from "./NewsElement.jsx";

const NewsList = ({selectedHashtags, setSelectedHashtags}) => {
    const filteredPosts = selectedHashtags.length === 0
        ? posts
        : posts.filter(element => selectedHashtags.includes(element.hashtag))
    function renderPosts() {
        return filteredPosts.map(element => (
            <NewsElement key={element.id} props={element}/>
        ))
    }

    return (
        <section className="">
            {renderPosts()}
        </section>
    );
};

export default NewsList;