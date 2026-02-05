import React from 'react';
import Input from "../../components/ui/Input/Input.jsx";
import Button from "../../components/ui/Button/Button.jsx";

const AdminReg = ({ onSuccess }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (typeof onSuccess === 'function') onSuccess();
    };

    return (
        <div className="h-200 container mx-auto flex flex-col justify-center items-center">
            <form onSubmit={handleSubmit} className="w-250 flex flex-col gap-5 container mx-auto max-w-md">
                <h1 className="text-4xl font-bold text-center mt-10 mb-10">Вход в админ-панель</h1>

                <Input inputText="Логин" placeholder="Введите логин" required={false} />
                <Input inputText="Пароль" placeholder="Введите пароль" required={false} />

                <Button type="submit" width="w-full mt-10" height="h-15">Войти</Button>
            </form>
        </div>
    );
};

export default AdminReg;