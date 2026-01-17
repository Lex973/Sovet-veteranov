import React, { useState } from 'react';

const Input = ({inputText, placeholder, photo, big, required = true}) => {
    const [fileName, setFileName] = useState('');
    
    const photoStyles = photo ? "h-40 border-2 border-black border-dashed cursor-pointer" : "none";
    const bigStyles = big ? "h-50 rounded-2xl" : "none";
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
        }
    };

    return (
        <div className="flex flex-col w-full">
            <label htmlFor={inputText} className="font-bold">
                {inputText} {required && <span className="text-red-600">*</span>}
            </label>
            {photo ? (
                <div className="relative mt-3">
                    <input
                        type="file"
                        id={inputText}
                        accept="image/*"
                        required={required}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <label
                        htmlFor={inputText}
                        className={`${photoStyles} flex items-center justify-center text-gray-500 border-2 border-gray-400 rounded-4xl cursor-pointer hover:border-gray-600 transition-all duration-200`}
                    >
                        {fileName ? (
                            <span className="text-gray-700 font-medium">{fileName}</span>
                        ) : (
                            <span>{placeholder}</span>
                        )}
                    </label>
                </div>
            ) : (
                <input
                    type="text"
                    id={inputText}
                    className={`${bigStyles} text border-2 border-gray-400 px-10 py-3 rounded-4xl focus:outline-1 mt-3 h-15`}
                    placeholder={placeholder}
                    required={required}
                />
            )}
        </div>
    );
};

export default Input;