/**
 * Base URL бэкенда. В разработке — с Vite можно использовать переменные окружения.
 */
const API_BASE =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL
    ? import.meta.env.VITE_API_URL
    : "http://localhost:8000";

export { API_BASE };
