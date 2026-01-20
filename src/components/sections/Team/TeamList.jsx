import React, {useRef, useState, useEffect} from 'react';
import TeamElement from "./TeamElement.jsx";
import Team from "../../../data/Team.js";
import ModalWindowInfo from "./ModalWindowInfo.jsx";
import {disableScroll} from "../../../js/scroll.js";
import {enableScroll} from "../../../js/scroll.js";
const TeamList = () => {
    const [selectedMember, setSelectedMember] = useState(null)
    const [modalWindow, setModalWindow] = useState(false);

    const DomModalWindow = useRef(null)

    useEffect(() => {
        if (modalWindow) {
            disableScroll();
        } else {
            enableScroll();
        }

        return () => {
            enableScroll();
        };
    }, [modalWindow]);

    const handleClick = (team) => {
        setSelectedMember(team)
        setModalWindow(!modalWindow)

        modalWindow ? disableScroll() : enableScroll()
    }

    console.log(modalWindow)
    return (
        <section>
            <div className="grid grid-cols-2 max-[767px]:grid-cols-1 gap-8 xl:grid-cols-3 lg:grid-cols-2 ">
                {Team.map((team, index) => (
                    <TeamElement team={team} key={index + 1} onReadMore={() => handleClick(team)}/>
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