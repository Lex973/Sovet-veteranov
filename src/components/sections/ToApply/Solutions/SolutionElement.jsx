import React from "react";
import { API_BASE } from "../../../../api/config.js";

const imageSrc = (url) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
};

const SolutionElement = ({ item }) => {
  const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" }) : "";

  return (
    <article className="mb-10 flex flex-col gap-4 pb-10 border-b border-gray-200 last:border-0">
      <p>
        <strong className="text-[#0b3b2e] text-lg md:text-xl">Вопрос:</strong>
        <span className="ml-1 text-gray-800">{item.question}</span>
      </p>
      {item.solution_text && (
        <div>
          <strong className="text-[#0b3b2e] text-lg md:text-xl block mb-1">Решение:</strong>
          <p className="text-gray-700 whitespace-pre-wrap">{item.solution_text}</p>
        </div>
      )}
      {item.solution_image && (
        <div className="rounded-lg overflow-hidden max-w-md">
          <img
            src={imageSrc(item.solution_image)}
            alt="К решению"
            className="w-full h-auto object-cover"
          />
        </div>
      )}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>{item.full_name}</span>
        {dateStr && <span>{dateStr}</span>}
      </div>
    </article>
  );
};

export default SolutionElement;
