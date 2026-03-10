const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

const drawer = $('#drawer');
const backdrop = $('#backdrop');
const burger = $('#burger');
const closeDrawerBtn = $('#drawerClose');
let lastFocus = null;

const focusables = () => $$('a,button,input,[tabindex]:not([tabindex="-1"])', drawer).filter(el => !el.disabled);

function openDrawer() {
  if (!drawer) return;
  lastFocus = document.activeElement;
  drawer.classList.add('open');
  backdrop.classList.add('active');
  drawer.setAttribute('aria-hidden', 'false');
  burger.setAttribute('aria-expanded', 'true');
  document.body.classList.add('body-lock');
  (focusables()[0] || closeDrawerBtn).focus();
}
function closeDrawer() {
  if (!drawer) return;
  drawer.classList.remove('open');
  backdrop.classList.remove('active');
  drawer.setAttribute('aria-hidden', 'true');
  burger.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('body-lock');
  if (lastFocus) lastFocus.focus();
}

if (burger) burger.addEventListener('click', openDrawer);
if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
if (backdrop) backdrop.addEventListener('click', closeDrawer);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDrawer();
    closeModal();
  }
  if (e.key === 'Tab' && drawer?.classList.contains('open')) {
    const f = focusables();
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

$$('#drawer a[href^="#"]').forEach(a => a.addEventListener('click', closeDrawer));

$$('.lang-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const wrap = btn.closest('.lang');
    wrap.classList.toggle('open');
  });
});

document.addEventListener('click', (e) => {
  $$('.lang').forEach(w => { if (!w.contains(e.target)) w.classList.remove('open'); });
});

const faqItems = $$('.faq-item');
faqItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (item.open) faqItems.forEach(other => { if (other !== item) other.open = false; });
  });
});

const modal = $('#privacyModal');
const openModalBtn = $$('.privacy-open');
const closeTop = $('#modalCloseTop');
const closeBottom = $('#modalCloseBottom');
function openModal(){ if(!modal) return; modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); }
function closeModal(){ if(!modal) return; modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); }
openModalBtn.forEach(b => b.addEventListener('click', (e)=>{e.preventDefault(); openModal();}));
if(closeTop) closeTop.addEventListener('click', closeModal);
if(closeBottom) closeBottom.addEventListener('click', closeModal);
if(modal) modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); });

const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.style.transform = 'translateY(0)';
  });
},{threshold:0.2});
$$('.card,.review-card,.process-card,.visual-card,.metric-card').forEach(el=>{
  el.style.transform = 'translateY(6px)';
  el.style.transition = 'transform .4s ease';
  io.observe(el);
});
