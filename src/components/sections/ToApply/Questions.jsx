import React from 'react';
import solutions from "../../../data/Solutions.js";
import SolutionElement from "./Solutions/SolutionElement.jsx";

const Questions = () => {
    return (
        <div className="container mx-auto mt-10">
            {solutions.map((element, index) => (
                <SolutionElement props={element} key={index + 1}/>
            ))}
        </div>
    );
};

export default Questions;