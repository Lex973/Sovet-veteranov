import React from 'react';

const TeamElement = ({team}) => {
    return (
        <div
            key={team.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-101 duration-200 border border-gray-100"
        >
            <div className="relative h-64 overflow-hidden">
                <img
                    src={team.image}
                    alt={team.alt || team.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-semibold text-[#910000] mb-2">
                    {team.name}
                </h3>
                <p className="text-gray-700">
                    {team.description}
                </p>
            </div>
        </div>
    );
};

export default TeamElement;