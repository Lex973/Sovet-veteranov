import React, {useState} from 'react';
import ToApplyButtons from "./ToApplyButtons.jsx";
import ToApplyForm from "./Form/ToApplyForm.jsx";
import Solutions from "./Solutions/Solutions.jsx";
import Questions from "./Questions.jsx";
const ToApply = () => {
    const [switchSection, setSwitchSection] = useState('Форма для обращения')

    function renderPage() {
        switch (switchSection) {
            case 'Форма для обращения':
                return <ToApplyForm/>
            case 'Решения вопросов':
                return <Solutions/>
            case 'Ваши вопросы':
                return <Questions/>
        }
    }
    return (
        <section>
            <ToApplyButtons setSwitchSection={setSwitchSection}/>

            {renderPage()}
        </section>
    );
};

export default ToApply;