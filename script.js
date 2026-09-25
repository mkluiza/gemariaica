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

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    if (typeof emailjs !== 'undefined') emailjs.init({ publicKey: '-RxwZb0vBaP6znrIx' });

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const status = form.querySelector('.form-status');
        const submitButton = form.querySelector('button[type="submit"]');

        if (typeof emailjs === 'undefined') {
            status.textContent = 'Serviciul de contact nu este disponibil momentan.';
            return;
        }

        submitButton.disabled = true;
        status.textContent = 'Se trimite mesajul...';

        try {
            await emailjs.sendForm('service_j3pz6vr', 'template_3an3ftm', form);
            status.textContent = 'Mulțumim! Mesajul tău a fost trimis.';
            form.reset();
        } catch (error) {
            status.textContent = 'Mesajul nu a putut fi trimis. Te rugăm să încerci din nou.';
            console.error('EmailJS error:', error);
        } finally {
            submitButton.disabled = false;
        }
    });
}

const visitCount = document.querySelector('[data-visit-count]');

const updateDailyVisitCount = async () => {
    if (!visitCount || typeof Counter === 'undefined') return;

    const today = new Date().toISOString().slice(0, 10);
    const counterName = `visits-${today}`;
    const storageKey = `gemariaica-counted-${today}`;
    const alreadyCounted = window.localStorage?.getItem(storageKey) === 'true';

    try {
        const counter = new Counter({ workspace: 'gemariaica' });
        const result = alreadyCounted
            ? await counter.get(counterName)
            : await counter.up(counterName);

        visitCount.textContent = Number(result.value).toLocaleString('ro-RO');
        if (!alreadyCounted) window.localStorage?.setItem(storageKey, 'true');
    } catch (error) {
        visitCount.textContent = '—';
        console.warn('Contorul zilnic nu a putut fi încărcat.', error);
    }
};

updateDailyVisitCount();