import React from "react";
import {useState} from "react";

const Input = ({ inputText, placeholder, photo, big, required = true }) => {
    const [fileName, setFileName] = useState('');

    const inputHeight = big
        ? "h-50 max-lg:h-40 max-sm:h-32"
        : "h-15 max-lg:h-13 max-sm:h-12";

    return (
        <div className="flex flex-col w-full">
            <label
                htmlFor={inputText}
                className="
                    font-bold text-base
                    max-lg:text-sm
                    max-sm:text-[13px]
                "
            >
                {inputText} {required && <span className="text-red-600">*</span>}
            </label>

            {photo ? (
                <label
                    htmlFor={inputText}
                    className={`
                        mt-3 flex items-center justify-center
                        border-2 border-dashed border-gray-400
                        rounded-4xl cursor-pointer
                        ${inputHeight}
                        text-sm
                    `}
                >
                    <input
                        type="file"
                        id={inputText}
                        className="hidden"
                        required={required}
                        onChange={(e) => setFileName(e.target.files[0]?.name)}
                    />
                    {fileName || placeholder}
                </label>
            ) : (
                <input
                    type="text"
                    id={inputText}
                    placeholder={placeholder}
                    required={required}
                    className={`
                        ${inputHeight}
                        mt-3 px-10 max-lg:px-6 max-sm:px-4
                        border-2 border-gray-400
                        rounded-4xl
                        focus:outline-none
                        text-base max-lg:text-sm
                    `}
                />
            )}
        </div>
    );
};
export default Input