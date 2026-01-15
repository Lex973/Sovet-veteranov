import React from 'react';
import TeamElement from "./TeamElement.jsx";

const TeamList = () => {
    return (
        <div className="grid grid-cols-2 gap-5">
            <TeamElement/>
            <TeamElement/>
            <TeamElement/>
            <TeamElement/>
        </div>
    );
};

export default TeamList;