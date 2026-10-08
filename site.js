// появление при скролле
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
document.querySelectorAll('.rv').forEach((el) => io.observe(el));
// стрелки сетки товаров
const cells = document.getElementById('cells');
document.querySelectorAll('.grid-nav button').forEach((b) => b.addEventListener('click', () => cells && cells.scrollBy({ left: +b.dataset.dir * (cells.firstElementChild ? cells.firstElementChild.offsetWidth + 16 : cells.clientWidth * .5), behavior: 'smooth' })));
// режимы брожения
document.querySelectorAll('button.mode').forEach((m) => m.addEventListener('click', () => m.parentElement.querySelectorAll('button.mode').forEach((x) => x.setAttribute('aria-pressed', String(x === m)))));
// вкладки брендов (концепт: переключают только подсветку)
document.querySelectorAll('.chip-tab').forEach((t) => t.addEventListener('click', () => t.parentElement.querySelectorAll('.chip-tab').forEach((x) => { x.classList.toggle('on', x === t); x.setAttribute('aria-selected', String(x === t)); })));
// вкладки «Инфо / Режимы / Состав»
document.querySelectorAll('.seg [role=tab]').forEach((t) => t.addEventListener('click', () => {
  t.parentElement.querySelectorAll('[role=tab]').forEach((x) => { const on = x === t; x.setAttribute('aria-selected', String(on)); document.getElementById(x.getAttribute('aria-controls')).hidden = !on; });
}));
// избранное
document.querySelectorAll('.fav').forEach((f) => f.addEventListener('click', () => f.setAttribute('aria-pressed', String(f.getAttribute('aria-pressed') !== 'true'))));
// галерея товара: превью переключают большое фото
document.querySelectorAll('.pd-thumbs [role=tab]').forEach((t) => t.addEventListener('click', () => {
  const slides = t.closest('.pd-gal').querySelectorAll('.pd-slide');
  t.parentElement.querySelectorAll('[role=tab]').forEach((x) => x.setAttribute('aria-selected', String(x === t)));
  slides.forEach((s, i) => s.classList.toggle('on', i === +t.dataset.slide));
}));
// карточка: выбор маркетплейса меняет кнопку «Купить на …»
document.querySelectorAll('.mp-sw button').forEach((b) => b.addEventListener('click', () => {
  b.parentElement.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  const buy = b.closest('.pcard-buy').querySelector('.btn');
  buy.textContent = 'Купить на ' + b.dataset.mp; buy.href = b.dataset.href;
}));
// режимы в блоке «Срок зависит от температуры»
document.querySelectorAll('button.hmode').forEach((m) => m.addEventListener('click', () => m.parentElement.querySelectorAll('button.hmode').forEach((x) => x.setAttribute('aria-pressed', String(x === m)))));
// слайдер позиций на первом экране
document.querySelectorAll('.h2-slider').forEach((sl) => {
  const track = sl.querySelector('.hs-track'), cards = [...sl.querySelectorAll('.hs-card')], cur = sl.querySelector('.hs-cur'), bar = sl.querySelector('.hs-bar i');
  let i = 0;
  const go = (n) => {
    i = (n + cards.length) % cards.length;
    const step = cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : 0;
    track.style.transform = `translateX(${-i * step}px)`;
    cards.forEach((c, k) => { c.classList.toggle('on', k === i); c.tabIndex = k === i ? 0 : -1; });
    cur.textContent = String(i + 1).padStart(2, '0');
    bar.style.width = ((i + 1) / cards.length * 100) + '%';
  };
  sl.querySelectorAll('.hs-btn').forEach((b) => b.addEventListener('click', () => go(i + +b.dataset.dir)));
  let x0 = null;
  track.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
  let swiped = false;
  track.addEventListener('pointerup', (e) => { swiped = x0 !== null && Math.abs(e.clientX - x0) > 40; if (swiped) go(i + (e.clientX < x0 ? 1 : -1)); x0 = null; });
  track.addEventListener('dragstart', (e) => e.preventDefault());
  // свайп не открывает карточку; клик по соседней карточке листает к ней
  cards.forEach((c, k) => c.addEventListener('click', (e) => { if (swiped || k !== i) { e.preventDefault(); if (!swiped) go(k); } swiped = false; }));
  window.addEventListener('resize', () => go(i));
  go(0);
});
// поля до контейнера 1440 считаем по реальной ширине страницы (без полосы прокрутки Windows)
const setSide = () => document.documentElement.style.setProperty('--side', Math.max(0, (document.documentElement.clientWidth - 1440) / 2) + 'px');
setSide(); window.addEventListener('resize', setSide);
// режим брожения: выбор крепости пересчитывает шаги (сахар, температура, срок)
document.querySelectorAll('[role=radiogroup] .hmode').forEach((m) => m.addEventListener('click', () => {
  m.parentElement.querySelectorAll('.hmode').forEach((x) => x.setAttribute('aria-checked', String(x === m)));
  const sec = m.closest('section');
  ['kg', 't', 'p', 'days'].forEach((k) => sec.querySelectorAll(`[data-f="${k}"]`).forEach((el) => {
    el.textContent = m.dataset[k]; el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
  }));
}));
// оригинал: наведение на признак подсвечивает точку на пачке
document.querySelectorAll('.orig-row').forEach((r) => {
  const hot = r.closest('.orig').querySelector(`.hot[data-n="${r.dataset.n}"]`);
  ['mouseenter', 'focus'].forEach((e) => r.addEventListener(e, () => hot.classList.add('on')));
  ['mouseleave', 'blur'].forEach((e) => r.addEventListener(e, () => hot.classList.remove('on')));
});

// всплывающие окна: кнопка/ссылка с data-contact открывает «Связаться» (почта), с data-soon — «Сайт в разработке»
[['data-contact', 'contact-dlg'], ['data-soon', 'soon-dlg']].forEach(([attr, id]) => {
  const dlg = document.getElementById(id);
  if (!dlg) return;
  document.querySelectorAll(`[${attr}]`).forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); dlg.showModal(); }));
  dlg.querySelector('[data-close]').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
});
// бургер-меню (телефон и планшет): открыть/закрыть, Esc, клик по пункту закрывает, фон не скроллится
const burger = document.querySelector('.hd4-burger'), mnav = document.getElementById('mnav');
if (burger && mnav) {
  const set = (open) => { burger.setAttribute('aria-expanded', String(open)); burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню'); mnav.hidden = !open; document.documentElement.classList.toggle('mnav-open', open); };
  burger.addEventListener('click', () => set(burger.getAttribute('aria-expanded') !== 'true'));
  mnav.addEventListener('click', (e) => { if (e.target.closest('a, [data-contact]')) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !mnav.hidden) { set(false); burger.focus(); } });
  window.addEventListener('resize', () => { if (innerWidth >= 992) set(false); });
}