const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');

function setMenu(open) {
  if (!menuToggle || !mobileNav) return;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileNav.hidden = !open;
  document.body.classList.toggle('menu-open', open);
}
menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
window.matchMedia('(min-width:651px)').addEventListener('change', event => { if (event.matches) setMenu(false); });

const features = {
  discover: { file: 'map', word: 'DISCOVER', label: 'GaraMap / route discovery', caption: 'GaraMap route discovery. Current development build with a sample test route.', alt: 'GaraMap showing a sample route in Stockholm' },
  remember: { file: 'driving-map', word: 'REMEMBER', label: 'Your private driving atlas', caption: 'The private Driving Map on GaraMap, with date filters and heat controls. The distance and tracks are synthetic QA history.', alt: 'The actual private Driving Map with warm recorded traces, date filters, Heat and Names controls' },
  connect: { file: 'home', word: 'CONNECT', label: 'Home / your car community', caption: 'The Gara Home feed with a sample GaraTest photo post. Road photography by Patrik Stoltz / Pexels.', alt: 'The actual Gara Home feed with For you, Following and Friends views and a photo post' }
};
const featureTabs = [...document.querySelectorAll('.feature-tab')];
const featureImage = document.querySelector('#feature-image');
const featurePhone = document.querySelector('.feature-phone');

function selectFeature(tab, moveFocus = false) {
  const key = tab.dataset.feature;
  const feature = features[key];
  if (!feature || !featureImage || !featurePhone) return;
  featureTabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
  featureImage.src = './assets/2026-11/' + feature.file + '-720.jpg';
  featureImage.srcset = './assets/2026-11/' + feature.file + '-440.jpg 440w, ./assets/2026-11/' + feature.file + '-720.jpg 720w';
  featureImage.alt = feature.alt;
  featurePhone.dataset.zoom = featureImage.src;
  featurePhone.dataset.caption = feature.caption;
  document.querySelector('.stage-word').textContent = feature.word;
  document.querySelector('#feature-label').textContent = feature.label;
  if (moveFocus) tab.focus();
}
featureTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectFeature(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % featureTabs.length;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + featureTabs.length) % featureTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = featureTabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    selectFeature(featureTabs[next], true);
  });
});

const screenDialog = document.querySelector('.screen-dialog');
let zoomTrigger = null;
document.querySelectorAll('[data-zoom]').forEach(button => button.addEventListener('click', () => {
  if (!screenDialog?.showModal) return;
  zoomTrigger = button;
  const image = document.querySelector('#screen-large');
  image.src = button.dataset.zoom;
  image.alt = button.querySelector('img').alt;
  document.querySelector('#screen-caption').textContent = button.dataset.caption;
  screenDialog.showModal();
}));
document.querySelector('.dialog-close')?.addEventListener('click', () => screenDialog.close());
screenDialog?.addEventListener('click', event => {
  const rect = screenDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) screenDialog.close();
});
screenDialog?.addEventListener('close', () => zoomTrigger?.focus());
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });
