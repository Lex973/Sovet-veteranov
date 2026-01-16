import React from 'react';
import TeamElement from "./TeamElement.jsx";
import Team from "../../../data/Team.js";
const TeamList = () => {
    return (
        <div className="grid grid-cols-2 max-[767px]:grid-cols-1 gap-8 xl:grid-cols-3 lg:grid-cols-2 ">
            {Team.map((team, index) => (
                <TeamElement team={team} key={index + 1}/>
            ))}
        </div>
    );
};

export default TeamList;