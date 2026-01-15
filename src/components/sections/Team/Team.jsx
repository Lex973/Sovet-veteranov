import React from 'react';
import TeamList from "./TeamList.jsx";

const Team = () => {
    return (
        <section className="container mx-auto mt-20 mb-20">
            <h1 className="text-5xl font-bold text-center mt-10 mb-15">Команда</h1>

            <TeamList/>
        </section>
    );
};

export default Team;