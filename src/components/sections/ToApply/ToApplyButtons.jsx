import React, {useState} from 'react';
import Button from "../../ui/Button/Button.jsx";

const ToApplyButtons = ({setSwitchSection}) => {
    const textButtons = ['Ваши вопросы', 'Решения вопросов', 'Форма для обращения']

    const [activeButton, setActiveButton] = useState('Форма для обращения');
    const handleClick = (event, text) => {
        event.preventDefault();
        setActiveButton(text)

        setSwitchSection(text)
    }
    return (
        <section className="container mx-auto flex flex-col  items-center">
            <h1 className="text-5xl font-bold text-center mt-10 mb-15">Обратиться</h1>

            <nav className="flex gap-7">
                {textButtons.map((btn, index) => (
                    <Button key={index + 1} onClick={(event) => handleClick(event, btn)} isActive={activeButton.includes(btn)}>{btn}</Button>
                ))}
            </nav>

        </section>
    );
};

export default ToApplyButtons;