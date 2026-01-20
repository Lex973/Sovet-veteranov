export const disableScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    window.onscroll = function() {
        window.scrollTo(scrollLeft, scrollTop);
    };

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollTop}px`;
    document.body.style.left = `-${scrollLeft}px`;
    document.body.style.width = '100%';
}

export const enableScroll = () => {
    const scrollTop = parseInt(document.body.style.top || '0');
    const scrollLeft = parseInt(document.body.style.left || '0');

    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.width = '';

    window.onscroll = null;

    window.scrollTo(-scrollLeft, -scrollTop);
}

