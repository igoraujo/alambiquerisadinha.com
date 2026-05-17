/* ============================================
   ALAMBIQUE RISADINHA — JavaScript Principal
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── AGE GATE ── */
  const ageGate = document.getElementById('ageGate');
  const ageYes  = document.getElementById('ageYes');
  const ageNo   = document.getElementById('ageNo');

  if (ageGate) {
    const verified = sessionStorage.getItem('ageVerified');
    if (verified) {
      ageGate.classList.add('hidden');
    } else {
      document.body.style.overflow = 'hidden';
    }

    if (ageYes) {
      ageYes.addEventListener('click', () => {
        sessionStorage.setItem('ageVerified', 'true');
        ageGate.style.opacity = '0';
        ageGate.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
          ageGate.classList.add('hidden');
          document.body.style.overflow = '';
        }, 500);
      });
    }

    if (ageNo) {
      ageNo.addEventListener('click', () => {
        window.location.href = 'https://www.google.com';
      });
    }
  }

  /* ── NAVBAR SCROLL ── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── HAMBURGER MENU ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    // Close on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      }
    });
  }

  /* ── ACTIVE NAV LINK ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.remove('active');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── HERO PARTICLES ── */
  const particlesContainer = document.getElementById('heroParticles');
  if (particlesContainer) {
    const count = 18;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      const size = Math.random() * 12 + 4;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        animation-duration: ${Math.random() * 8 + 6}s;
        animation-delay: ${Math.random() * 6}s;
        opacity: ${Math.random() * 0.5 + 0.1};
      `;
      particlesContainer.appendChild(p);
    }
  }

  /* ── SCROLL ANIMATIONS (AOS-like) ── */
  const animateEls = document.querySelectorAll('[data-aos]');
  if (animateEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-delay') || 0;
          setTimeout(() => {
            entry.target.classList.add('aos-visible');
          }, parseInt(delay));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    animateEls.forEach(el => observer.observe(el));
  }

  /* ── COUNTER ANIMATION ── */
  function animateCounter(el, target, duration = 2000) {
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('pt-BR');
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    let statsRan = false;
    const statsObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !statsRan) {
        statsRan = true;
        const items = document.querySelectorAll('.stat-item');
        items.forEach(item => {
          const target = parseInt(item.getAttribute('data-target'));
          const numEl  = item.querySelector('.stat-number');
          if (numEl && target) animateCounter(numEl, target);
        });
      }
    }, { threshold: 0.4 });
    statsObserver.observe(statsSection);
  }

  /* ── TESTIMONIALS SLIDER ── */
  const track  = document.getElementById('testimonialTrack');
  const dotsEl = document.getElementById('tDots');
  const prevBtn= document.getElementById('tPrev');
  const nextBtn= document.getElementById('tNext');

  if (track) {
    const cards = track.querySelectorAll('.testimonial-card');
    let current = 0;
    let autoTimer;

    // Create dots
    if (dotsEl) {
      cards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('t-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(dot);
      });
    }

    function goTo(idx) {
      current = (idx + cards.length) % cards.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dotsEl && dotsEl.querySelectorAll('.t-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function startAuto() {
      autoTimer = setInterval(() => goTo(current + 1), 5000);
    }
    function stopAuto() { clearInterval(autoTimer); }

    if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

    startAuto();
  }

  /* ── SMOOTH ANCHOR SCROLL ── */
  document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      const [page, hash] = href.split('#');
      const currentFile = window.location.pathname.split('/').pop();
      if ((!page || page === currentFile || page === '') && hash) {
        const target = document.getElementById(hash);
        if (target) {
          e.preventDefault();
          const offset = 80;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  /* ── CONTACT FORM ── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = this.querySelector('[type="submit"]');
      const success = document.getElementById('formSuccess');

      btn.disabled = true;
      btn.textContent = 'Enviando…';

      // Simulate send
      setTimeout(() => {
        contactForm.style.display = 'none';
        if (success) success.style.display = 'block';
      }, 1500);
    });
  }

  /* ── PRODUTO TABS (página produtos) ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        document.querySelectorAll('.product-detail-card').forEach(card => {
          if (filter === 'all' || card.getAttribute('data-product') === filter) {
            card.style.display = '';
            card.style.animation = 'fadeInUp 0.5s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ── PARALLAX HERO ── */
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const heroContent = hero.querySelector('.hero-content');
      if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.25}px)`;
        heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
      }
    }, { passive: true });
  }

  /* ── REVEAL ON SCROLL (generic) ── */
  const revealEls = document.querySelectorAll('.product-detail-card, .value-card, .timeline-item');
  if (revealEls.length) {
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      revealObs.observe(el);
    });
  }

  /* ── ANCHOR HIGHLIGHT on load (produtos.html#prata etc.) ── */
  if (window.location.hash) {
    setTimeout(() => {
      const el = document.querySelector(window.location.hash);
      if (el) {
        const offset = 100;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        el.style.outline = '2px solid var(--gold, #C9922A)';
        el.style.outlineOffset = '8px';
        setTimeout(() => { el.style.outline = ''; }, 2500);
      }
    }, 600);
  }

});
