import React from 'react';
import CommitteesList from "./CommitteesList.jsx";
import TeamList from "../Team/TeamList.jsx";

const Committees = () => {
    return (
        <section className="container mx-auto mt-20 mb-20">
            <h1 className="text-5xl font-bold text-center mt-10 mb-15">Комитеты</h1>

            <CommitteesList/>
        </section>
    );
};

export default Committees;