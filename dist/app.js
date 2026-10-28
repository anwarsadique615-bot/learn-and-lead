(() => {
  'use strict';
  const root = document.body;
  const listeners = new AbortController();
  const { signal } = listeners;
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  function closeMenu() { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); nav.classList.remove('open'); }
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); nav.classList.toggle('open', open); }, { signal });
  nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); }, { signal });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); }, { signal });
  const mobileQuery = matchMedia('(max-width:600px)');
  mobileQuery.addEventListener('change', closeMenu, { signal });

  const sections = document.querySelectorAll('main section[id]');
  const sectionObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visible.length) document.querySelectorAll('.nav a').forEach(a => {
      const active = a.getAttribute('href') === '#' + visible[0].target.id;
      a.classList.toggle('active', active);
      if (active) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
    });
  }, { rootMargin: '-15% 0px -45% 0px', threshold: 0 });
  sections.forEach(s => sectionObserver.observe(s));

  const tabs = [...document.querySelectorAll('[data-filter]')];
  function chooseTab(tab, focus = false) {
    tabs.forEach(t => { const active = t === tab; t.classList.toggle('selected', active); t.setAttribute('aria-selected', String(active)); t.tabIndex = active ? 0 : -1; });
    document.querySelectorAll('[data-category]').forEach(course => { course.hidden = tab.dataset.filter !== 'all' && course.dataset.category !== tab.dataset.filter; });
    document.querySelector('#course-panel').setAttribute('aria-labelledby', tab.id);
    if (focus) tab.focus();
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => chooseTab(tab), { signal });
    tab.addEventListener('keydown', e => { let next = i; if (e.key === 'ArrowRight') next = (i + 1) % tabs.length; else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length; else if (e.key === 'Home') next = 0; else if (e.key === 'End') next = tabs.length - 1; else return; e.preventDefault(); chooseTab(tabs[next], true); }, { signal });
  });

  const details = {
    invoicing: { title: 'E-invoicing, made simpler.', description: 'Prepare your business for e-invoicing with practical guidance and coordinated implementation support.', items: ['Business readiness assessment', 'Invoice mapping and workflow review', 'ASP coordination', 'Staff training and compliance support'], interest: 'E-invoicing solutions' },
    systems: { title: 'A better-connected business.', description: 'Bring everyday operations together with ERP and POS solutions shaped around the needs of small and medium businesses.', items: ['Billing and inventory systems', 'Retail point of sale', 'Restaurant point of sale', 'Practical system implementation and support'], interest: 'ERP & POS systems' }
  };
  const serviceDialog = document.querySelector('.service-dialog');
  const interest = document.querySelector('#interest');
  let lastTrigger;
  function openDialog(dialog, trigger) { lastTrigger = trigger; dialog.showModal(); root.classList.add('dialog-open'); }
  document.querySelectorAll('[data-service]').forEach(button => button.addEventListener('click', () => {
    const detail = details[button.dataset.service];
    document.querySelector('#dialog-title').textContent = detail.title;
    document.querySelector('#dialog-description').textContent = detail.description;
    const list = document.querySelector('#dialog-list'); list.replaceChildren();
    detail.items.forEach(text => { const li = document.createElement('li'); li.textContent = text; list.append(li); });
    interest.value = detail.interest;
    openDialog(serviceDialog, button);
  }, { signal }));
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close(), { signal });
    dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } }, { signal });
    dialog.addEventListener('close', () => { root.classList.remove('dialog-open'); lastTrigger?.focus(); }, { signal });
  });
  document.querySelector('.dialog-enquire').addEventListener('click', () => serviceDialog.close(), { signal });
  document.querySelectorAll('[data-course]').forEach(course => course.addEventListener('click', () => { interest.value = course.dataset.course; }, { signal }));
  document.querySelector('.inquiry-form').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.querySelector('#name').value.trim();
    const goal = document.querySelector('#message').value.trim();
    if (!name || !goal) { const field = document.querySelector(!name ? '#name' : '#message'); field.setCustomValidity('Please enter a little more detail.'); field.reportValidity(); field.addEventListener('input', () => field.setCustomValidity(''), { once: true, signal }); return; }
    const message = `Hello Learn & Lead,\n\nMy name is ${name}.\nI’m interested in: ${interest.value}.\n\n${goal}`;
    document.querySelector('#message-preview').textContent = message;
    document.querySelector('#whatsapp-draft').href = 'https://wa.me/971561524950?text=' + encodeURIComponent(message);
    openDialog(document.querySelector('.message-dialog'), e.submitter);
  }, { signal });

  // Content remains readable if scripts fail or a visitor opts out of motion.
  let media;
  function mountMotion() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    media = gsap.matchMedia();
    media.add({ desktop: '(min-width:801px)', mobile: '(max-width:800px)', reduce: '(prefers-reduced-motion:reduce)' }, context => {
      if (context.conditions.reduce) return;
      const intro = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
      intro.from('.hero .eyebrow', { y: 15, opacity: 0, duration: .7 })
        .from('.title-line', { y: 45, opacity: 0, stagger: .12 }, '-=.4')
        .from('.hero p, .hero-actions', { y: 20, opacity: 0, stagger: .12, duration: .8 }, '-=.65')
        .from('.hero-note, .photo-caption, .scroll-cue, .hero-bottom', { opacity: 0, duration: .8 }, '-=.5');
      gsap.utils.toArray('.reveal').forEach(element => {
        gsap.from(element, { y: context.conditions.desktop ? 34 : 20, opacity: 0, duration: .8, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 92%', toggleActions: 'play none none reverse' } });
      });
      if (context.conditions.desktop) gsap.to('.hero-photo', { y: 90, scale: 1.06, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
    }, root);
    document.fonts.ready.then(() => { if (media) ScrollTrigger.refresh(); });
  }
  mountMotion();
  // A bfcache return remounts only motion; normal controls retain their listeners.
  window.addEventListener('pagehide', e => { media?.revert(); media = null; if (!e.persisted) { listeners.abort(); sectionObserver.disconnect(); } });
  window.addEventListener('pageshow', e => { if (e.persisted) mountMotion(); });
})();
