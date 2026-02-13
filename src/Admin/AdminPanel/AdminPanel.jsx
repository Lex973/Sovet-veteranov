import React, { useState, useEffect, useCallback, useRef } from "react";
import Input from "../../components/ui/Input/Input.jsx";
import Button from "../../components/ui/Button/Button.jsx";
import Line from "../../components/ui/Line.jsx";
import RichTextEditor from "./RichTextEditor.jsx";
import { api } from "../../api/client.js";
import { API_BASE } from "../../api/config.js";
import { getHolidayTheme, setHolidayTheme, HOLIDAY_THEME_EVENT } from "../../utils/holidayTheme.js";
import "./admin-panel.css";

const imagePreviewUrl = (url) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
};

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

const AdminPanel = ({ onLogout }) => {
  const [newsList, setNewsList] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyNewsForm());
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // Подписчики Telegram-бота
  const [subscribers, setSubscribers] = useState([]);
  const [subsLoading, setSubsLoading] = useState(true);
  const [subsError, setSubsError] = useState("");

  const [holidayTheme, setHolidayThemeState] = useState(getHolidayTheme);
  const { newYearDecor, newYearEffects, victoryDayDecor, victoryDayEffects } = holidayTheme;

  const updateHoliday = (updates) => {
    const next = { ...holidayTheme, ...updates };
    setHolidayThemeState(setHolidayTheme(next));
  };
  const [newImageUrl, setNewImageUrl] = useState("");
  const [previewErrors, setPreviewErrors] = useState({});
  const fileInputRef = useRef(null);

  // Форма члена команды (создание / редактирование)
  const [teamList, setTeamList] = useState([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [teamMemberName, setTeamMemberName] = useState("");
  const [teamMemberDescription, setTeamMemberDescription] = useState("");
  const [teamMemberImage, setTeamMemberImage] = useState("");
  const [teamMemberError, setTeamMemberError] = useState("");
  const [teamMemberSaving, setTeamMemberSaving] = useState(false);
  const teamMemberFileInputRef = useRef(null);

  // Обращения (вопросы)
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");
  const [editingFeedbackId, setEditingFeedbackId] = useState(null);
  const [feedbackPublished, setFeedbackPublished] = useState(false);
  const [feedbackSolutionText, setFeedbackSolutionText] = useState("");
  const [feedbackSolutionImage, setFeedbackSolutionImage] = useState("");
  const feedbackSolutionFileRef = useRef(null);

  // Партнёры (подвал)
  const [partnersList, setPartnersList] = useState([]);
  const [partnersLoading, setPartnersLoading] = useState(false);
  const [partnersError, setPartnersError] = useState("");

  const loadNews = useCallback(() => {
    setNewsLoading(true);
    api.news
      .list()
      .then((data) => setNewsList(Array.isArray(data) ? data : []))
      .catch(() => setNewsList([]))
      .finally(() => setNewsLoading(false));
  }, []);

  const loadSubscribers = useCallback(() => {
    setSubsLoading(true);
    setSubsError("");
    api.botSubscribers
      .list()
      .then((data) => setSubscribers(Array.isArray(data) ? data : []))
      .catch((e) => {
        setSubscribers([]);
        setSubsError(e.message || "Не удалось загрузить подписчиков бота");
      })
      .finally(() => setSubsLoading(false));
  }, []);

  const loadTeam = useCallback(() => {
    setTeamLoading(true);
    api.team
      .list()
      .then((data) => setTeamList(Array.isArray(data) ? data : []))
      .catch(() => setTeamList([]))
      .finally(() => setTeamLoading(false));
  }, []);

  const loadFeedback = useCallback(() => {
    setFeedbackLoading(true);
    api.feedback
      .list()
      .then((data) => setFeedbackList(Array.isArray(data) ? data : []))
      .catch(() => setFeedbackList([]))
      .finally(() => setFeedbackLoading(false));
  }, []);

  const loadPartners = useCallback(() => {
    setPartnersLoading(true);
    api.partners
      .list()
      .then((data) => setPartnersList(Array.isArray(data) ? data : []))
      .catch((e) => {
        setPartnersList([]);
        setPartnersError(e.message || "Не удалось загрузить партнёров");
      })
      .finally(() => setPartnersLoading(false));
  }, []);

  useEffect(() => {
    loadNews();
    loadSubscribers();
    loadTeam();
    loadFeedback();
    loadPartners();
  }, [loadNews, loadSubscribers, loadTeam, loadFeedback, loadPartners]);

  useEffect(() => {
    const onThemeChange = () => setHolidayThemeState(getHolidayTheme());
    window.addEventListener(HOLIDAY_THEME_EVENT, onThemeChange);
    return () => window.removeEventListener(HOLIDAY_THEME_EVENT, onThemeChange);
  }, []);

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

  const setFormFromImageArray = (arr) => {
    const main = arr[0] || "";
    const rest = arr.slice(1);
    setForm((prev) => ({ ...prev, image: main, images: rest }));
  };

  const moveImageUp = (index) => {
    if (index <= 0 || index >= allImageUrls.length) return;
    const next = [...allImageUrls];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    setFormFromImageArray(next);
  };

  const moveImageDown = (index) => {
    if (index < 0 || index >= allImageUrls.length - 1) return;
    const next = [...allImageUrls];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    setFormFromImageArray(next);
  };

  const removeImage = (index) => {
    const next = allImageUrls.filter((_, i) => i !== index);
    setFormFromImageArray(next);
  };

  const setImageByIndex = (index, url) => {
    const arr = [...allImageUrls];
    while (arr.length <= index) arr.push("");
    arr[index] = url;
    setFormFromImageArray(arr.filter(Boolean));
  };

  const imageSlots = Math.min(MAX_IMAGES, Math.max(allImageUrls.length + 1, 1));

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const processImageFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setFormError("");
    setSaving(true);
    try {
      const result = await api.upload.image(file);
      const url = result?.url;
      if (!url) throw new Error("Сервер не вернул ссылку на изображение");

      setForm((prev) => {
        const next = { ...prev };
        if (!next.image) {
          next.image = url;
          return next;
        }
        const imgs = [...(next.images || [])];
        const firstEmptyIndex = imgs.findIndex((v) => !v);
        if (firstEmptyIndex === -1) {
          if (imgs.length < MAX_IMAGES - 1) {
            imgs.push(url);
          }
        } else {
          imgs[firstEmptyIndex] = url;
        }
        next.images = imgs;
        return next;
      });
    } catch (err) {
      const msg = err.message || "";
      if (msg.includes("413") || msg.toLowerCase().includes("too large") || msg.toLowerCase().includes("entity too large")) {
        setFormError("Файл слишком большой. Уменьшите фото или выберите другое (рекомендуется до 10 МБ). После обновления сервера лимит увеличен.");
      } else {
        setFormError(msg || "Не удалось загрузить изображение");
      }
    } finally {
      setSaving(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) await processImageFile(file);
  };

  const [dragOver, setDragOver] = useState(false);
  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) await processImageFile(file);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleToggleSubscriber = async (sub) => {
    try {
      setSubsError("");
      await api.botSubscribers.update(sub.id, { is_active: !sub.is_active });
      loadSubscribers();
    } catch (e) {
      setSubsError(e.message || "Не удалось обновить подписчика");
    }
  };

  const handleDeleteSubscriber = async (sub) => {
    if (!confirm("Удалить этого подписчика бота?")) return;
    try {
      setSubsError("");
      await api.botSubscribers.delete(sub.id);
      loadSubscribers();
    } catch (e) {
      setSubsError(e.message || "Не удалось удалить подписчика");
    }
  };

  const handleEditTeam = (member) => {
    setEditingTeamId(member.id);
    setTeamMemberName(member.name || "");
    setTeamMemberDescription(member.description || "");
    setTeamMemberImage(member.image || "");
    setTeamMemberError("");
  };

  const handleCancelEditTeam = () => {
    setEditingTeamId(null);
    setTeamMemberName("");
    setTeamMemberDescription("");
    setTeamMemberImage("");
    setTeamMemberError("");
  };

  const handleCreateTeamMember = async (e) => {
    e.preventDefault();
    const name = teamMemberName.trim();
    if (!name) {
      setTeamMemberError("Введите ФИО");
      return;
    }
    setTeamMemberError("");
    setTeamMemberSaving(true);
    try {
      if (editingTeamId) {
        await api.team.update(editingTeamId, {
          name,
          description: teamMemberDescription.trim(),
          image: teamMemberImage.trim(),
        });
        handleCancelEditTeam();
      } else {
        await api.team.create({
          name,
          description: teamMemberDescription.trim(),
          image: teamMemberImage.trim(),
        });
        setTeamMemberName("");
        setTeamMemberDescription("");
        setTeamMemberImage("");
      }
      loadTeam();
    } catch (err) {
      setTeamMemberError(err.message || "Ошибка сохранения");
    } finally {
      setTeamMemberSaving(false);
    }
  };

  const handleDeleteTeamMember = async (member) => {
    if (!confirm(`Удалить из команды: ${member.name}?`)) return;
    setTeamMemberSaving(true);
    try {
      await api.team.delete(member.id);
      if (editingTeamId === member.id) handleCancelEditTeam();
      loadTeam();
    } catch (err) {
      setTeamMemberError(err.message || "Ошибка удаления");
    } finally {
      setTeamMemberSaving(false);
    }
  };

  const handleMoveTeamUp = async (member) => {
    const idx = teamList.findIndex((m) => m.id === member.id);
    if (idx <= 0) return;
    const prev = teamList[idx - 1];
    const curPos = member.position ?? idx;
    const prevPos = prev.position ?? idx - 1;
    setTeamMemberSaving(true);
    try {
      await api.team.update(member.id, { position: prevPos });
      await api.team.update(prev.id, { position: curPos });
      loadTeam();
    } catch (err) {
      setTeamMemberError(err.message || "Ошибка смены порядка");
    } finally {
      setTeamMemberSaving(false);
    }
  };

  const handleMoveTeamDown = async (member) => {
    const idx = teamList.findIndex((m) => m.id === member.id);
    if (idx < 0 || idx >= teamList.length - 1) return;
    const next = teamList[idx + 1];
    const curPos = member.position ?? idx;
    const nextPos = next.position ?? idx + 1;
    setTeamMemberSaving(true);
    try {
      await api.team.update(member.id, { position: nextPos });
      await api.team.update(next.id, { position: curPos });
      loadTeam();
    } catch (err) {
      setTeamMemberError(err.message || "Ошибка смены порядка");
    } finally {
      setTeamMemberSaving(false);
    }
  };

  // Обращения: редактирование решения и публикация
  const openFeedbackEdit = (item) => {
    setEditingFeedbackId(item.id);
    setFeedbackPublished(!!item.published);
    setFeedbackSolutionText(item.solution_text || "");
    setFeedbackSolutionImage(item.solution_image || "");
    setFeedbackError("");
  };

  const cancelFeedbackEdit = () => {
    setEditingFeedbackId(null);
    setFeedbackSolutionText("");
    setFeedbackSolutionImage("");
  };

  const saveFeedbackSolution = async () => {
    if (!editingFeedbackId) return;
    setFeedbackError("");
    try {
      await api.feedback.update(editingFeedbackId, {
        published: feedbackPublished,
        solution_text: feedbackSolutionText,
        solution_image: feedbackSolutionImage,
      });
      cancelFeedbackEdit();
      loadFeedback();
    } catch (err) {
      setFeedbackError(err.message || "Ошибка сохранения");
    }
  };

  const handleFeedbackSolutionImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await api.upload.image(file);
      if (result?.url) setFeedbackSolutionImage(result.url);
    } catch (err) {
      setFeedbackError(err.message || "Не удалось загрузить фото");
    }
    if (feedbackSolutionFileRef.current) feedbackSolutionFileRef.current.value = "";
  };

  // Партнёры
  const handleAddPartner = async () => {
    setPartnersError("");
    try {
      await api.partners.create({ image: "", link: "", position: partnersList.length });
      loadPartners();
    } catch (err) {
      setPartnersError(err.message || "Ошибка добавления");
    }
  };

  const handleUpdatePartner = async (partner, field, value) => {
    setPartnersError("");
    try {
      await api.partners.update(partner.id, { [field]: value });
      loadPartners();
    } catch (err) {
      setPartnersError(err.message || "Ошибка сохранения");
    }
  };

  const handlePartnerImageUpload = async (partner, file) => {
    if (!file) return;
    try {
      const result = await api.upload.image(file);
      if (result?.url) await api.partners.update(partner.id, { image: result.url });
      loadPartners();
    } catch (err) {
      setPartnersError(err.message || "Не удалось загрузить изображение");
    }
  };

  const handleDeletePartner = async (partner) => {
    if (!confirm("Удалить этого партнёра из подвала?")) return;
    try {
      await api.partners.delete(partner.id);
      loadPartners();
    } catch (err) {
      setPartnersError(err.message || "Ошибка удаления");
    }
  };

  const handleMovePartnerUp = async (p, idx) => {
    if (idx <= 0) return;
    const prev = partnersList[idx - 1];
    try {
      await api.partners.update(p.id, { position: prev.position ?? idx - 1 });
      await api.partners.update(prev.id, { position: p.position ?? idx });
      loadPartners();
    } catch (err) {
      setPartnersError(err.message || "Ошибка смены порядка");
    }
  };

  const handleMovePartnerDown = async (p, idx) => {
    if (idx >= partnersList.length - 1) return;
    const next = partnersList[idx + 1];
    try {
      await api.partners.update(p.id, { position: next.position ?? idx + 1 });
      await api.partners.update(next.id, { position: p.position ?? idx });
      loadPartners();
    } catch (err) {
      setPartnersError(err.message || "Ошибка смены порядка");
    }
  };

  const handleTeamMemberPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setTeamMemberError("");
    setTeamMemberSaving(true);
    try {
      const result = await api.upload.image(file);
      if (result?.url) setTeamMemberImage(result.url);
    } catch (err) {
      setTeamMemberError(err.message || "Не удалось загрузить фото");
    } finally {
      setTeamMemberSaving(false);
      if (teamMemberFileInputRef.current) teamMemberFileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-4 mt-10 mb-10">
        <h1 className="text-5xl font-bold text-center">Админ-панель</h1>
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="px-4 py-2 rounded-lg border-2 border-gray-400 text-gray-700 hover:bg-gray-100 text-sm font-medium"
          >
            Выйти
          </button>
        )}
      </div>

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
            <label className="font-bold text-lg mb-2 text-gray-700 block">Фотографии (до 10)</label>
            <p className="text-xs text-gray-500 mb-2">
              Для корректного отображения: JPG или PNG, рекомендуется не менее 800×600 px. Первое фото — главное. Порядок можно менять кнопками ↑ ↓.
            </p>
            <div
              className={`flex flex-wrap gap-3 mb-3 p-4 rounded-lg border-2 border-dashed transition-colors ${dragOver ? "border-[#0b3b2e] bg-[#e8f5e9]" : "border-gray-300 bg-gray-50"}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <button
                type="button"
                onClick={handleUploadClick}
                disabled={saving}
                className="px-3 py-2 rounded-lg border border-[#0b3b2e] bg-[#0b3b2e] text-white hover:bg-[#145c3b] text-sm disabled:opacity-50"
              >
                Загрузить фото с компьютера
              </button>
              <span className="text-sm text-gray-500 self-center">или перетащите фото сюда</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />

            {/* Превью и порядок */}
            <div className="space-y-3 mb-3">
              {allImageUrls.map((url, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                    {previewErrors[i] ? (
                      <span className="text-xs text-gray-500">Нет</span>
                    ) : (
                      <img
                        src={imagePreviewUrl(url)}
                        alt={`Превью ${i + 1}`}
                        className="w-full h-full object-cover"
                        onError={() => setPreviewErrors((p) => ({ ...p, [i]: true }))}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {i === 0 ? "Главное фото" : `Фото ${i + 1}`}
                    </p>
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setImageByIndex(i, e.target.value)}
                      placeholder="URL изображения"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#0b3b2e]"
                    />
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => moveImageUp(i)}
                      disabled={i === 0}
                      className="p-1.5 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                      title="Поднять выше"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImageDown(i)}
                      disabled={i === allImageUrls.length - 1}
                      className="p-1.5 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                      title="Опустить ниже"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="p-1.5 rounded border border-red-200 bg-white hover:bg-red-50 text-red-600 text-sm"
                      title="Удалить"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {allImageUrls.length < MAX_IMAGES && (
              <div className="mb-2 flex gap-2">
                <input
                  type="text"
                  value={allImageUrls.length === 0 ? form.image : newImageUrl}
                  onChange={(e) => {
                    if (allImageUrls.length === 0) setFormField("image", e.target.value);
                    else setNewImageUrl(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && allImageUrls.length > 0 && newImageUrl.trim()) {
                      e.preventDefault();
                      setFormFromImageArray([...allImageUrls, newImageUrl.trim()]);
                      setNewImageUrl("");
                    }
                  }}
                  placeholder="Или вставьте URL и нажмите Enter"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-600"
                />
                {allImageUrls.length > 0 && newImageUrl.trim() && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormFromImageArray([...allImageUrls, newImageUrl.trim()]);
                      setNewImageUrl("");
                    }}
                    className="px-3 py-2 rounded-lg bg-[#0b3b2e] text-white text-sm hover:bg-[#145c3b]"
                  >
                    Добавить
                  </button>
                )}
              </div>
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
                    className="min-h-[44px] min-w-[44px] px-4 py-2.5 bg-gray-200 hover:bg-gray-300 rounded text-sm touch-manipulation"
                  >
                    Изменить
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="min-h-[44px] min-w-[44px] px-4 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm touch-manipulation"
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

      {/* Подписчики Telegram-бота */}
      <section className="mt-10 w-full max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4 text-center">Подписчики Telegram-бота</h2>
        <p className="text-sm text-gray-600 mb-4 text-center">
          Чтобы получать уведомления о новых новостях и обращениях, пользователь должен
          отправить боту команду <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">/start</span>.
        </p>
        {subsError && (
          <p className="text-red-600 text-sm mb-2 text-center">{subsError}</p>
        )}
        {subsLoading ? (
          <p className="text-gray-600 text-center">Загрузка подписчиков...</p>
        ) : subscribers.length === 0 ? (
          <p className="text-gray-600 text-center">Пока нет ни одного подписчика бота.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Имя</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Chat ID</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Статус</th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-700">Действия</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="border-t border-gray-200">
                    <td className="px-3 py-2">
                      {sub.name || <span className="text-gray-400 italic">Без имени</span>}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs break-all">
                      {sub.chat_id}
                    </td>
                    <td className="px-3 py-2">
                      {sub.is_active ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                          уведомления включены
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                          уведомления выключены
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleToggleSubscriber(sub)}
                        className="px-2 py-1 rounded text-xs bg-gray-200 hover:bg-gray-300"
                      >
                        {sub.is_active ? "Выключить" : "Включить"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSubscriber(sub)}
                        className="px-2 py-1 rounded text-xs bg-red-100 hover:bg-red-200 text-red-700"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Line />
      </section>

      {/* Обращения (вопросы): публикация в «Решения вопросов» и решение */}
      <section className="mt-10 w-full max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-2 text-center">Обращения (вопросы)</h2>
        <p className="text-sm text-gray-600 mb-4 text-center">
          Новые обращения приходят в Telegram всем подписчикам бота (админам). Здесь можно выбрать, какие опубликовать в блоке «Решения вопросов», и добавить текст и фото решения.
        </p>
        {feedbackError && <p className="text-red-600 text-sm mb-2">{feedbackError}</p>}
        {feedbackLoading ? (
          <p className="text-gray-600">Загрузка...</p>
        ) : feedbackList.length === 0 ? (
          <p className="text-gray-600">Обращений пока нет.</p>
        ) : (
          <ul className="space-y-4">
            {feedbackList.map((item) => (
              <li key={item.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div>
                    <span className="font-medium">{item.full_name}</span>
                    <span className="text-gray-500 text-sm ml-2">{item.phone || item.email || ""}</span>
                  </div>
                  <span className="text-xs text-gray-500 shrink-0">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString("ru") : ""}
                  </span>
                </div>
                <p className="text-gray-700 text-sm mb-3 line-clamp-2">{item.question}</p>
                {editingFeedbackId === item.id ? (
                  <div className="space-y-3 pt-2 border-t border-gray-200">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={feedbackPublished}
                        onChange={(e) => setFeedbackPublished(e.target.checked)}
                      />
                      <span>Опубликовать в «Решения вопросов»</span>
                    </label>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Текст решения</label>
                      <textarea
                        value={feedbackSolutionText}
                        onChange={(e) => setFeedbackSolutionText(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        placeholder="Ответ на вопрос..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Фото к решению (опционально)</label>
                      <input
                        ref={feedbackSolutionFileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFeedbackSolutionImageUpload}
                      />
                      <button
                        type="button"
                        onClick={() => feedbackSolutionFileRef.current?.click()}
                        className="mr-2 px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        Загрузить
                      </button>
                      <input
                        type="text"
                        value={feedbackSolutionImage}
                        onChange={(e) => setFeedbackSolutionImage(e.target.value)}
                        placeholder="URL фото"
                        className="flex-1 min-w-0 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      {feedbackSolutionImage && (
                        <img
                          src={imagePreviewUrl(feedbackSolutionImage)}
                          alt=""
                          className="mt-1 h-16 object-cover rounded"
                          onError={(e) => e.target.style.display = "none"}
                        />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={saveFeedbackSolution}
                        className="px-3 py-1.5 bg-[#0b3b2e] text-white rounded text-sm"
                      >
                        Сохранить
                      </button>
                      <button type="button" onClick={cancelFeedbackEdit} className="px-3 py-1.5 border rounded text-sm">
                        Отмена
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-200">{item.status}</span>
                    {item.published && <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-800">Опубликовано</span>}
                    <button
                      type="button"
                      onClick={() => openFeedbackEdit(item)}
                      className="px-2 py-1 bg-[#0b3b2e] text-white rounded text-sm"
                    >
                      {item.published ? "Изменить решение" : "Добавить в решённые"}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
        <Line />
      </section>

      {/* Партнёры (подвал сайта) */}
      <section className="mt-10 w-full max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-2 text-center">Партнёры (подвал сайта)</h2>
        <p className="text-sm text-gray-600 mb-4 text-center">
          Логотипы и ссылки внизу страницы. Загрузите изображение и укажите ссылку при клике.
        </p>
        {partnersError && <p className="text-red-600 text-sm mb-2">{partnersError}</p>}
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            type="button"
            onClick={handleAddPartner}
            className="px-3 py-2 rounded-lg bg-[#0b3b2e] text-white text-sm hover:bg-[#145c3b]"
          >
            + Добавить партнёра
          </button>
        </div>
        {partnersLoading ? (
          <p className="text-gray-600">Загрузка...</p>
        ) : (
          <ul className="space-y-3">
            {partnersList.map((partner, idx) => (
              <li key={partner.id} className="flex flex-wrap items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="w-20 h-14 rounded overflow-hidden bg-gray-200 shrink-0 flex items-center justify-center">
                  {partner.image ? (
                    <img
                      src={imagePreviewUrl(partner.image)}
                      alt=""
                      className="w-full h-full object-contain"
                      onError={(e) => e.target.style.display = "none"}
                    />
                  ) : (
                    <span className="text-xs text-gray-400">Нет фото</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id={`partner-img-${partner.id}`}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handlePartnerImageUpload(partner, f);
                    e.target.value = "";
                  }}
                />
                <label htmlFor={`partner-img-${partner.id}`} className="px-2 py-1 border border-gray-300 rounded text-sm cursor-pointer shrink-0">
                  Загрузить логотип
                </label>
                <input
                  type="url"
                  defaultValue={partner.link || ""}
                  onBlur={(e) => {
                    const v = e.target.value.trim();
                    if (v !== (partner.link || "")) handleUpdatePartner(partner, "link", v);
                  }}
                  placeholder="Ссылка при клике"
                  className="flex-1 min-w-[200px] px-3 py-1.5 border border-gray-300 rounded text-sm"
                />
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMovePartnerUp(partner, idx)}
                    disabled={idx === 0}
                    className="p-1.5 rounded border bg-white disabled:opacity-50"
                    title="Выше"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMovePartnerDown(partner, idx)}
                    disabled={idx === partnersList.length - 1}
                    className="p-1.5 rounded border bg-white disabled:opacity-50"
                    title="Ниже"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePartner(partner)}
                    className="px-2 py-1 rounded text-sm bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    Удалить
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {partnersList.length === 0 && !partnersLoading && (
          <p className="text-gray-500 text-sm">Добавьте партнёров — они появятся в подвале сайта.</p>
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

      {/* Управление командой */}
      <section className="w-full max-w-3xl mx-auto px-4 mt-10">
        <h2 className="text-4xl font-bold text-center mb-6">Управление командой</h2>
        {teamLoading ? (
          <p className="text-gray-500 text-center">Загрузка...</p>
        ) : teamList.length === 0 ? (
          <p className="text-gray-500 text-center">Пока никого нет. Добавьте членов команды формой ниже.</p>
        ) : (
          <ul className="space-y-2 mb-6">
            {teamList.map((member, index) => (
              <li
                key={member.id}
                className="flex flex-wrap items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50"
              >
                <span className="font-medium flex-1 min-w-0 truncate">{member.name}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMoveTeamUp(member)}
                    disabled={index === 0 || teamMemberSaving}
                    className="p-1.5 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 text-sm"
                    title="Выше"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveTeamDown(member)}
                    disabled={index === teamList.length - 1 || teamMemberSaving}
                    className="p-1.5 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 text-sm"
                    title="Ниже"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEditTeam(member)}
                    className="px-2 py-1 rounded text-sm bg-[#0b3b2e] text-white hover:bg-[#145c3b]"
                  >
                    Изменить
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteTeamMember(member)}
                    className="px-2 py-1 rounded text-sm bg-red-100 hover:bg-red-200 text-red-700"
                  >
                    Удалить
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Форма создания / редактирования члена команды */}
      <form onSubmit={handleCreateTeamMember} className="w-full max-w-3xl mx-auto px-4 flex flex-col gap-8">
        <h2 className="text-4xl font-bold text-center">
          {editingTeamId ? "Редактирование члена команды" : "Добавить члена команды"}
        </h2>
        {teamMemberError && (
          <p className="text-red-600 text-sm">{teamMemberError}</p>
        )}
        <div>
          <label className="font-bold text-lg mb-2 text-gray-700 block">ФИО *</label>
          <input
            type="text"
            value={teamMemberName}
            onChange={(e) => setTeamMemberName(e.target.value)}
            placeholder="Введите ФИО члена команды"
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600"
          />
        </div>
        <div>
          <label className="font-bold text-lg mb-2 text-gray-700 block">Фотография</label>
          <p className="text-xs text-gray-500 mb-2">
            Для корректного отображения в карточке: вертикальное фото (портрет), JPG или PNG, рекомендуется соотношение 3∶4 или 2∶3.
          </p>
          <div className="flex flex-wrap items-start gap-3">
            <button
              type="button"
              onClick={() => teamMemberFileInputRef.current?.click()}
              disabled={teamMemberSaving}
              className="px-3 py-2 rounded-lg border border-[#0b3b2e] bg-[#0b3b2e] text-white hover:bg-[#145c3b] text-sm disabled:opacity-50"
            >
              Загрузить фото с компьютера
            </button>
            <input
              ref={teamMemberFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleTeamMemberPhotoUpload}
            />
            {teamMemberImage && (
              <div className="flex items-center gap-2">
                <img
                  src={teamMemberImage.startsWith("http") ? teamMemberImage : `${API_BASE}${teamMemberImage.startsWith("/") ? "" : "/"}${teamMemberImage}`}
                  alt="Превью"
                  className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                  onError={(e) => e.target.style.display = "none"}
                />
                <button
                  type="button"
                  onClick={() => setTeamMemberImage("")}
                  className="text-sm text-red-600 hover:underline"
                >
                  Удалить
                </button>
              </div>
            )}
          </div>
          <input
            type="text"
            value={teamMemberImage}
            onChange={(e) => setTeamMemberImage(e.target.value)}
            placeholder="Или вставьте URL фото"
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-600"
          />
        </div>
        <div>
          <label className="font-bold text-lg mb-2 text-gray-700 block">Описание</label>
          <textarea
            value={teamMemberDescription}
            onChange={(e) => setTeamMemberDescription(e.target.value)}
            placeholder="Краткое описание / должность"
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 resize-y"
          />
        </div>
        <div className="flex gap-3">
          <Button type="submit" width="w-full" height="h-15" disabled={teamMemberSaving}>
            {teamMemberSaving ? "Сохранение…" : editingTeamId ? "Сохранить изменения" : "Добавить в команду"}
          </Button>
          {editingTeamId && (
            <button
              type="button"
              onClick={handleCancelEditTeam}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Отмена
            </button>
          )}
        </div>
        <Line />
      </form>

      {/* Управление событиями */}
      <div className="w-full max-w-3xl mx-auto px-4 flex flex-col gap-8 mt-10">
        <h2 className="text-4xl font-bold text-center mb-6">Управление событиями</h2>
        <p className="text-sm text-gray-600 text-center -mt-4 mb-2">
          Украшения и эффекты отображаются на всех страницах сайта (главная, новости, команда и т.д.). Откройте сайт в другой вкладке, чтобы увидеть результат.
        </p>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-6 p-4 border-2 border-gray-300 rounded-lg">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-700">Новый Год (1 января)</span>
              <span className="text-sm text-gray-500">Снежинки, гирлянды</span>
            </div>
            <div className="flex gap-4 justify-center items-center">
              <Button type="button" width="w-auto" height="h-auto" noMargin={true} isActive={newYearDecor} onClick={() => updateHoliday({ newYearDecor: !newYearDecor })}>
                {newYearDecor ? "Убрать украшения" : "Украсить сайт"}
              </Button>
              <Button type="button" width="w-auto" height="h-auto" noMargin={true} isActive={newYearEffects} onClick={() => updateHoliday({ newYearEffects: !newYearEffects })}>
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
              <Button type="button" width="w-auto" height="h-auto" noMargin={true} isActive={victoryDayDecor} onClick={() => updateHoliday({ victoryDayDecor: !victoryDayDecor })}>
                {victoryDayDecor ? "Убрать ленту" : "Добавить ленту"}
              </Button>
              <Button type="button" width="w-auto" height="h-auto" noMargin={true} isActive={victoryDayEffects} onClick={() => updateHoliday({ victoryDayEffects: !victoryDayEffects })}>
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
