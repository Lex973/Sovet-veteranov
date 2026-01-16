import React from 'react';

const Input = ({inputText, placeholder}) => {
    return (
        <div className="flex flex-col w-full">
            <label htmlFor="text" className="font-bold">{inputText} <span className="text-red-600">*</span></label>
            <input
                type="text"
                className="text bg-[#F5F5F5] px-10 py-3 rounded-4xl border-black focus:outline-1 mt-3 h-15"
                placeholder={placeholder}
            />
        </div>
    );
};

export default Input;