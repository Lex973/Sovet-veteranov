import React, { useState } from "react";
import { API_BASE } from "../../../api/config.js";

const imageSrc = (url) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
};

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
    <div className="mb-14 flex flex-col gap-4 w-full">
      <h2 className="text-[#0b3b2e] text-xl md:text-2xl font-semibold mb-1">{props.title}</h2>

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
            className="w-full object-cover rounded-xl max-h-[420px]"
            onError={() => setError("main")}
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
          <strong className="ml-[5px] text-[#0b3b2e] font-medium text-md md:text-xl lg:text-xl xl:text-xl">
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
