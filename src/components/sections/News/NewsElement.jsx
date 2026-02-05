import React, { useState } from "react";

const NewsElement = ({ props }) => {
  const [imageErrors, setImageErrors] = useState({});
  const allImages = (props.images && props.images.length) ? props.images : (props.image ? [props.image] : []);
  const mainImage = props.image || allImages[0] || "";
  const otherImages = allImages.length > 1 ? allImages.slice(1) : [];
  const galleryUrls = otherImages.slice(0, 9);

  const setError = (key) => {
    setImageErrors((prev) => ({ ...prev, [key]: true }));
  };

  return (
    <div className="mb-10 flex flex-col gap-[15px]">
      <p>
        <strong className="text-[#910000] text-xl md:text-2xl lg:text-3xl xl:text-3xl 2xl:text-3xl">Заголовок:</strong>
        <span className="ml-1 text-xl md:text-2xl lg:text-3xl xl:text-3xl 2xl:text-3xl">{props.title}</span>
      </p>

      {/* Главное фото или первое из галереи */}
      {mainImage && (
        imageErrors.main ? (
          <div className="h-100 w-full bg-[#D9D9D9] text-black flex items-center justify-center rounded-lg min-h-[200px]">
            Изображение не загружено
          </div>
        ) : (
          <img
            src={mainImage}
            alt={props.title}
            className="h-100 w-full object-cover rounded-lg max-h-[400px]"
            onError={() => setError("main")}
          />
        )
      )}

      {/* До 10 фото: остальные в ряд (всего с главным — до 10) */}
      {galleryUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {galleryUrls.map((url, i) =>
            imageErrors[`gallery-${i}`] ? (
              <div key={i} className="aspect-video bg-[#D9D9D9] rounded-lg flex items-center justify-center text-sm text-gray-500">
                Нет фото
              </div>
            ) : (
              <img
                key={i}
                src={url}
                alt={`${props.title} — фото ${i + 1}`}
                className="w-full aspect-video object-cover rounded-lg"
                onError={() => setError(`gallery-${i}`)}
              />
            )
          )}
        </div>
      )}

      {props.subtitle && (
        <p className="text-xl md:text-xl lg:text-2xl xl:text-2xl 2xl:text-2xl">{props.subtitle}</p>
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
          <span className="text-md md:text-xl lg:text-xl xl:text-xl">{props.date}</span>
          <strong className="ml-[5px] text-[#910000] font-medium text-md md:text-xl lg:text-xl xl:text-xl">
            {props.hashtag}
          </strong>
        </div>
        <div className="flex items-center justify-center flex-1">
          <div className="line w-full h-1 bg-[#1C1C1C]"></div>
        </div>
      </div>
    </div>
  );
};

export default NewsElement;
