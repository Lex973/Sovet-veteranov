import React, {Fragment} from 'react';
import CommitteesElement from "./CommitteesElement.jsx";
import committees from '../../../data/Commitees.js'

const CommitteesList = () => {
    return (
        <section>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {committees.map((member, index) => (
                        <CommitteesElement member={member} key={index + 1}/>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CommitteesList;