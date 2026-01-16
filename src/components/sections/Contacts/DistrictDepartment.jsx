import React from 'react';
import DistrictOffices from "./DistrictOffices.jsx";

const DistrictDepartment = () => {
    return (
        <div>
            <h1 className="text-4xl font-bold text-center mt-10 mb-15">Районные отделения</h1>

            <DistrictOffices/>
        </div>
    );
};

export default DistrictDepartment;