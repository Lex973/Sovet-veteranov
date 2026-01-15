import React from 'react';
import posts from "../../../data/News.js";
import NewsElement from "./NewsElement.jsx";

const NewsList = ({selectedHashtags, setSelectedHashtags}) => {
    const filteredPosts = selectedHashtags.length === 0
        ? posts
        : posts.filter(element => selectedHashtags.includes(element.hashtag))

    console.log(filteredPosts)
    function renderPosts() {
        return filteredPosts.map(element => (
            <NewsElement key={element.id} props={element}/>
        ))
    }

    return (
        <section className="grid grid-cols-2 gap-10">
            {renderPosts()}
        </section>
    );
};

export default NewsList;