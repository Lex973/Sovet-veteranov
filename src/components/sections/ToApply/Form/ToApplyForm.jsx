import React, {useState} from 'react';
import Input from "../../../ui/Input/Input.jsx";
import Button from "../../../ui/Button/Button.jsx";

const ToApplyForm = () => {
    const [active, setActive] = useState(false)
    const setActiveBtn = (event) => {
        event.preventDefault()

        active ? setActive(false) : setActive(true)}
    return (
        <form className="mx-auto container mt-15">
            <h1 className="text-3xl text-center font-bold">Форма для вашего вопроса</h1>
            <p className="text-center text-red-300 mt-3 mb-3">Поля помеченные <span className="text-red-600 text-2xl">*</span> обязательны к заполнению!</p>

            <section className="justify-center items-center flex flex-col gap-8 container mx-auto">
                <Input inputText={"ФИО"} placeholder="Укажите как вас зовут"/>
                <Input inputText={"Электронная почта"} placeholder="Укажите вашу эл. почту для получения ответа"/>
                <Input inputText={"Телефон"} placeholder="Укажите ваш номер телефона" />
                <Input inputText={"Ваш вопрос"} placeholder="Подробно опишите ваш вопрос"/>

                <p className="text-[15px] text-red-600 mt-3 mb-3">Нажимая кнопку "Отправить" вы даете своё согласие на обработку и использование своих персональных данных, согласно ФЗ № 152-ФЗ «О персональных данных» от 27.07.2006 г.</p>
                <Button isActive={active} onClick={(event) => setActiveBtn(event)} width="w-full" height="h-15">Отправить</Button>
            </section>
        </form>
    );
};

export default ToApplyForm;