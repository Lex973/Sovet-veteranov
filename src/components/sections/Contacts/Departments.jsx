import React from 'react';

const Departments = ({dept}) => {
    return (
        <div key={dept.id} className="bg-white rounded-lg p-4 md:p-5 shadow-[0_4px_6px_-2px_rgba(0,0,0,0.5)] hover:shadow-[0_4px_15px_-2px_rgba(0,0,0,0.5)] hover:scale-101 duration-200">
            <h3 className="text-base md:text-lg font-semibold text-black mb-3">
                {dept.name}
            </h3>

            <div className="space-y-2 text-sm md:text-base">
                <div className="flex items-start">
                    <span className="font-bold text-[#910000] w-20 flex-shrink-0 ">
                        Адрес:
                    </span>
                    <span className="text-gray-700">{dept.address}</span>
                </div>

                <div className="flex items-center">
                    <span className="font-bold text-[#910000] w-20 flex-shrink-0">Тел:</span>
                    <span className="text-gray-700">{dept.phone}</span>
                </div>

                {dept.email && (
                    <div className="flex items-start">
                        <span className="font-bold text-[#910000] w-20 flex-shrink-0">Email:</span>
                        <a href={`mailto:${dept.email}`} className="text-gray-700 break-all underline hover:no-underline">
                            {dept.email}
                        </a>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Departments;