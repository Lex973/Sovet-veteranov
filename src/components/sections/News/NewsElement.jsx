import React, { useState } from "react";
import { API_BASE } from "../../../api/config.js";
import ImageModal from "../../ui/ImageModal/ImageModal.jsx";

const imageSrc = (url) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
};

const NewsElement = ({ props }) => {
  const [imageErrors, setImageErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const allImages = (props.images && props.images.length) ? props.images : (props.image ? [props.image] : []);
  const mainImage = props.image || allImages[0] || "";
  const otherImages = allImages.length > 1 ? allImages.slice(1) : [];
  const galleryUrls = otherImages.slice(0, 9);
  
  // Все изображения для модального окна
  const allImageUrls = allImages.map(img => imageSrc(img)).filter(Boolean);
  
  const openModal = (index) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
  };
  
  const closeModal = () => {
    setModalOpen(false);
  };
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImageUrls.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImageUrls.length) % allImageUrls.length);
  };

  const setError = (key) => {
    setImageErrors((prev) => ({ ...prev, [key]: true }));
  };

  return (
    <div className="mb-14 flex flex-col gap-4 w-full">
      <h2 className="text-[#0b3b2e] text-2xl md:text-3xl font-semibold mb-1">{props.title}</h2>

      {/* Главное фото */}
      {mainImage && (
        imageErrors.main ? (
          <div className="w-full aspect-video max-h-[420px] bg-[#D9D9D9] text-black flex items-center justify-center rounded-xl min-h-[200px]">
            Изображение не загружено
          </div>
        ) : (
          <img
            src={imageSrc(mainImage)}
            alt={props.title}
            className="w-full object-cover rounded-xl max-h-[420px] cursor-pointer hover:opacity-90 transition-opacity"
            onError={() => setError("main")}
            onClick={() => openModal(0)}
          />
        )
      )}

      {/* Галерея: остальные фото */}
      {galleryUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {galleryUrls.map((url, i) =>
            imageErrors[`gallery-${i}`] ? (
              <div key={i} className="aspect-video bg-[#D9D9D9] rounded-lg flex items-center justify-center text-sm text-gray-500">
                Нет фото
              </div>
            ) : (
              <img
                key={i}
                src={imageSrc(url)}
                alt={`${props.title} — фото ${i + 2}`}
                className="w-full aspect-video object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onError={() => setError(`gallery-${i}`)}
                onClick={() => openModal(i + 1)}
              />
            )
          )}
        </div>
      )}

      {props.subtitle && (
        <p className="text-xl md:text-2xl lg:text-2xl text-gray-700 leading-relaxed">{props.subtitle}</p>
      )}

      {/* Основной текст с форматированием (HTML) */}
      {props.content && (
        <div
          className="prose prose-lg max-w-none text-gray-700 news-content"
          dangerouslySetInnerHTML={{ __html: props.content }}
        />
      )}

      <div className="flex items-center gap-5">
        <div>
          <span className="text-lg md:text-xl">{props.date}</span>
          <strong className="ml-[5px] text-[#0b3b2e] font-medium text-lg md:text-xl">
            {props.hashtag}
          </strong>
        </div>
        <div className="flex items-center justify-center flex-1">
          <div className="line w-full h-1 bg-[#1C1C1C]"></div>
        </div>
      </div>
      
      {/* Модальное окно для просмотра фотографий */}
      {allImageUrls.length > 0 && (
        <ImageModal
          images={allImageUrls}
          currentIndex={currentImageIndex}
          isOpen={modalOpen}
          onClose={closeModal}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </div>
  );
};

export default NewsElement;
