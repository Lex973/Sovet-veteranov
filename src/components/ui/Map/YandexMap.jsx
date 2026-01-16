import { useEffect, useRef } from 'react';

const YandexMap = () => {
    const mapRef = useRef(null);

    useEffect(() => {
        if (!window.ymaps) {
            const script = document.createElement('script');
            script.src = 'https://api-maps.yandex.ru/2.1/?apikey=ваш_ключ&lang=ru_RU';
            script.async = true;
            document.head.appendChild(script);

            script.onload = () => {
                initMap();
            };
        } else {
            initMap();
        }

        function initMap() {
            window.ymaps.ready(() => {
                const map = new window.ymaps.Map(mapRef.current, {
                    center: [55.159902, 61.402554],
                    zoom: 11
                });

                const offices = [
                    { coords: [55.1540, 61.4293], name: "Калининский Совет ветеранов" },
                    { coords: [55.1326, 61.4413], name: "Курчатовский Совет ветеранов" },
                    { coords: [55.1270, 61.4666], name: "Ленинский Совет ветеранов" },
                    { coords: [55.1770, 61.3538], name: "Металлургический Совет ветеранов" },
                    { coords: [55.1216, 61.3928], name: "Советский Совет ветеранов" },
                    { coords: [55.0891, 61.3014], name: "Тракторозаводский Совет ветеранов" },
                    { coords: [55.1667, 61.4000], name: "Центральный Совет ветеранов" }
                ];

                offices.forEach(office => {
                    const placemark = new window.ymaps.Placemark(office.coords, {
                        balloonContent: office.name
                    });
                    map.geoObjects.add(placemark);
                });
            });
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.innerHTML = '';
            }
        };
    }, []);

    return (
        <div className="rounded-lg overflow-hidden shadow-lg">
            <div
                ref={mapRef}
                className="w-full h-96"
            />
        </div>
    );
};
export default YandexMap;