import React, { useState, useEffect } from 'react';
import Departments from "./Departments.jsx";
import YandexMap from "../../ui/Map/YandexMap.jsx";
import { api } from "../../../api/client.js";

const DistrictOffices = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);
        api.districtOffices
            .list()
            .then((data) => {
                if (!cancelled) setDepartments(Array.isArray(data) ? data : []);
            })
            .catch((e) => {
                if (!cancelled) setError(e.message || "Не удалось загрузить районные отделения");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, []);

    if (loading) {
        return (
            <section className="container mx-auto px-4">
                <div className="py-10 text-center text-gray-600">
                    Загрузка районных отделений...
                </div>
                <div className="mt-12">
                    <h1 className="text-4xl font-bold text-center mt-10 mb-15">Карта районных отделений</h1>
                    <YandexMap/>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="container mx-auto px-4">
                <div className="py-10 text-center text-red-600">{error}</div>
                <div className="mt-12">
                    <h1 className="text-4xl font-bold text-center mt-10 mb-15">Карта районных отделений</h1>
                    <YandexMap/>
                </div>
            </section>
        );
    }

    return (
        <section className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {departments.map((dept) => (
                    <Departments dept={dept} key={dept.id} />
                ))}
            </div>

            <div className="mt-12">
                <h1 className="text-4xl font-bold text-center mt-10 mb-15">Карта районных отделений</h1>
                <YandexMap/>
            </div>
        </section>
    );
};

export default DistrictOffices;
