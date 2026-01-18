import React from 'react';
import Input from "../../components/ui/Input/Input.jsx";
import Button from "../../components/ui/Button/Button.jsx";

const AdminReg = () => {
    return (
        <div className="h-200 container mx-auto flex flex-col justify-center items-center">
            <form action="" className="w-250 flex flex-col gap-5 container mx-auto">
                <h1 className="text-4xl font-bold text-center mt-10 mb-10">Вход в админ-панель</h1>

                <Input inputText="Логин" placeholder="Введит логин"/>
                <Input inputText="Пароль" placeholder="Введит пароль"/>

                <Button width="w-full mt-10" height="h-15">Войти</Button>
            </form>
        </div>
    );
};

export default AdminReg;