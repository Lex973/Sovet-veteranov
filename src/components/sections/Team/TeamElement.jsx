import React from 'react';

const TeamElement = () => {
    return (
        <div className="flex flex-col gap-7">
            <div className="image w-full h-100 bg-[#D9D9D9] text-black"></div>

            <p className="text-2xl text-[#910000] font-bold">Фамилия Имя Отчество</p>

            <p className="text-xl">Параграф, текст параграфа описывающий члена команды текст параграфа описывающий члена команды текст параграфа описывающий члена команды</p>
        </div>
    );
};

export default TeamElement;