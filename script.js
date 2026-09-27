/* Core interactions work independently of optional animation libraries. */
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 768px)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const canAnimate = () => !reducedMotion.matches && typeof window.anime === 'function';
  const animated = new Set();
  function animate(options) {
    if (!canAnimate()) return;
    const targets = typeof options.targets === 'string'
      ? document.querySelectorAll(options.targets)
      : options.targets instanceof Element ? [options.targets] : options.targets;
    for (const element of targets) animated.add(element);
    return window.anime(options);
  }

  window.lucide?.createIcons();
  document.querySelectorAll('[data-lucide]').forEach(icon => icon.setAttribute('aria-hidden', 'true'));

  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  const links = [...document.querySelectorAll('.nav-link')];
  const sections = [...document.querySelectorAll('section[id]')];
  const backToTop = document.getElementById('backToTop');
  const behavior = () => reducedMotion.matches ? 'auto' : 'smooth';

  function setMenu(open, restoreFocus = false) {
    const expanded = mobile.matches && open;
    toggle.classList.toggle('active', expanded);
    menu.classList.toggle('open', expanded);
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.setAttribute('aria-label', expanded ? 'ปิดเมนู' : 'เปิดเมนู');
    if (restoreFocus) toggle.focus();
    menu.inert = mobile.matches && !expanded;
  }
  setMenu(false);
  toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  mobile.addEventListener('change', () => setMenu(false));
  document.addEventListener('click', event => {
    if (!navbar.contains(event.target)) setMenu(false);
  });
  navbar.addEventListener('focusout', event => {
    if (!navbar.contains(event.relatedTarget)) setMenu(false);
  });

  function updateScroll() {
    navbar.classList.toggle('scrolled', scrollY > 50);
    backToTop.classList.toggle('visible', scrollY > 400);
    const current = [...sections].reverse().find(section => section.offsetTop <= scrollY + 120);
    links.forEach(link => {
      const active = link.hash === '#' + current?.id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  let scrollPending = false;
  window.addEventListener('scroll', () => {
    if (scrollPending) return;
    scrollPending = true;
    requestAnimationFrame(() => {
      updateScroll();
      scrollPending = false;
    });
  }, { passive: true });
  updateScroll();
  backToTop.addEventListener('click', () => {
    document.querySelector('.nav-logo').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: behavior() });
  });
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
      const id = anchor.getAttribute('href').slice(1);
      const target = id && document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      // Move focus out before making the closed mobile menu inert.
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      setMenu(false);
      target.scrollIntoView({ behavior: behavior(), block: 'start' });
      if (location.hash !== '#' + id) history.pushState(null, '', '#' + id);
    });
  });

  const modal = document.getElementById('projectPreviewModal');
  const previewImage = document.getElementById('projectPreviewImage');
  const previewTitle = document.getElementById('projectPreviewTitle');
  const closeButton = modal.querySelector('.project-modal-close');
  const backgroundState = new Map();
  let previewTrigger = null;
  function closePreview() {
    if (!modal.classList.contains('open')) return;
    backgroundState.forEach((inert, element) => { element.inert = inert; });
    backgroundState.clear();
    previewTrigger?.focus({ preventScroll: true });
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }
  document.querySelectorAll('[data-project-preview-trigger]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const card = trigger.closest('.project-card');
      if (!card?.dataset.previewImage) return;
      previewTrigger = trigger;
      previewImage.src = card.dataset.previewImage;
      previewImage.alt = card.dataset.previewTitle + ' project preview';
      previewTitle.textContent = card.dataset.previewTitle;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
      closeButton.focus();
      [...document.body.children]
        .filter(element => element !== modal && element.tagName !== 'SCRIPT')
        .forEach(element => {
          backgroundState.set(element, element.inert);
          element.inert = true;
        });
    });
  });
  modal.addEventListener('click', event => {
    if (event.target.closest('[data-project-modal-close]')) closePreview();
  });
  document.addEventListener('keydown', event => {
    if (modal.classList.contains('open')) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closePreview();
      } else if (event.key === 'Tab') {
        const controls = [...modal.querySelectorAll('button, a[href], [tabindex="0"]')]
          .filter(element => !element.disabled && element.getClientRects().length);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (!modal.contains(document.activeElement)) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    } else if (event.key === 'Escape' && menu.classList.contains('open')) {
      setMenu(false, true);
    }
  });

  // Immediate visibility avoids stale animation callbacks during rapid filtering.
  const filters = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  filters.forEach(button => {
    button.addEventListener('click', () => {
      filters.forEach(item => {
        item.classList.toggle('active', item === button);
        item.setAttribute('aria-pressed', String(item === button));
      });
      cards.forEach(card => {
        window.anime?.remove(card);
        card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
        card.style.removeProperty('opacity');
        card.style.removeProperty('transform');
        if (!card.hidden) animate({ targets: card, opacity: [0, 1], translateY: [20, 0], duration: 400, easing: 'easeOutExpo' });
      });
      updateScroll();
    });
  });

  const form = document.getElementById('contactForm');
  const status = document.getElementById('contactStatus');
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (form.getAttribute('aria-busy') === 'true') return;
    const button = form.querySelector('button[type="submit"]');
    const originalLabel = button.innerHTML;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    form.setAttribute('aria-busy', 'true');
    button.disabled = true;
    button.textContent = 'กำลังส่งข้อความ...';
    status.textContent = 'กำลังส่งข้อความ...';
    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('Form submission failed');
      status.textContent = 'ส่งข้อความเรียบร้อยแล้ว ขอบคุณที่ติดต่อครับ';
      form.reset();
    } catch (error) {
      status.textContent = error.name === 'AbortError'
        ? 'การเชื่อมต่อใช้เวลานาน ยังยืนยันการส่งไม่ได้ กรุณาลองใหม่หรือติดต่อทางอีเมล'
        : 'ส่งไม่สำเร็จ ข้อความของคุณยังอยู่ กรุณาลองใหม่หรือติดต่อทางอีเมล';
    } finally {
      clearTimeout(timeout);
      button.innerHTML = originalLabel;
      button.disabled = false;
      form.setAttribute('aria-busy', 'false');
    }
  });

  // Everything stays readable without JavaScript or third-party animation scripts.
  const bars = document.querySelectorAll('.skill-progress');
  bars.forEach(bar => { bar.style.width = bar.dataset.width + '%'; });
  const glow = document.getElementById('cursorGlow');
  document.addEventListener('mousemove', event => {
    if (!reducedMotion.matches && pointer.matches) {
      glow.style.left = event.clientX + 'px';
      glow.style.top = event.clientY + 'px';
    }
  }, { passive: true });
  document.querySelectorAll('.btn-primary').forEach(button => {
    button.addEventListener('mousemove', event => {
      if (reducedMotion.matches || !pointer.matches || button.disabled) return;
      window.anime?.remove(button);
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = 'translate(' + x * 0.1 + 'px, ' + y * 0.1 + 'px)';
      animated.add(button);
    });
    button.addEventListener('mouseleave', () => {
      if (canAnimate()) animate({ targets: button, translateX: 0, translateY: 0, duration: 400, easing: 'easeOutElastic(1, .5)' });
      else button.style.removeProperty('transform');
    });
  });

  const typing = document.getElementById('typingText');
  const titles = ['IT Support', 'Backend Developer', 'UI/UX Designer', 'Project Manager'];
  let typingTimer;
  let titleIndex = 0;
  let characterIndex = 0;
  let deleting = false;
  function typeWriter() {
    if (reducedMotion.matches) return;
    const title = titles[titleIndex];
    characterIndex += deleting ? -1 : 1;
    typing.textContent = title.slice(0, characterIndex);
    let delay = deleting ? 40 : 80;
    if (characterIndex === title.length) { deleting = true; delay = 2000; }
    else if (characterIndex === 0) { deleting = false; titleIndex = (titleIndex + 1) % titles.length; }
    typingTimer = setTimeout(typeWriter, delay);
  }
  if (!reducedMotion.matches) typingTimer = setTimeout(typeWriter, 1500);
  reducedMotion.addEventListener('change', () => {
    clearTimeout(typingTimer);
    typing.textContent = 'IT Support';
    if (reducedMotion.matches) {
      window.anime?.remove([...animated]);
      animated.forEach(element => {
        element.style.removeProperty('opacity');
        element.style.removeProperty('transform');
      });
      document.getElementById('heroParticles').replaceChildren();
      document.querySelectorAll('.stat-number').forEach(stat => { stat.textContent = stat.dataset.target; });
      bars.forEach(bar => { bar.style.width = bar.dataset.width + '%'; });
    }
  });

  if (!canAnimate()) return;
  animate({
    targets: '.hero-greeting, .hero-name, .hero-title-wrapper, .hero-description, .hero-cta, .hero-social, .hero-visual, .scroll-indicator',
    opacity: [0, 1], translateY: [30, 0], duration: 900,
    delay: window.anime.stagger(100), easing: 'easeOutExpo',
  });
  function observeOnce(elements, callback) {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!entry.target.hidden) callback(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    elements.forEach(element => observer.observe(element));
  }
  observeOnce(document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .section-header'), element => {
    animate({ targets: element, opacity: [0, 1], translateY: [25, 0], duration: 700, easing: 'easeOutExpo' });
  });
  observeOnce(document.querySelectorAll('.stat-number'), stat => {
    animate({ targets: stat, innerHTML: [0, Number(stat.dataset.target)], round: 1, duration: 1600, easing: 'easeInOutExpo' });
  });
  observeOnce(bars, bar => {
    animate({ targets: bar, width: ['0%', bar.dataset.width + '%'], duration: 1200, easing: 'easeInOutQuart' });
  });
  const particles = document.getElementById('heroParticles');
  for (let i = 0; i < (pointer.matches ? 30 : 10); i++) {
    const particle = document.createElement('span');
    particle.className = 'hero-particle';
    particle.style.left = window.anime.random(0, 100) + '%';
    particle.style.top = window.anime.random(0, 100) + '%';
    particle.style.width = window.anime.random(3, 8) + 'px';
    particle.style.height = particle.style.width;
    particles.appendChild(particle);
    animate({ targets: particle, translateX: () => window.anime.random(-80, 80), translateY: () => window.anime.random(-80, 80), opacity: [0.2, 0.6], duration: window.anime.random(4000, 8000), direction: 'alternate', loop: true, easing: 'easeInOutSine' });
  }
});
