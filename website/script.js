const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
const header = document.querySelector('.site-header');
const scrollMeter = document.querySelector('.scroll-meter i');

function setMenu(open) {
  menuButton?.setAttribute('aria-expanded', String(open));
  menuButton?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileMenu?.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
}

menuButton?.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});

const revealTargets = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add('visible'));
}

const storyScreen = document.querySelector('#story-screen');
const storyIndex = document.querySelector('#story-index');
const storyStatus = document.querySelector('#story-status');
const storySteps = document.querySelectorAll('.story-step');

function activateStory(step) {
  if (!step || !storyScreen) return;
  const screen = step.dataset.screen;
  const index = String(step.dataset.step).padStart(2, '0');
  const mobileSource = `./assets/screens/current/mobile/${screen}.jpg`;
  const desktopSource = `./assets/screens/current/web/${screen}.jpg`;

  storySteps.forEach((item) => item.classList.toggle('is-active', item === step));
  storyIndex.textContent = index;
  storyStatus.textContent = step.dataset.status;

  if (storyScreen.dataset.current === screen) return;
  storyScreen.parentElement.classList.add('is-changing');
  window.setTimeout(() => {
    storyScreen.src = desktopSource;
    storyScreen.srcset = `${mobileSource} 420w, ${desktopSource} 720w`;
    storyScreen.alt = step.dataset.alt;
    storyScreen.dataset.current = screen;
    storyScreen.parentElement.classList.remove('is-changing');
  }, 170);
}

if ('IntersectionObserver' in window) {
  const storyObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) activateStory(visible.target);
  }, { threshold: [0.45, 0.65] });

  storySteps.forEach((step) => storyObserver.observe(step));
}

storySteps.forEach((step) => {
  step.addEventListener('click', () => activateStory(step));
});

const scoreButtons = document.querySelectorAll('[data-score-tab]');
const scoreScreens = document.querySelectorAll('[data-score-screen]');

scoreButtons.forEach((button) => {
  button.setAttribute('aria-pressed', String(button.classList.contains('is-active')));
  button.addEventListener('click', () => {
    const target = button.dataset.scoreTab;
    scoreButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    scoreScreens.forEach((screen) => {
      screen.classList.toggle('is-active', screen.dataset.scoreScreen === target);
    });
  });
});

let scrollFrame = null;
function updateScrollEffects() {
  scrollFrame = null;
  const y = window.scrollY;
  const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  scrollMeter.style.transform = `scaleX(${Math.min(y / max, 1)})`;
  header?.classList.toggle('is-sticky', y > 130);

  if (window.innerWidth > 980 && y < window.innerHeight * 1.1) {
    const mapPhone = document.querySelector('.phone-map');
    const homePhone = document.querySelector('.phone-home');
    if (mapPhone) mapPhone.style.translate = `0 ${y * 0.035}px`;
    if (homePhone) homePhone.style.translate = `0 ${y * -0.018}px`;
  }
}

window.addEventListener('scroll', () => {
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(updateScrollEffects);
}, { passive: true });

window.addEventListener('resize', () => {
  if (window.innerWidth > 980) setMenu(false);
  updateScrollEffects();
});

updateScrollEffects();
