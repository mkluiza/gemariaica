const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-navigation');

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

menuToggle?.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.querySelector('.sr-only').textContent = isOpen ? 'Închide meniul' : 'Deschide meniul';
});

navigation?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        navigation.classList.remove('open');
        menuToggle?.setAttribute('aria-expanded', 'false');
        const label = menuToggle?.querySelector('.sr-only');
        if (label) label.textContent = 'Deschide meniul';
    });
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                currentObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add('visible'));
}

document.querySelector('.contact-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = event.currentTarget.querySelector('.form-status');
    status.textContent = 'Mulțumim — mesajul tău este pregătit pentru noi.';
    event.currentTarget.reset();
});