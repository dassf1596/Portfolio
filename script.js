/* ========================================
   PORTFOLIO JAVASCRIPT — Powered by Anime.js
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  lucide.createIcons();

  // ============ CURSOR GLOW ============
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    });
  }

  // ============ NAVBAR ============
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button
    const backToTop = document.getElementById('backToTop');
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Active nav link
    updateActiveNav();
  });

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });

  // Active nav link based on scroll position
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Back to top
  document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ============ HERO ANIMATIONS (Anime.js) ============
  const heroTimeline = anime.timeline({
    easing: 'easeOutExpo',
  });

  heroTimeline
    .add({
      targets: '.hero-greeting',
      translateY: [40, 0],
      opacity: [0, 1],
      duration: 800,
    })
    .add({
      targets: '.hero-name .name-first',
      translateY: [60, 0],
      opacity: [0, 1],
      duration: 1000,
    }, '-=500')
    .add({
      targets: '.hero-name .name-last',
      translateY: [60, 0],
      opacity: [0, 1],
      duration: 1000,
    }, '-=700')
    .add({
      targets: '.hero-title-wrapper',
      translateY: [40, 0],
      opacity: [0, 1],
      duration: 800,
    }, '-=600')
    .add({
      targets: '.hero-description',
      translateY: [40, 0],
      opacity: [0, 1],
      duration: 800,
    }, '-=500')
    .add({
      targets: '.hero-cta',
      translateY: [40, 0],
      opacity: [0, 1],
      duration: 800,
    }, '-=500')
    .add({
      targets: '.hero-social',
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 800,
    }, '-=500')
    .add({
      targets: '.hero-visual',
      translateY: [60, 0],
      opacity: [0, 1],
      scale: [0.9, 1],
      duration: 1200,
    }, '-=1000')
    .add({
      targets: '.scroll-indicator',
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 600,
    }, '-=400');

  // ============ TYPING EFFECT ============
  const typingTexts = [
    'IT Support',
    'Backend Developer',
    'UI/UX Designer',
    'Project Manager'
  ];

  let typingIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingElement = document.getElementById('typingText');

  function typeWriter() {
    const currentText = typingTexts[typingIndex];

    if (!isDeleting) {
      typingElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentText.length) {
        isDeleting = true;
        setTimeout(typeWriter, 2000); // Pause before deleting
        return;
      }
    } else {
      typingElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        typingIndex = (typingIndex + 1) % typingTexts.length;
      }
    }

    const speed = isDeleting ? 40 : 80;
    setTimeout(typeWriter, speed);
  }

  setTimeout(typeWriter, 1500);

  // ============ STAT COUNTER (Anime.js) ============
  const statNumbers = document.querySelectorAll('.stat-number');

  function animateStats() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'));
      anime({
        targets: stat,
        innerHTML: [0, target],
        round: 1,
        easing: 'easeInOutExpo',
        duration: 2000,
      });
    });
  }

  // Trigger on scroll into view
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStats();
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  // ============ HERO PARTICLES ============
  function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container || window.innerWidth <= 768) return;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 1}px;
        height: ${Math.random() * 4 + 1}px;
        background: rgba(124, 92, 252, ${Math.random() * 0.4 + 0.1});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
      `;
      container.appendChild(particle);

      anime({
        targets: particle,
        translateX: () => anime.random(-100, 100),
        translateY: () => anime.random(-100, 100),
        scale: [1, anime.random(1, 2)],
        opacity: [{ value: 0.3 }, { value: 0.8 }, { value: 0.3 }],
        duration: anime.random(4000, 8000),
        easing: 'easeInOutSine',
        loop: true,
        direction: 'alternate',
        delay: anime.random(0, 2000),
      });
    }
  }

  createParticles();

  // ============ SCROLL REVEAL ============
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ============ SKILL BAR ANIMATION ============
  const skillBars = document.querySelectorAll('.skill-progress');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width');
        anime({
          targets: bar,
          width: width + '%',
          easing: 'easeInOutQuart',
          duration: 1500,
          delay: anime.random(200, 600),
        });
        skillObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  skillBars.forEach(bar => skillObserver.observe(bar));

  // ============ PROJECT FILTER ============
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const projectPreviewModal = document.getElementById('projectPreviewModal');
  const projectPreviewImage = document.getElementById('projectPreviewImage');
  const projectPreviewTitle = document.getElementById('projectPreviewTitle');
  const projectPreviewTriggers = document.querySelectorAll('[data-project-preview-trigger]');

  function openProjectPreview(card) {
    if (!projectPreviewModal || !projectPreviewImage || !projectPreviewTitle || !card) {
      return;
    }

    const previewImage = card.getAttribute('data-preview-image');
    const previewTitle = card.getAttribute('data-preview-title');

    if (!previewImage || !previewTitle) {
      return;
    }

    projectPreviewImage.src = previewImage;
    projectPreviewImage.alt = `${previewTitle} project preview`;
    projectPreviewTitle.textContent = previewTitle;
    projectPreviewModal.classList.add('open');
    projectPreviewModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }

  function closeProjectPreview() {
    if (!projectPreviewModal) {
      return;
    }

    projectPreviewModal.classList.remove('open');
    projectPreviewModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  projectPreviewTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const card = trigger.closest('.project-card');
      openProjectPreview(card);
    });
  });

  if (projectPreviewModal) {
    projectPreviewModal.addEventListener('click', (event) => {
      if (event.target.hasAttribute('data-project-modal-close')) {
        closeProjectPreview();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && projectPreviewModal?.classList.contains('open')) {
      closeProjectPreview();
    }
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          card.style.display = '';
          anime({
            targets: card,
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 500,
            easing: 'easeOutExpo',
          });
        } else {
          anime({
            targets: card,
            opacity: [1, 0],
            translateY: [0, 20],
            duration: 300,
            easing: 'easeInExpo',
            complete: () => {
              card.style.display = 'none';
            }
          });
        }
      });
    });
  });

  // ============ STAGGER ANIMATIONS on section headers ============
  const sectionHeaders = document.querySelectorAll('.section-header');

  const headerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const header = entry.target;

        anime({
          targets: header.querySelector('.section-index'),
          translateY: [20, 0],
          opacity: [0, 1],
          duration: 600,
          easing: 'easeOutExpo',
        });

        anime({
          targets: header.querySelector('.section-title'),
          translateY: [30, 0],
          opacity: [0, 1],
          duration: 800,
          delay: 200,
          easing: 'easeOutExpo',
        });

        anime({
          targets: header.querySelector('.section-subtitle'),
          translateY: [20, 0],
          opacity: [0, 1],
          duration: 600,
          delay: 400,
          easing: 'easeOutExpo',
        });

        headerObserver.unobserve(header);
      }
    });
  }, { threshold: 0.5 });

  sectionHeaders.forEach(header => {
    // Set initial state
    const children = header.querySelectorAll('.section-index, .section-title, .section-subtitle');
    children.forEach(child => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(20px)';
    });
    headerObserver.observe(header);
  });

  // ============ CHIP HOVER ANIMATION ============
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('mouseenter', () => {
      anime({
        targets: chip,
        scale: [1, 1.05],
        duration: 200,
        easing: 'easeOutExpo',
      });
    });

    chip.addEventListener('mouseleave', () => {
      anime({
        targets: chip,
        scale: [1.05, 1],
        duration: 200,
        easing: 'easeOutExpo',
      });
    });
  });

  // ============ CERT CARD STAGGER ============
  const certCards = document.querySelectorAll('.cert-card');

  const certObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        anime({
          targets: '.cert-card',
          translateY: [50, 0],
          opacity: [0, 1],
          delay: anime.stagger(100),
          duration: 800,
          easing: 'easeOutExpo',
        });
        certObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });

  if (certCards.length > 0) {
    certCards.forEach(card => {
      card.style.opacity = '0';
    });
    certObserver.observe(certCards[0]);
  }

  // ============ CONTACT FORM ============
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Button animation
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>ส่งข้อความสำเร็จ ✓</span>';
      submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';

      anime({
        targets: submitBtn,
        scale: [1, 1.05, 1],
        duration: 600,
        easing: 'easeInOutSine',
      });

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        contactForm.reset();
        lucide.createIcons();
      }, 3000);
    });
  }

  // ============ SMOOTH ANCHOR SCROLL ============
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ============ MAGNETIC BUTTON EFFECT ============
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 0;
      const y = e.clientY - rect.top - rect.height / 1;

      btn.style.transform = `translate(${x * 0.10}px, ${y * 0.0}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      anime({
        targets: btn,
        translateX: 0,
        translateY: 0,
        duration: 400,
        easing: 'easeOutElastic(1, .5)',
      });
    });
  });
});
