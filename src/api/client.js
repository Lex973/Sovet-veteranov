import { API_BASE } from "./config.js";

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    let detail = text;
    try {
      const j = JSON.parse(text);
      detail = j.detail ?? text;
    } catch (_) {}
    throw new Error(detail);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  news: {
    list: (params) => {
      const sp = new URLSearchParams(params);
      const q = sp.toString() ? `?${sp.toString()}` : "";
      return request(`/news${q}`);
    },
    get: (id) => request(`/news/${id}`),
    create: (body) => request("/news", { method: "POST", body: JSON.stringify(body) }),
    update: (id, body) => request(`/news/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
    delete: (id) => request(`/news/${id}`, { method: "DELETE" }),
  },
  team: {
    list: () => request("/team"),
    get: (id) => request(`/team/${id}`),
  },
  districtOffices: {
    list: () => request("/district-offices"),
    get: (id) => request(`/district-offices/${id}`),
  },
};
