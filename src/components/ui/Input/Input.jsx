import React from 'react';

const Input = () => {
    return (
        <div className="flex flex-col">
            <label htmlFor="FIO">Фио <span className="text-red-600">*</span></label>
            <input
                type="text"
                className="w-200 bg-[#F5F5F5] px-10 py-3 rounded-4xl border-black focus:outline-1 "
                placeholder="Введите имя"
                id="FIO"
            />
        </div>
    );
};

export default Input;