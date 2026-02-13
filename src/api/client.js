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
      let d = j.detail ?? text;
      if (Array.isArray(d)) {
        detail = d.map((x) => (x?.msg ?? x?.loc?.join?.(".") ?? JSON.stringify(x))).join("; ");
      } else if (typeof d === "string") {
        detail = d;
      } else {
        detail = typeof d === "object" ? JSON.stringify(d) : String(d);
      }
    } catch (_) {}
    throw new Error(detail);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  auth: {
    login: (password) =>
      request("/admin/login", { method: "POST", body: JSON.stringify({ password }) }),
  },
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
  feedback: {
    list: (params) => {
      const sp = new URLSearchParams(params);
      const q = sp.toString() ? `?${sp.toString()}` : "";
      return request(`/feedback${q}`);
    },
    publishedList: () => request("/feedback/published"),
    get: (id) => request(`/feedback/${id}`),
    create: (body) => request("/feedback", { method: "POST", body: JSON.stringify(body) }),
    update: (id, body) => request(`/feedback/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  },
  partners: {
    list: () => request("/partners"),
    get: (id) => request(`/partners/${id}`),
    create: (body) => request("/partners", { method: "POST", body: JSON.stringify(body) }),
    update: (id, body) => request(`/partners/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
    delete: (id) => request(`/partners/${id}`, { method: "DELETE" }),
  },
  botSubscribers: {
    list: () => request("/bot-subscribers"),
    create: (body) => request("/bot-subscribers", { method: "POST", body: JSON.stringify(body) }),
    update: (id, body) => request(`/bot-subscribers/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
    delete: (id) => request(`/bot-subscribers/${id}`, { method: "DELETE" }),
  },
  team: {
    list: () => request("/team"),
    get: (id) => request(`/team/${id}`),
    create: (body) => request("/team", { method: "POST", body: JSON.stringify(body) }),
    update: (id, body) => request(`/team/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
    delete: (id) => request(`/team/${id}`, { method: "DELETE" }),
  },
  districtOffices: {
    list: () => request("/district-offices"),
    get: (id) => request(`/district-offices/${id}`),
  },
  upload: {
    image: async (file) => {
      const url = `${API_BASE}/files/images`;
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(url, {
        method: "POST",
        body: form,
        // не ставим Content-Type — браузер сам выставит multipart/form-data с boundary
      });
      if (!res.ok) {
        const text = await res.text();
        let detail = text;
        try {
          const j = JSON.parse(text);
          detail = j.detail ?? text;
        } catch (_) {}
        if (res.status === 413) {
          detail = "413: файл слишком большой. Уменьшите фото или используйте другое изображение.";
        }
        throw new Error(detail);
      }
      return res.json();
    },
  },
};
