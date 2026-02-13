import React from 'react';

const ModalWindowInfo = ({ selectedMember, onClose, isOpen }) => {
    if (!selectedMember) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            {/* Фон */}
            <div
                className="absolute inset-0 bg-black/60 transition-opacity duration-300"
                onClick={onClose}
            ></div>

            {/* Модальное окно */}
            <div className={`relative z-50 bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden transition-all duration-300 ${isOpen ? 'scale-100 pointer-events-auto' : 'scale-0 opacity-0 pointer-events-none'}`}>
                <div className="bg-gradient-to-r from-[#0b3b2e] to-[#145c3b] p-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl md:text-3xl font-bold text-white">
                            {selectedMember.name}
                        </h1>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 text-2xl transition-colors cursor-pointer"
                            aria-label="Закрыть"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="p-6 h-100 w-full">
                    <div className="w-full h-full bg-gray-200"></div>
                </div>

                <div className="px-6 pb-6 md:px-8 md:pb-6 max-h-[70vh] overflow-y-auto">
                    <div className="relative">
                        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#0b3b2e] to-transparent rounded-full"></div>

                        <p className="text-gray-700 text-lg leading-relaxed pl-4">
                            {selectedMember.description}
                        </p>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 md:p-6 border-t border-gray-100">
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-[#0b3b2e] text-white cursor-pointer rounded-lg hover:bg-[#145c3b] transition-colors duration-200 font-medium shadow hover:shadow-md"
                        >
                            Вернуться к списку
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalWindowInfo;