import React, { useEffect, useRef, useState } from "react";
import { API_BASE } from "../../../api/config.js";

const imageSrc = (url) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
};

const TeamElement = ({ team, onReadMore }) => {
    const MAX_HEIGHT = 140;

    const [overflow, setOverflow] = useState(false)
    const paragraph = useRef(null)


    useEffect(() => {
        if (paragraph.current) {
            const scrollHeight = paragraph.current.scrollHeight;

            scrollHeight > MAX_HEIGHT ? setOverflow(true): setOverflow(false);
        }
    }, [team.description]);

    return (
        <div
            key={team.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-101 duration-200 border border-gray-100 relative"
        >
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#e5e5e5]">
                {team.image ? (
                    <img
                        src={imageSrc(team.image)}
                        alt={team.alt || team.name}
                        className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">👤</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>

            <div className="p-6">
                <h3 className="text-xl font-semibold text-[#0b3b2e] mb-2">
                    {team.name}
                </h3>
                <p
                    ref={paragraph}
                    className={overflow ? 'text-gray-700 h-30 overflow-hidden [mask-image:linear-gradient(to_bottom,black_40%,transparent_80%)]' : 'text-gray-700 h-30'}>
                    {team.description}
                </p>
                <span className={overflow ? 'absolute right-10 bottom-4 cursor-pointer hover:text-red-500' : 'hidden'} onClick={onReadMore}>
                    Узнать больше
                </span>

            </div>
        </div>
    );
};

export default TeamElement;