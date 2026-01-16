import React from 'react';
import SolutionElement from "./SolutionElement.jsx";
import solutions from "../../../../data/Solutions.js";
const Solutions = () => {
    return (
        <div className="container mx-auto mt-10">
            {solutions.map((element, index) => (
                <SolutionElement props={element} key={index + 1}/>
            ))}
        </div>
    );
};

export default Solutions;