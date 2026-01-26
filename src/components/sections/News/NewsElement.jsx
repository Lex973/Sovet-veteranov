import React, { useState } from 'react';

const NewsElement = ({props}) => {
    const [imageError, setImageError] = useState(false);

    return (
        <div className="mb-10 flex flex-col gap-[15px]">
            <p>
                <strong className="text-[#910000] text-xl md:text-2xl lg:text-3xl xl:text-3xl 2xl:text-3xl">Заголовок:</strong>
                <span className="ml-1 text-xl md:text-2xl lg:text-3xl xl:text-3xl 2xl:text-3xl">{props.title}</span>
            </p>

            {imageError ? (
                <div className="h-100 w-full bg-[#D9D9D9] text-black flex items-center justify-center rounded-lg">
                    Изображение не загружено
                </div>
            ) : (
                <img 
                    src={props.image} 
                    alt={props.title} 
                    className="h-100 w-full object-cover rounded-lg"
                    onError={() => setImageError(true)}
                />
            )}

            <p className="text-xl md:text-xl lg:text-2xl xl:text-2xl 2xl:text-2xl">{props.subtitle}</p>

            <div className="flex items-center gap-5">
                <div>
                    <span className="text-md md:text-xl lg:text-xl xl:text-xl">{props.date}</span>
                    <strong className="ml-[5px] text-[#910000] font-medium text-md md:text-xl lg:text-xl xl:text-xl">{props.hashtag}</strong>
                </div>

                <div className="flex items-center justify-center flex-1">
                    <div className="line w-full h-1 bg-[#1C1C1C]"></div>
                </div>
            </div>

        </div>
    );
};

export default NewsElement;