import React, {Fragment} from 'react';
import TeamElement from "../Team/TeamElement.jsx";
import CommitteesElement from "./CommitteesElement.jsx";

const CommitteesList = () => {
    return (
        <Fragment>
            <div className="grid grid-cols-2 gap-5">
                <CommitteesElement/>
                <CommitteesElement/>
                <CommitteesElement/>
                <CommitteesElement/>
            </div>
        </Fragment>
    );
};

export default CommitteesList;