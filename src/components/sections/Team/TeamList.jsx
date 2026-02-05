import React, { useRef, useState, useEffect } from 'react';
import TeamElement from "./TeamElement.jsx";
import ModalWindowInfo from "./ModalWindowInfo.jsx";
import { disableScroll } from "../../../js/scroll.js";
import { enableScroll } from "../../../js/scroll.js";
import { api } from "../../../api/client.js";

const TeamList = () => {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);
    const [modalWindow, setModalWindow] = useState(false);
    const DomModalWindow = useRef(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);
        api.team
            .list()
            .then((data) => {
                if (!cancelled) setTeam(Array.isArray(data) ? data : []);
            })
            .catch((e) => {
                if (!cancelled) setError(e.message || "Не удалось загрузить команду");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        if (modalWindow) {
            disableScroll();
        } else {
            enableScroll();
        }
        return () => enableScroll();
    }, [modalWindow]);

    const handleClick = (member) => {
        setSelectedMember(member);
        setModalWindow(!modalWindow);
    };

    if (loading) {
        return (
            <div className="py-10 text-center text-gray-600">
                Загрузка команды...
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-10 text-center text-red-600">
                {error}
            </div>
        );
    }

    if (team.length === 0) {
        return (
            <div className="py-10 text-center text-gray-600">
                Данные о команде пока не добавлены.
            </div>
        );
    }

    return (
        <section>
            <div className="grid grid-cols-2 max-[767px]:grid-cols-1 gap-8 xl:grid-cols-3 lg:grid-cols-2 ">
                {team.map((member) => (
                    <TeamElement
                        team={member}
                        key={member.id}
                        onReadMore={() => handleClick(member)}
                    />
                ))}
            </div>

            <ModalWindowInfo
                ref={DomModalWindow}
                selectedMember={selectedMember}
                onClose={() => setModalWindow(!modalWindow)}
                isOpen={modalWindow}
            />
        </section>
    );
};

export default TeamList;
