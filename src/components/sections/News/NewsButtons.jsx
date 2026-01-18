import React, {useState} from 'react';
import Button from "../../ui/Button/Button.jsx";

const NewsButtons = ({selectedHashtags, setSelectedHashtags}) => {
    const hashtags = [
        '#Спорт', '#Отдых', '#Здоровье', '#ЖКХ', '#Культура',
        '#Социально-бытовой комитет', '#Образование',
        '#Военно-патриотический комитет', '#Проблемные вопросы',
        '#Решение проблемных вопросов', '#Разное'
    ];

    const [hashtag, setHashtag] = useState([])
    const handleClick = (event, btn) => {
        event.preventDefault();

        if (hashtag.includes(btn)) {
            const newArray = hashtag.filter(prev => prev !== btn)

            setHashtag(newArray);
            setSelectedHashtags(newArray)

            return
        }

        setHashtag([...hashtag, btn])
        setSelectedHashtags([...selectedHashtags, btn])
    }

    return (
        <div className="mt-10 mb-10">
            <section className="w-200 text-center">
                {hashtags.map((btn, index) => (
                    <Button key={index + 1} onClick={(event) => handleClick(event, btn)} isActive={hashtag.includes(btn)}>{btn}</Button>
                ))}
            </section>
        </div>
    );
};

export default NewsButtons;