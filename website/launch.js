const captions = {explore:'Explore on GaraMap. Actual iPhone capture, 22 November 2026. Sample route content. Maps © Mapbox © OpenStreetMap.',discover:'Discover. Actual iPhone capture, 22 November 2026. GaraTest demonstration account and posts.','driving-map':'Private Driving Map. Actual iPhone capture, 22 November 2026. Synthetic test history, not a real person’s travel record. Maps © Mapbox © OpenStreetMap.'};
const dialog = document.querySelector('.screen-dialog');
document.querySelectorAll('[data-screen]').forEach(button => button.addEventListener('click', () => {
  const image = document.querySelector('#screen-large'); image.src = `./assets/launch/${button.dataset.screen}-720.jpg`; image.alt = button.querySelector('img').alt;
  document.querySelector('#screen-caption').textContent = captions[button.dataset.screen]; dialog.showModal();
}));
document.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
// Set only after verifying the public listing. Never point visitors at an unavailable download.
fetch('./launch.json').then(r => r.ok ? r.json() : null).then(config => {
  if (!config?.appStoreUrl || !/^https:\/\/apps\.apple\.com\//.test(config.appStoreUrl)) return;
  const link = document.createElement('a'); link.className = 'button'; link.href = config.appStoreUrl; link.textContent = 'Download on the App Store';
  document.querySelector('[data-store-slot]')?.replaceChildren(link);
}).catch(() => {});
