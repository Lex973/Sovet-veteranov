import React from 'react';
import Departments from "./Departments.jsx";
import YandexMap from "../../ui/Map/YandexMap.jsx";

const DistrictOffices = () => {
    const departments = [
        {
            id: 1,
            name: "Калининский Совет ветеранов",
            address: "ул. Кирова, 10",
            phone: "791-65-91",
            email: "kalinsovetvet@yandex.ru"
        },
        {
            id: 2,
            name: "Курчатовский Совет ветеранов",
            address: "ул. Ворошилова, 31-71",
            phone: "793-02-33",
            email: "veteranu7474@mail.ru"
        },
        {
            id: 3,
            name: "Ленинский Совет ветеранов",
            address: "ул. Гагарина, 23",
            phone: "256-24-05",
            email: "veteranlen@mail.ru"
        },
        {
            id: 4,
            name: "Металлургический Совет ветеранов",
            address: "ул. Б. Хмельницкого",
            phone: "723-09-08",
            email: "rsvmetall@mail.ru"
        },
        {
            id: 5,
            name: "Советский Совет ветеранов",
            address: "ул. Цвиллинга, 58",
            phone: "237-06-98",
            email: "sovetveteran97@mail.ru"
        },
        {
            id: 6,
            name: "Тракторозаводский Совет ветеранов",
            address: "ул. 1-ой Пятилетки",
            phone: "775-34-05",
            email: "tzrsv@yandex.ru"
        },
        {
            id: 7,
            name: "Центральный Совет ветеранов",
            address: "ул.Коммуны, 135",
            phone: "225-41-31",
            email: "sovetveteranov74a@yandex.ru"
        },
    ];

    return (
        <section className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {departments.map((dept, index) => (
                        <Departments dept={dept} key={index + 1}/>
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