const menu = document.querySelector('.menu');
const nav = document.querySelector('.site-header nav');

menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!open));
  nav?.classList.toggle('open', !open);
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menu?.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
}));

const revealTargets = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  revealTargets.forEach((element) => observer.observe(element));
} else {
  revealTargets.forEach((element) => element.classList.add('visible'));
}

const duelButtons = document.querySelectorAll('[data-duel]');
const duelPhones = document.querySelectorAll('.duel-phone');
const duelDescription = document.querySelector('.duel-description');
const duelCopy = {
  leaderboard: "Each driver's best valid time. No noisy global ranking—just the people connected to the route.",
  stats: 'Compare your best and latest runs, including time, average speed, top speed, and speed across the route.',
};

duelButtons.forEach((button) => button.addEventListener('click', () => {
  const target = button.dataset.duel;
  duelButtons.forEach((item) => item.classList.toggle('is-active', item === button));
  duelPhones.forEach((phone) => phone.classList.toggle('is-front', phone.dataset.screen === target));
  if (duelDescription) duelDescription.textContent = duelCopy[target];
}));

const form = document.querySelector('.waitlist');
const toast = document.querySelector('.toast');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = form.querySelector('input');
  if (!email?.checkValidity()) return email?.reportValidity();
  toast?.classList.add('show');
  email.value = '';
  window.setTimeout(() => toast?.classList.remove('show'), 3200);
});

window.addEventListener('scroll', () => {
  const phone = document.querySelector('.hero-phone');
  if (phone && window.innerWidth > 1000 && window.scrollY < 900) {
    phone.style.translate = `0 ${window.scrollY * 0.045}px`;
  }
}, { passive: true });
