import React, { useState } from "react";
import Button from "../../components/ui/Button/Button.jsx";
import { api } from "../../api/client.js";

const AdminReg = ({ onSuccess }) => {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await api.auth.login(password);
            if (typeof onSuccess === "function") onSuccess();
        } catch (err) {
            setError(err.message || "Неверный пароль или ошибка входа");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-200 container mx-auto flex flex-col justify-center items-center">
            <form onSubmit={handleSubmit} className="w-250 flex flex-col gap-5 container mx-auto max-w-md">
                <h1 className="text-4xl font-bold text-center mt-10 mb-10">Вход в админ-панель</h1>

                <div className="flex flex-col w-full">
                    <label htmlFor="admin-password" className="font-bold text-base mb-2">
                        Пароль
                    </label>
                    <input
                        id="admin-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Введите пароль"
                        required
                        className="h-15 max-lg:h-13 max-sm:h-12 mt-1 px-6 border-2 border-gray-400 rounded-4xl focus:outline-none focus:border-[#0b3b2e] text-base"
                        autoComplete="current-password"
                    />
                </div>

                {error && (
                    <p className="text-red-600 text-sm text-center">{error}</p>
                )}

                <Button
                    type="submit"
                    width="w-full mt-4"
                    height="h-15"
                    disabled={loading}
                >
                    {loading ? "Проверка…" : "Войти"}
                </Button>
            </form>
        </div>
    );
};

export default AdminReg;
