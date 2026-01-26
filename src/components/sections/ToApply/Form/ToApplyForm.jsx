import React from "react";
import {useState} from 'react'
import Button from "../../../ui/Button/Button.jsx";
import Input from "../../../ui/Input/Input.jsx";
const ToApplyForm = () => {
    const [active, setActive] = useState(false)

    const setActiveBtn = (e) => {
        e.preventDefault()
        setActive(prev => !prev)
    }

    return (
        <form className="container mx-auto mt-15 max-lg:mt-10 px-0 max-lg:px-4">
            <h1 className="
                text-3xl font-bold text-center
                max-md:text-2xl
            ">
                Форма для вашего вопроса
            </h1>

            <p className="
                text-center text-red-300 mt-3 mb-6
                text-base
                max-md:text-sm
            ">
                Поля помеченные <span className="text-red-600 text-2xl">*</span> обязательны к заполнению!
            </p>

            <section className="
                flex flex-col gap-8
                max-lg:gap-6
            ">
                <Input inputText="ФИО" placeholder="Укажите как вас зовут" />
                <Input inputText="Электронная почта" placeholder="Укажите вашу эл. почту" />
                <Input inputText="Телефон" placeholder="Укажите ваш номер телефона" />
                <Input
                    inputText="Ваш вопрос"
                    placeholder="Подробно опишите ваш вопрос"
                    big
                />

                <p className="
                    text-[15px] text-red-600 mt-3
                    max-md:text-sm
                ">
                    Нажимая кнопку "Отправить" вы даете своё согласие на обработку
                    персональных данных согласно ФЗ №152-ФЗ
                </p>

                <Button
                    isActive={active}
                    onClick={setActiveBtn}
                    width="w-full"
                    height="h-15"
                >
                    Отправить
                </Button>
            </section>
        </form>
    );
};
export default ToApplyForm