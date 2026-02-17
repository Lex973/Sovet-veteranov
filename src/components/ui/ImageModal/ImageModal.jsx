import React, { useEffect } from 'react';

const ImageModal = ({ images, currentIndex, isOpen, onClose, onNext, onPrev }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onPrev();
      } else if (e.key === 'ArrowRight') {
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || !images || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      {/* Фон */}
      <div className="absolute inset-0 bg-black/90 transition-opacity duration-300"></div>

      {/* Модальное окно */}
      <div
        className="relative z-50 max-w-7xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 text-4xl font-bold transition-colors cursor-pointer bg-black/50 rounded-full w-12 h-12 flex items-center justify-center"
          aria-label="Закрыть"
        >
          ✕
        </button>

        {/* Изображение */}
        <div className="flex-1 flex items-center justify-center bg-black/50 rounded-t-lg overflow-hidden">
          <img
            src={currentImage}
            alt={`Фото ${currentIndex + 1} из ${images.length}`}
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>

        {/* Навигация */}
        {images.length > 1 && (
          <>
            {/* Кнопка предыдущего */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:text-gray-300 text-4xl font-bold transition-colors cursor-pointer bg-black/50 rounded-full w-12 h-12 flex items-center justify-center"
              aria-label="Предыдущее фото"
            >
              ‹
            </button>

            {/* Кнопка следующего */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:text-gray-300 text-4xl font-bold transition-colors cursor-pointer bg-black/50 rounded-full w-12 h-12 flex items-center justify-center"
              aria-label="Следующее фото"
            >
              ›
            </button>

            {/* Счетчик */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageModal;
