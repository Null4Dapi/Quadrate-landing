(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const smooth = v => { const x = clamp(v); return x * x * (3 - 2 * x); };
  const config = window.PARKGO_CONFIG;
  const journey = $('.journey');
  const stage = $('#journey-stage');
  const scenes = $$('.scene');
  const stories = $$('.story');
  const rail = $$('.rail-button');
  const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const smallQuery = matchMedia('(max-width: 760px)');
  let reduced = reducedQuery.matches;
  let active = -1;
  let framePending = false;
  let journeyStart = 0;
  let journeyDistance = 1;
  let latestProgress = 0;
  let destroyed = false;
  const videos = [];
  const motionToggle = $('#motion-toggle');

  function applyMotion() {
    document.body.classList.toggle('motion-reduced', reduced);
    document.documentElement.style.scrollBehavior = reduced ? 'auto' : '';
    motionToggle.setAttribute('aria-pressed', String(reduced));
    motionToggle.setAttribute('aria-label', reduced ? 'Activar las animaciones' : 'Reducir las animaciones');
    $('.motion-toggle > span').textContent = reduced ? 'Movimiento reducido' : 'Movimiento';
    requestFrame();
  }
  motionToggle.addEventListener('click', () => { reduced = !reduced; applyMotion(); });
  reducedQuery.addEventListener('change', e => { reduced = e.matches; applyMotion(); });

  function measure() {
    const rect = journey.getBoundingClientRect();
    journeyStart = rect.top + window.scrollY;
    journeyDistance = Math.max(1, journey.offsetHeight - stage.offsetHeight);
    requestFrame();
  }

  function render() {
    framePending = false;
    const p = clamp((window.scrollY - journeyStart) / journeyDistance);
    latestProgress = p;
    const position = p * 3.999;
    const current = Math.min(3, Math.floor(position));
    const local = position - current;
    const transition = reduced ? (local > .94 ? 1 : 0) : smooth((local - .78) / .22);
    const next = Math.min(3, current + 1);
    $('#journey-progress').style.transform = `scaleX(${p})`;
    const textScene = transition > .5 ? next : current;
    if (active !== textScene) {
      active = textScene;
      stories.forEach((story, i) => {
        const chosen = i === active;
        story.classList.toggle('is-active', chosen);
        story.setAttribute('aria-hidden', String(!chosen));
        story.inert = !chosen;
      });
      rail.forEach((button, i) => {
        button.classList.toggle('active', i === active);
        if (i === active) button.setAttribute('aria-current', 'step');
        else button.removeAttribute('aria-current');
      });
      $('#scene-counter').textContent = String(active + 1).padStart(2, '0');
      $('#scroll-hint').dataset.goto = String(Math.min(3, active + 1));
    }
    scenes.forEach((scene, i) => {
      const visible = i === current || (transition > 0 && i === next);
      scene.style.visibility = visible ? 'visible' : 'hidden';
      const opacity = i === current ? 1 : i === next ? transition : 0;
      scene.style.opacity = String(opacity);
      if (visible) {
        const phase = i === current ? local : 0;
        const data = config.scenes[i];
        const scale = reduced ? 1.04 : 1.04 + (data.scale - 1.04) * phase;
        const move = reduced ? 0 : (phase - .5) * data.x;
        const img = $('img', scene);
        img.style.transform = `scale(${scale.toFixed(4)}) translate3d(${move.toFixed(3)}%,${reduced ? 0 : (-phase * 1.2).toFixed(3)}%,0)`;
        const video = videos[i];
        if (video && video.readyState >= 2 && Number.isFinite(video.duration) && !reduced) {
          const target = clamp(phase) * Math.max(0, video.duration - .045);
          video._target = target;
          if (!video.seeking && Math.abs(video.currentTime - target) > .018) video.currentTime = target;
        }
        scene.classList.toggle('has-video', Boolean(video && video.readyState >= 2 && !reduced));
      }
    });
    const fade = current === 3 || reduced ? 1 : 1 - Math.sin(transition * Math.PI) * .9;
    const activeStory = stories[active];
    activeStory.style.opacity = String(fade);
    activeStory.style.transform = smallQuery.matches ? `translateY(${reduced ? 0 : (1 - fade) * 15}px)` : `translateY(calc(-40% + ${reduced ? 0 : (1 - fade) * 15}px))`;
    $('#header').classList.toggle('scrolled', window.scrollY > 75);
  }
  function requestFrame() {
    if (!framePending && !destroyed) { framePending = true; requestAnimationFrame(render); }
  }
  window.addEventListener('scroll', requestFrame, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  window.addEventListener('pageshow', measure);
  smallQuery.addEventListener('change', measure);
  new ResizeObserver(measure).observe(journey);
  config.scenes.forEach((scene, i) => scenes[i].style.setProperty('--focus', `${scene.focus}%`));

  function goToScene(index) {
    const safe = clamp(Number(index), 0, 3);
    if (safe === 3 && latestProgress > .98) { $('#conductores').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); return; }
    const offset = safe === 0 ? 0 : safe + .12;
    window.scrollTo({ top: journeyStart + journeyDistance * offset / 4, behavior: reduced ? 'auto' : 'smooth' });
  }
  $$('[data-goto]').forEach(button => button.addEventListener('click', () => {
    if (button.id === 'scroll-hint' && active === 3) $('#conductores').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    else goToScene(button.dataset.goto);
  }));

  // Optional footage is loaded locally, sequentially, and scrubbed in both directions.
  // The included image sequence does not require video or an external service.
  async function loadVideos() {
    if (reduced || navigator.connection?.saveData) return;
    for (let i = 0; i < config.scenes.length; i++) {
      const src = config.scenes[i].video;
      if (!src) continue;
      const video = $('video', scenes[i]);
      videos[i] = video;
      video.preload = 'auto';
      try {
        const response = await fetch(src);
        if (!response.ok) throw new Error('Video unavailable');
        video.src = URL.createObjectURL(await response.blob());
        await new Promise((resolve, reject) => {
          video.addEventListener('loadeddata', resolve, { once: true });
          video.addEventListener('error', reject, { once: true });
          video.load();
        });
        await video.play().catch(() => {}); video.pause();
        video.addEventListener('seeked', () => {
          if (typeof video._target === 'number' && Math.abs(video.currentTime - video._target) > .03 && !video.seeking) video.currentTime = video._target;
        });
        requestFrame();
      } catch { videos[i] = null; }
    }
  }
  window.addEventListener('pagehide', () => {
    destroyed = true;
    videos.forEach(video => { if (video?.src.startsWith('blob:')) URL.revokeObjectURL(video.src); });
  });
  window.addEventListener('pageshow', () => { destroyed = false; requestFrame(); });

  const nav = $('#mobile-nav');
  const menu = $('#menu-toggle');
  function closeMenu() { nav.hidden = true; menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Abrir menú'); }
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; nav.hidden = !open; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); });
  $$('a', nav).forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !nav.hidden) { closeMenu(); menu.focus(); } });
  document.addEventListener('click', e => { if (!nav.hidden && !nav.contains(e.target) && !menu.contains(e.target)) closeMenu(); });
  smallQuery.addEventListener('change', e => { if (!e.matches) closeMenu(); });

  let role = 'driver';
  const tabs = $$('[data-role]');
  function setRole(value, focus = false) {
    role = value === 'owner' ? 'owner' : 'driver';
    tabs.forEach(tab => { const chosen = tab.dataset.role === role; tab.setAttribute('aria-selected', String(chosen)); tab.tabIndex = chosen ? 0 : -1; if (chosen && focus) tab.focus(); });
    $('#driver-panel').hidden = role !== 'driver';
    $('#owner-panel').hidden = role !== 'owner';
    $('#phone-driver').hidden = role !== 'driver';
    $('#phone-owner').hidden = role !== 'owner';
    $('#floating-note b').textContent = role === 'driver' ? 'Tu lugar está cerca.' : 'Tu espacio, en el mapa.';
    $('#floating-note small').textContent = role === 'driver' ? 'Descubre la experiencia ParkGO' : 'Conecta con tu próxima llegada';
  }
  tabs.forEach(tab => tab.addEventListener('click', () => setRole(tab.dataset.role)));
  $('.role-tabs').addEventListener('keydown', e => {
    if (['ArrowRight','ArrowLeft','Home','End'].includes(e.key)) { e.preventDefault(); setRole(e.key === 'Home' ? 'driver' : e.key === 'End' ? 'owner' : role === 'driver' ? 'owner' : 'driver', true); }
  });
  $$('[data-role-link]').forEach(link => link.addEventListener('click', () => setRole(link.dataset.roleLink)));

  let step = 0;
  let selectedParking = 1;
  let destination = '';
  const parkingNames = ['Estacionamiento A', 'Estacionamiento B', 'Estacionamiento C'];
  const greetings = ['TU PRÓXIMO DESTINO','TUS OPCIONES CERCA','TU PRÓXIMA LLEGADA'];
  const phoneTitles = ['¿Dónde estacionamos?','Un lugar para tu plan.','Llegar se siente bien.'];
  function setStep(value) {
    step = clamp(value, 0, 2);
    $$('.tour-step').forEach((button, i) => { button.classList.toggle('active', i === step); button.setAttribute('aria-pressed', String(i === step)); });
    $('#phone-greeting').textContent = greetings[step];
    $('#phone-title').textContent = phoneTitles[step];
    $('.map-viewport').classList.toggle('route-active', step === 2);
    $('#parking-name').textContent = step === 0 ? 'Un lugar cerca de ti' : parkingNames[selectedParking];
    $('#parking-detail').textContent = step === 0 ? 'Elige un punto en el mapa para explorar.' : step === 1 ? (destination ? `Cerca de ${destination} · ejemplo` : 'Ubicación y disponibilidad · ejemplo') : 'Recorrido ilustrativo hacia tu espacio.';
    $('#parking-action').replaceChildren(document.createTextNode(step === 2 ? 'Volver a explorar ' : step === 1 ? 'Ver llegada ' : 'Ver estacionamiento '));
    const arrow = document.createElement('span'); arrow.textContent = step === 2 ? '↺' : '↗'; $('#parking-action').append(arrow);
  }
  $$('.tour-step').forEach(button => button.addEventListener('click', () => setStep(Number(button.dataset.step))));
  $$('.map-pin').forEach(button => button.addEventListener('click', () => {
    selectedParking = Number(button.dataset.parking);
    $$('.map-pin').forEach(pin => pin.classList.toggle('selected', pin === button));
    setStep(1);
  }));
  $('#parking-action').addEventListener('click', () => setStep((step + 1) % 3));
  $('#demo-search').addEventListener('submit', e => {
    e.preventDefault(); destination = $('#destination').value.trim();
    if (!destination) { $('#destination').focus(); notify('Escribe un destino para probar la búsqueda.'); return; }
    setStep(1); notify(`Vista ilustrativa para «${destination}».`);
  });
  $('#spaces-range').addEventListener('input', e => { $('#space-count').textContent = e.target.value; });
  $('#owner-visibility').addEventListener('click', e => {
    const button = e.currentTarget;
    const on = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(on));
    button.replaceChildren(document.createTextNode(on ? 'Visible en el mapa ' : 'Publicación en pausa '));
    const mark = document.createElement('span'); mark.textContent = on ? '✓' : '−'; button.append(mark);
    $('#owner-status').textContent = on ? 'Visible' : 'En pausa';
    notify(on ? 'Demostración: tu espacio aparece en el mapa.' : 'Demostración: la publicación está en pausa.');
  });
  let toastTimeout;
  function notify(message) { const toast = $('#toast'); clearTimeout(toastTimeout); toast.textContent = message; toast.classList.add('show'); toastTimeout = setTimeout(() => toast.classList.remove('show'), 4200); }
  const dialog = $('#info-dialog');
  $$('[data-info]').forEach(button => button.addEventListener('click', () => dialog.showModal()));
  $('#dialog-close').addEventListener('click', () => dialog.close());
  $('#dialog-done').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }); }, { threshold: .12 });
    $$('.reveal').forEach(el => observer.observe(el));
    document.body.classList.add('js-ready');
  }
  applyMotion(); measure(); loadVideos();
  if (document.fonts?.ready) document.fonts.ready.then(measure);
})();
