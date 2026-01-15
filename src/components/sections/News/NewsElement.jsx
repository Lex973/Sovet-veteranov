import React from 'react';

const NewsElement = ({props}) => {
    return (
        <div className="mb-10 flex flex-col gap-[15px]">
            <p>
                <strong className="text-[#910000] text-3xl">Заголовок:</strong>
                <span className="ml-1 text-3xl">{props.title}</span>
            </p>

            <div className="image h-100 bg-[#D9D9D9] text-black">{props.image}</div>

            <p className="text-2xl">{props.subtitle}</p>

            <div className="flex items-center gap-5">
                <div>
                    <span className="text-xl">{props.date}</span>
                    <strong className="ml-[5px] text-[#910000] font-medium text-xl">{props.hashtag}</strong>
                </div>

                <div className="flex items-center justify-center flex-1">
                    <div className="line w-full h-1 bg-[#1C1C1C]"></div>
                </div>
            </div>

        </div>
    );
};

export default NewsElement;