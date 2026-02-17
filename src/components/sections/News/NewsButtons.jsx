import React, {useState, useRef} from 'react';
import Button from "../../ui/Button/Button.jsx";

const DEFAULT_HASHTAGS = [
    '#Спорт', '#Отдых', '#Здоровье', '#ЖКХ', '#Культура',
    '#Социально-бытовой комитет', '#Образование',
    '#Военно-патриотический комитет', '#Проблемные вопросы',
    '#Решение проблемных вопросов', '#Разное'
];

const NewsButtons = ({ selectedHashtags, setSelectedHashtags, hashtags: hashtagsFromApi }) => {
    const scrollElement = useRef(null)

    const [canScrollLeft, setCanScrollLeft] = useState(true)
    const [canScrollRight, setCanScrollRight] = useState(true)

    const checkScrollPosition = () => {
        if (!scrollElement.current) return;

        const container = scrollElement.current;

        const scrollLeft = container.scrollLeft;
        const clientWidth = container.clientWidth;
        const scrollWidth = container.scrollWidth;

        // Проверяем возможность прокрутки влево (есть ли контент слева)
        const canScrollLeft = scrollLeft > 15
        setCanScrollLeft(canScrollLeft)

        // Проверяем возможность прокрутки вправо (есть ли контент справа)
        const canScrollRight = scrollLeft + clientWidth < scrollWidth - 15
        setCanScrollRight(canScrollRight)
    };

    const right = (e) => {
        e.preventDefault()
        if (!scrollElement.current) return;
        
        const container = scrollElement.current;
        const scrollLeft = container.scrollLeft;
        const clientWidth = container.clientWidth;
        const scrollWidth = container.scrollWidth;
        
        // Проверяем, можем ли прокрутить вправо
        if (scrollLeft + clientWidth >= scrollWidth - 15) {
            return; // Уже в конце, не прокручиваем
        }
        
        // Ограничиваем прокрутку, чтобы не выйти за пределы
        const maxScroll = scrollWidth - clientWidth;
        const nextScroll = Math.min(scrollLeft + 300, maxScroll);
        
        container.scrollTo({ left: nextScroll, behavior: 'smooth'})
        setTimeout(() => {
            checkScrollPosition()
        }, 300)
    }

    const left = (e) => {
        e.preventDefault()
        if (!scrollElement.current) return;
        
        const container = scrollElement.current;
        const scrollLeft = container.scrollLeft;
        
        // Проверяем, можем ли прокрутить влево
        if (scrollLeft <= 15) {
            return; // Уже в начале, не прокручиваем
        }
        
        // Ограничиваем прокрутку, чтобы не выйти за пределы
        const nextScroll = Math.max(scrollLeft - 300, 0);
        
        container.scrollTo({ left: nextScroll, behavior: 'smooth'})
        setTimeout(() => {
            checkScrollPosition()
        }, 300)
    }

    const hashtags = (hashtagsFromApi && hashtagsFromApi.length > 0) ? hashtagsFromApi : DEFAULT_HASHTAGS;

    const [hashtag, setHashtag] = useState([])
    const handleClick = (event, btn) => {
        event.preventDefault();

        if (hashtag.includes(btn)) {
            const newArray = hashtag.filter(prev => prev !== btn)
            setHashtag(newArray);
            setSelectedHashtags(newArray)
            return
        }

        setHashtag([...hashtag, btn])
        setSelectedHashtags([...selectedHashtags, btn])
    }

    React.useEffect(() => {
        checkScrollPosition();
        
        // Добавляем обработчик события scroll для более точного отслеживания
        const container = scrollElement.current;
        if (container) {
            container.addEventListener('scroll', checkScrollPosition);
            // Также проверяем при изменении размера окна
            window.addEventListener('resize', checkScrollPosition);
        }
        
        return () => {
            if (container) {
                container.removeEventListener('scroll', checkScrollPosition);
                window.removeEventListener('resize', checkScrollPosition);
            }
        };
    }, []);

    return (
        <div className="mt-6 mb-6 md:mt-8 md:mb-8 lg:mt-10 lg:mb-10 container mx-auto overflow-hidden flex justify-center items-center px-4">
            <button
                className={`block lg:hidden cursor-pointer h-[50px] mr-2 lg:h-[60px] lg:mr-3 transition-opacity ${!canScrollRight ? "opacity-20" : ""}`}
                onClick={(e) => left(e)}
            >
                <img src="/Arrow-left.svg" alt="Прокрутить влево" width="50px" height="50px"/>
            </button>

            <section
                className="flex gap-2 flex-nowrap text-center items-center overflow-x-auto w-full
                 lg:w-auto lg:block
                    [&::-webkit-scrollbar]:hidden
                    [-ms-overflow-style:none]
                    [scrollbar-width:none]
                    overflow-x-scroll"
                ref={scrollElement}
                style={{ scrollBehavior: 'smooth' }}
            >
                {hashtags.map((btn, index) => (
                    <Button
                        key={index + 1}
                        onClick={(event) => handleClick(event, btn)}
                        isActive={hashtag.includes(btn)}
                        noMargin={true}
                    >
                        {btn}
                    </Button>
                ))}
            </section>

            <button
                className={`block lg:hidden cursor-pointer h-[50px] ml-2 lg:h-[60px] lg:ml-3 transition-opacity ${!canScrollLeft ? "opacity-20" : ""}`}
                onClick={(e) => right(e)}
            >
                <img src="/Arrow-right.svg" alt="Прокрутить вправо" width="50px" height="50px"/>
            </button>
        </div>
    );
};

export default NewsButtons;
