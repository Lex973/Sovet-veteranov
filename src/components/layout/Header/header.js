document.addEventListener('DOMContentLoaded', () => {
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (!header) return;

        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
        lastScroll = currentScroll;
    });
});