import React, { useState, useEffect, useCallback } from "react";
import Input from "../../components/ui/Input/Input.jsx";
import Button from "../../components/ui/Button/Button.jsx";
import Line from "../../components/ui/Line.jsx";
import RichTextEditor from "./RichTextEditor.jsx";
import { api } from "../../api/client.js";
import "./admin-panel.css";

const HASHTAG_OPTIONS = [
  "#Спорт",
  "#Отдых",
  "#Здоровье",
  "#ЖКХ",
  "#Культура",
  "#Образование",
  "#Разное",
];

const MAX_IMAGES = 10;

const emptyNewsForm = () => ({
  title: "",
  subtitle: "",
  image: "",
  images: [],
  content: "",
  date: new Date().toISOString().slice(0, 10),
  hashtag: "",
});

const AdminPanel = () => {
  const [newsList, setNewsList] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyNewsForm());
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [newYearDecor, setNewYearDecor] = useState(false);
  const [newYearEffects, setNewYearEffects] = useState(false);
  const [victoryDayDecor, setVictoryDayDecor] = useState(false);
  const [victoryDayEffects, setVictoryDayEffects] = useState(false);

  const loadNews = useCallback(() => {
    setNewsLoading(true);
    api.news
      .list()
      .then((data) => setNewsList(Array.isArray(data) ? data : []))
      .catch(() => setNewsList([]))
      .finally(() => setNewsLoading(false));
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    const images = [
      form.image,
      ...(form.images || []).filter(Boolean),
    ].slice(0, MAX_IMAGES);
    const mainImage = images[0] || "";
    const payload = {
      title: form.title,
      subtitle: form.subtitle,
      image: mainImage,
      images,
      content: form.content || "",
      date: form.date,
      hashtag: form.hashtag ? (form.hashtag.startsWith("#") ? form.hashtag : `#${form.hashtag}`) : "",
    };
    try {
      if (editingId) {
        await api.news.update(editingId, payload);
        setEditingId(null);
      } else {
        await api.news.create(payload);
      }
      setForm(emptyNewsForm());
      loadNews();
    } catch (err) {
      setFormError(err.message || "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    const images = item.images && Array.isArray(item.images) ? item.images : [];
    const mainImage = item.image || images[0] || "";
    const restImages = mainImage ? images.filter((u) => u !== mainImage) : images;
    setForm({
      title: item.title || "",
      subtitle: item.subtitle || "",
      image: mainImage,
      images: restImages,
      content: item.content || "",
      date: (item.date || "").slice(0, 10),
      hashtag: item.hashtag || "",
    });
    setFormError("");
  };

  const handleDelete = async (id) => {
    if (!confirm("Удалить эту новость?")) return;
    setSaving(true);
    try {
      await api.news.delete(id);
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyNewsForm());
      }
      loadNews();
    } catch (err) {
      setFormError(err.message || "Ошибка удаления");
    } finally {
      setSaving(false);
    }
  };

  const setFormField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const setImageUrl = (index, url) => {
    setForm((prev) => {
      const images = [...(prev.images || [])];
      while (images.length <= index) images.push("");
      images[index] = url;
      return { ...prev, images: images.slice(0, MAX_IMAGES) };
    });
  };

  const addImageSlot = () => {
    const current = (form.images || []).length;
    if (current >= MAX_IMAGES) return;
    setForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), ""],
    }));
  };

  const allImageUrls = [
    form.image,
    ...(form.images || []).filter(Boolean),
  ].filter(Boolean);
  const imageSlots = Math.min(MAX_IMAGES, Math.max(allImageUrls.length + 1, 1));

  return (
    <div>
      <h1 className="text-5xl font-bold text-center mt-10 mb-10">Админ-панель</h1>

      {/* Редактирование новостей */}
      <section className="mt-10 w-full max-w-3xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-6">
          {editingId ? "Редактирование новости" : "Создание новости"}
        </h2>

        <form onSubmit={handleCreatePost} className="flex flex-col gap-6">
          <div>
            <label className="font-bold text-lg mb-2 text-gray-700 block">Заголовок *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setFormField("title", e.target.value)}
              placeholder="Заголовок новости"
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600"
            />
          </div>

          <div>
            <label className="font-bold text-lg mb-2 text-gray-700 block">Подзаголовок</label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => setFormField("subtitle", e.target.value)}
              placeholder="Краткое описание"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600"
            />
          </div>

          <div>
            <label className="font-bold text-lg mb-2 text-gray-700 block">Фотографии (до 10, URL)</label>
            {Array.from({ length: imageSlots }, (_, i) => (
              <input
                key={i}
                type="text"
                value={i === 0 ? form.image : (form.images || [])[i - 1] || ""}
                onChange={(e) =>
                  i === 0 ? setFormField("image", e.target.value) : setImageUrl(i - 1, e.target.value)
                }
                placeholder={`Фото ${i + 1} (URL)`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:border-gray-600 text-sm"
              />
            ))}
            {imageSlots < MAX_IMAGES && (
              <button
                type="button"
                onClick={addImageSlot}
                className="text-[#910000] hover:underline text-sm mt-1"
              >
                + Добавить ещё фото
              </button>
            )}
          </div>

          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[140px]">
              <label className="font-bold text-lg mb-2 text-gray-700 block">Дата *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setFormField("date", e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600"
              />
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="font-bold text-lg mb-2 text-gray-700 block">Хэштег</label>
              <select
                value={form.hashtag}
                onChange={(e) => setFormField("hashtag", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 bg-white"
              >
                <option value="">Выберите хэштег</option>
                {HASHTAG_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-lg mb-2 text-gray-700 block">Основной текст (с форматированием)</label>
            <RichTextEditor
              value={form.content}
              onChange={(html) => setFormField("content", html)}
              placeholder="Введите текст новости..."
            />
          </div>

          {formError && (
            <p className="text-red-600 text-sm">{formError}</p>
          )}

          <div className="flex gap-3">
            <Button type="submit" width="w-full" height="h-12" disabled={saving}>
              {saving ? "Сохранение..." : editingId ? "Сохранить изменения" : "Создать пост"}
            </Button>
            {editingId && (
              <Button
                type="button"
                width="w-auto"
                height="h-12"
                noMargin
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyNewsForm());
                  setFormError("");
                }}
              >
                Отмена
              </Button>
            )}
          </div>
        </form>
        <Line />
      </section>

      {/* Список новостей */}
      <section className="mt-10 w-full max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4">Все новости</h2>
        {newsLoading ? (
          <p className="text-gray-600">Загрузка...</p>
        ) : newsList.length === 0 ? (
          <p className="text-gray-600">Новостей пока нет.</p>
        ) : (
          <ul className="space-y-3">
            {newsList.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <span className="flex-1 truncate font-medium">{item.title}</span>
                <span className="text-gray-500 text-sm shrink-0">{item.date}</span>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                  >
                    Изменить
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm"
                  >
                    Удалить
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Line />
      </section>

      {/* Форма создания хештега — оставляем как заглушку при необходимости */}
      <form onSubmit={(e) => { e.preventDefault(); }} className="w-full max-w-3xl mx-auto px-4 flex flex-col gap-8 mt-10">
        <h2 className="text-4xl font-bold text-center">Форма для создания нового хештега (#)</h2>
        <Input inputText="Название хештега" placeholder="Напишите название хэштега" required={false} />
        <Button type="submit" width="w-full" height="h-15">Создать хештег</Button>
        <Line />
      </form>

      {/* Форма создания члена команды */}
      <form onSubmit={(e) => { e.preventDefault(); console.log("Создание члена команды"); }} className="w-full max-w-3xl mx-auto px-4 flex flex-col gap-8">
        <h2 className="text-4xl font-bold text-center">Форма для создания члена команды</h2>
        <Input inputText="ФИО" placeholder="Введите ФИО члена команды" />
        <Input inputText="Фотография" placeholder="Загрузите фотографию" photo={true} required={false} />
        <Input inputText="Основной текст" placeholder="Напишите основной текст" big={true} required={false} />
        <Button type="submit" width="w-full" height="h-15">Создать члена команды</Button>
        <Line />
      </form>

      {/* Управление событиями */}
      <div className="w-full max-w-3xl mx-auto px-4 flex flex-col gap-8 mt-10">
        <h2 className="text-4xl font-bold text-center mb-6">Управление событиями</h2>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-6 p-4 border-2 border-gray-300 rounded-lg">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-700">Новый Год (1 января)</span>
              <span className="text-sm text-gray-500">Снежинки, гирлянды</span>
            </div>
            <div className="flex gap-4 justify-center items-center">
              <Button type="button" width="w-auto" height="h-auto" noMargin={true} isActive={newYearDecor} onClick={() => setNewYearDecor(!newYearDecor)}>
                {newYearDecor ? "Убрать украшения" : "Украсить сайт"}
              </Button>
              <Button type="button" width="w-auto" height="h-auto" noMargin={true} isActive={newYearEffects} onClick={() => setNewYearEffects(!newYearEffects)}>
                {newYearEffects ? "Выключить эффекты" : "Добавить эффекты"}
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-6 p-4 border-2 border-gray-300 rounded-lg">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-700">День Победы (9 мая)</span>
              <span className="text-sm text-gray-500">Георгиевская лента, салют</span>
            </div>
            <div className="flex gap-4">
              <Button type="button" width="w-auto" height="h-auto" noMargin={true} isActive={victoryDayDecor} onClick={() => setVictoryDayDecor(!victoryDayDecor)}>
                {victoryDayDecor ? "Убрать ленту" : "Добавить ленту"}
              </Button>
              <Button type="button" width="w-auto" height="h-auto" noMargin={true} isActive={victoryDayEffects} onClick={() => setVictoryDayEffects(!victoryDayEffects)}>
                {victoryDayEffects ? "Выключить салют" : "Добавить салют"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
