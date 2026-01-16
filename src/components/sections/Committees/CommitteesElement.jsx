import React from 'react';

const CommitteesElement = ({member}) => {
    return (
        <div
            key={member.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-101 duration-200 border border-gray-100"
        >
            <div className="relative h-64 overflow-hidden">
                <img
                    src={member.image}
                    alt={member.alt || member.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-semibold text-[#910000] mb-2">
                    {member.name}
                </h3>
                <p className="text-[#910000] font-medium mb-4 text-lg">
                    {member.position}
                </p>
                <p className="text-gray-700">
                    {member.description}
                </p>
            </div>
        </div>
    );
};

export default CommitteesElement;