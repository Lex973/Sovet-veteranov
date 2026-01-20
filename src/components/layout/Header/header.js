document.addEventListener('DOMContentLoaded', () => {
    const stickyHeader = () => {
        const header = document.querySelector('.header');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }

            lastScroll = currentScroll;
        });
    }

    stickyHeader()
})