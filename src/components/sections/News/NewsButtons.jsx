import React, {useState} from 'react';
import Button from "../../ui/Button/Button.jsx";

const NewsButtons = () => {
    const hashtags = [
        '#Спорт', '#Отдых', '#Здоровье', '#ЖКХ', '#Культура',
        '#Социально-бытовой комитет', '#Образование',
        '#Военно-патриотический комитет', '#Проблемные вопросы',
        '#Решение проблемных вопросов', '#Разное'
    ];

    const [hashtag, setHashtag] = useState([])

    const handleClick = (event, btn) => {
        event.preventDefault();
        console.log(`Clicked: ${btn}`)
        if (hashtag.includes(btn)) {
            const newArray = hashtag.filter(prev => prev !== btn)
            setHashtag(newArray);
            return
        }
        setHashtag([...hashtag, btn])
    }

    return (
        <div>
            <section className="w-200 mt-10 mb-10">
                <h1>Выбранные хэштеги: {hashtag}</h1>
                {hashtags.map((btn, index) => (
                    <Button key={index + 1} onClick={(event) => handleClick(event, btn)} isActive={hashtag.includes(btn)}>{btn}</Button>
                ))}
            </section>
        </div>
    );
};

export default NewsButtons;