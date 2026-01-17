import React from 'react';
import Input from "../../components/ui/Input/Input.jsx";
import Button from "../../components/ui/Button/Button.jsx";
import Line from "../../components/ui/Line.jsx";

const AdminPanel = () => {
    return (
        <div>
            <h1 className="text-5xl font-bold text-center mt-10 mb-10">Админ-панель</h1>

            <form action="" className="mt-15 w-1/2 mx-auto flex flex-col gap-8">
                <h1 className="text-4xl font-bold text-center mt-10 mb-10">Форма для создания нового поста</h1>

                <Input inputText="Заголовок" placeholder="Напишите заголовок, который выделится другим цветом"/>
                <Input inputText="Заголовок" placeholder="Напишите остальную часть заголовка"/>
                <Input inputText="Фотография" placeholder="Загрузите фотографию" photo={true}/>

                <div className="flex justify-between gap-6">
                    <div className="flex flex-col flex-1">
                        <label htmlFor="date" className="font-bold text-lg mb-2 text-gray-700">Дата <span className="text-red-600">*</span></label>
                        <input 
                            type="date" 
                            id="date"
                            required
                            className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 transition-all duration-200 text-gray-700 font-medium bg-white hover:border-gray-400"
                        />
                    </div>

                    <div className="flex flex-col flex-1">
                        <label htmlFor="hashtag" className="font-bold text-lg mb-2 text-gray-700">Хэштег (если нужен)</label>
                        <select 
                            name="hashtag" 
                            id="hashtag"
                            className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 transition-all duration-200 text-gray-700 font-medium bg-white hover:border-gray-400 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpolyline points=%226 9 12 15 18 9%22%3E%3C/polyline%3E%3C/svg%3E')] bg-no-repeat bg-right-4 bg-[length:20px] pr-10"
                        >
                            <option value="">Выберите хэштег</option>
                            <option value="Спорт">Спорт</option>
                            <option value="Жкх">Жкх</option>
                            <option value="Разное">Разное</option>
                            <option value="Образование">Образование</option>
                            <option value="Культура">Культура</option>
                            <option value="Отдых">Отдых</option>
                            <option value="Здоровье">Здоровье</option>
                        </select>
                    </div>
                </div>

                <Input inputText="Основной текст" placeholder="Напишите текст для новых новостей" big={true}/>
                <Button width="w-full" height="h-15">Создать пост</Button>

                <Line/>
            </form>

            <form action="" className="w-1/2 mx-auto flex flex-col gap-8">
                <h1 className="text-4xl font-bold text-center">Форма для создания нового хештега (#)</h1>
                <Input inputText="Название хештега" placeholder="Напишите название хэштега"/>
                <Button width="w-full" height="h-15">Создать хештег</Button>

                <Line/>
            </form>

            <form action="" className="w-1/2 mx-auto flex flex-col gap-8">
                <h1 className="text-4xl font-bold text-center">Форма для создания члена комитета</h1>

                <Input inputText="ФИО" placeholder="Введите ФИО члена комитета"/>

                <Input inputText="Фотография" placeholder="Загрузите фотографию" photo={true}/>

                <Input inputText="Основной текст" placeholder="Напишите основной текст" big={true}/>

                <Button width="w-full" height="h-15">Создать члена комитета</Button>

                <Line/>
            </form>

            <form action="" className="w-1/2 mx-auto flex flex-col gap-8">
                <h1 className="text-4xl font-bold text-center">Форма для создания члена команды</h1>

                <Input inputText="ФИО" placeholder="Введите ФИО члена комитета"/>

                <Input inputText="Фотография" placeholder="Загрузите фотографию" photo={true}/>

                <Input inputText="Основной текст" placeholder="Напишите основной текст" big={true}/>

                <Button width="w-full" height="h-15">Создать члена команды</Button>

                <Line/>
            </form>

            <form action="" className="w-1/2 mx-auto flex flex-col gap-8 mt-10">
                <h1 className="text-4xl font-bold text-center mb-6">Управление событиями</h1>

                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between gap-6 p-4 border-2 border-gray-300 rounded-lg">
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-gray-700">Праздник (Дата)</span>
                        </div>

                        <div className="flex gap-4 justify-center items-center">
                            <Button width="w-auto" height="h-auto" noMargin={true}>Украсить сайт</Button>
                            <Button width="w-auto" height="h-auto" noMargin={true}>Добавить эффекты</Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-6 p-4 border-2 border-gray-300 rounded-lg">
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-gray-700">Праздник (Дата)</span>
                        </div>

                        <div className="flex gap-4">
                            <Button width="w-auto" height="h-auto" noMargin={true}>Украсить сайт</Button>
                            <Button width="w-auto" height="h-auto" noMargin={true}>Добавить эффекты</Button>
                        </div>
                    </div>

                </div>
            </form>
        </div>
    );
};

export default AdminPanel;