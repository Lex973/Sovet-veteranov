import React, { useState } from "react";
import Button from "../../../ui/Button/Button.jsx";
import { api } from "../../../../api/client.js";

const ToApplyForm = () => {
    const [form, setForm] = useState({
        full_name: "",
        email: "",
        phone: "",
        question: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        setSuccess(false);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess(false);
        setError("");

        if (!form.full_name.trim() || !form.question.trim()) {
            setError("Пожалуйста, заполните ФИО и ваш вопрос.");
            return;
        }

        setLoading(true);
        try {
            await api.feedback.create({
                full_name: form.full_name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                question: form.question.trim(),
            });
            setSuccess(true);
            setForm({ full_name: "", email: "", phone: "", question: "" });
        } catch (e) {
            setError(e.message || "Не удалось отправить обращение. Попробуйте позже.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            className="container mx-auto mt-15 max-lg:mt-10 px-0 max-lg:px-4"
            onSubmit={handleSubmit}
        >
            <h1
                className="
                text-3xl font-bold text-center
                max-md:text-2xl
            "
            >
                Форма для вашего вопроса
            </h1>

            <p className="text-center text-gray-600 mt-3 mb-6 text-base max-md:text-sm">
                Поля, помеченные <span className="text-red-600 font-semibold">*</span>, обязательны к заполнению.
            </p>

            <section
                className="
                flex flex-col gap-8
                max-lg:gap-6
            "
            >
                <div className="flex flex-col w-full">
                    <label className="font-bold text-base max-lg:text-sm max-sm:text-[13px]">
                        ФИО <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        value={form.full_name}
                        onChange={handleChange("full_name")}
                        placeholder="Укажите как вас зовут"
                        required
                        className="h-15 max-lg:h-13 max-sm:h-12 mt-3 px-6 border-2 border-gray-400 rounded-4xl focus:outline-none text-base max-lg:text-sm"
                    />
                </div>

                <div className="flex flex-col w-full">
                    <label className="font-bold text-base max-lg:text-sm max-sm:text-[13px]">
                        Электронная почта
                    </label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={handleChange("email")}
                        placeholder="Укажите вашу эл. почту"
                        className="h-15 max-lg:h-13 max-sm:h-12 mt-3 px-6 border-2 border-gray-400 rounded-4xl focus:outline-none text-base max-lg:text-sm"
                    />
                </div>

                <div className="flex flex-col w-full">
                    <label className="font-bold text-base max-lg:text-sm max-sm:text-[13px]">
                        Телефон
                    </label>
                    <input
                        type="tel"
                        value={form.phone}
                        onChange={handleChange("phone")}
                        placeholder="Укажите ваш номер телефона"
                        className="h-15 max-lg:h-13 max-sm:h-12 mt-3 px-6 border-2 border-gray-400 rounded-4xl focus:outline-none text-base max-lg:text-sm"
                    />
                </div>

                <div className="flex flex-col w-full">
                    <label className="font-bold text-base max-lg:text-sm max-sm:text-[13px]">
                        Ваш вопрос <span className="text-red-600">*</span>
                    </label>
                    <textarea
                        value={form.question}
                        onChange={handleChange("question")}
                        placeholder="Подробно опишите ваш вопрос"
                        required
                        className="mt-3 px-6 py-3 h-50 max-lg:h-40 max-sm:h-32 border-2 border-gray-400 rounded-4xl focus:outline-none text-base max-lg:text-sm resize-none"
                    />
                </div>

                <p
                    className="
                    text-[15px] text-red-600 mt-3
                    max-md:text-sm
                "
                >
                    Нажимая кнопку &quot;Отправить&quot; вы даете своё согласие на обработку
                    персональных данных согласно ФЗ №152-ФЗ.
                </p>

                {error && (
                    <p className="text-red-600 text-sm">
                        {error}
                    </p>
                )}
                {success && (
                    <p className="text-green-700 text-sm">
                        Ваше обращение отправлено. Спасибо!
                    </p>
                )}

                <Button
                    type="submit"
                    isActive={!loading}
                    width="w-full"
                    height="h-15"
                >
                    {loading ? "Отправка..." : "Отправить"}
                </Button>
            </section>
        </form>
    );
};
export default ToApplyForm