import React, { useState, useEffect } from "react";
import SolutionElement from "./SolutionElement.jsx";
import { api } from "../../../../api/client.js";

const Solutions = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.feedback
      .publishedList()
      .then((data) => {
        if (!cancelled) setList(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || "Не удалось загрузить решения");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="container mx-auto mt-10 text-center text-gray-600">Загрузка...</div>;
  if (error) return <div className="container mx-auto mt-10 text-center text-red-600">{error}</div>;
  if (list.length === 0) return <div className="container mx-auto mt-10 text-center text-gray-600">Пока нет опубликованных решений вопросов.</div>;

  return (
    <div className="container mx-auto mt-10 max-w-4xl px-4">
      {list.map((item) => (
        <SolutionElement key={item.id} item={item} />
      ))}
    </div>
  );
};

export default Solutions;