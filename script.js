/**
 * SENIOR CREATIVE DEVELOPER PORTFOLIO - SIVASANKAR A
 * Vanilla JavaScript Core Engine: Cursor Lerp, Parallax, Filtering & Scroll Telemetry
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     01 — SCROLL PROGRESS INDICATOR BAR
     ========================================================================== */
  const progressBar = document.getElementById('scroll-progress-bar');
  
  function updateScrollProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${scrollPercent}%`;
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });


  /* ==========================================================================
     02 — NAVIGATION HEADER SCROLL STATE & ACTIVE LINK
     ========================================================================== */
  const header = document.getElementById('site-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function handleHeaderScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active link detection
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });


  /* ==========================================================================
     03 — MOBILE HAMBURGER MENU OVERLAY
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileMenu) {
    function toggleMobileMenu() {
      const isOpen = mobileMenu.classList.contains('active');
      mobileMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', !isOpen);
      document.body.style.overflow = !isOpen ? 'hidden' : '';
    }

    mobileToggle.addEventListener('click', toggleMobileMenu);

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileMenu.classList.contains('active')) {
          toggleMobileMenu();
        }
      });
    });
  }


  /* ==========================================================================
     04 — CUSTOM CURSOR WITH LERP INTERPOLATION (Desktop Only)
     ========================================================================== */
  const cursorDot = document.getElementById('custom-cursor-dot');
  const cursorFollower = document.getElementById('custom-cursor-follower');
  const cursorText = document.getElementById('cursor-text');

  // Check touch capabilities
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 768;

  if (!isTouchDevice && cursorDot && cursorFollower) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;
    const lerpFactor = 0.15; // Smooth delay coefficient

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Instant dot placement
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }, { passive: true });

    function animateCursor() {
      // Lerp follower coordinates
      followerX += (mouseX - followerX) * lerpFactor;
      followerY += (mouseY - followerY) * lerpFactor;

      cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    // Hover interactions
    const interactiveElements = document.querySelectorAll('a, button, input, .magnetic-btn, .skill-tag, .filter-btn');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorFollower.classList.add('cursor-expanded');
      });
      el.addEventListener('mouseleave', () => {
        cursorFollower.classList.remove('cursor-expanded');
      });
    });

    // Project card cursor text interaction
    const projectCards = document.querySelectorAll('[data-cursor-text]');
    projectCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        const text = card.getAttribute('data-cursor-text') || 'VIEW PROJECT ↗';
        if (cursorText) cursorText.textContent = text;
        cursorFollower.classList.add('cursor-project-mode');
      });
      card.addEventListener('mouseleave', () => {
        cursorFollower.classList.remove('cursor-project-mode');
        if (cursorText) cursorText.textContent = '';
      });
    });

    /* Magnetic Buttons Effect */
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const btnX = e.clientX - rect.left - rect.width / 2;
        const btnY = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate3d(${btnX * 0.2}px, ${btnY * 0.2}px, 0)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate3d(0, 0, 0)';
      });
    });

  } else if (cursorDot && cursorFollower) {
    cursorDot.style.display = 'none';
    cursorFollower.style.display = 'none';
  }


  /* ==========================================================================
     05 — HERO SCROLL & MOUSE 3D PARALLAX TILT EXPERIENCE
     ========================================================================== */
  const heroSection = document.getElementById('hero');
  const heroHeading = document.getElementById('hero-heading');
  const heroPara = document.getElementById('hero-para');
  const heroPortrait = document.getElementById('hero-portrait-container');
  const heroBgText = document.getElementById('hero-bg-text');

  // Mouse 3D Tilt Parallax
  if (heroSection && heroPortrait && !isTouchDevice) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const tiltX = y * -12; // 12deg tilt
      const tiltY = x * 12;

      heroPortrait.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      heroPortrait.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
    });
  }

  function handleHeroParallax() {
    if (!heroSection) return;

    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight;

    if (scrollY <= heroHeight) {
      const scrollRatio = scrollY / heroHeight;

      // Parallax offsets
      if (heroHeading) {
        heroHeading.style.transform = `translate3d(0, ${scrollY * -0.25}px, 0)`;
        heroHeading.style.opacity = `${1 - scrollRatio * 1.2}`;
      }

      if (heroPara) {
        heroPara.style.transform = `translate3d(0, ${scrollY * -0.4}px, 0)`;
        heroPara.style.opacity = `${1 - scrollRatio * 1.4}`;
      }

      // At 70-90% scroll through hero: display subtle BUILD RANK GROW text
      if (heroBgText) {
        if (scrollRatio >= 0.3) {
          heroBgText.style.opacity = Math.min(0.06, (scrollRatio - 0.3) * 0.1);
        } else {
          heroBgText.style.opacity = 0.025;
        }
      }
    }
  }

  window.addEventListener('scroll', handleHeroParallax, { passive: true });


  /* ==========================================================================
     06 — ABOUT PORTRAIT IMAGE REVEAL & PARALLAX
     ========================================================================== */
  const aboutPortraitFrame = document.getElementById('about-portrait-frame');

  if (aboutPortraitFrame) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          aboutPortraitFrame.classList.add('in-view');
        }
      });
    }, { threshold: 0.25 });

    observer.observe(aboutPortraitFrame);
  }


  /* ==========================================================================
     07 — WORK FILTERING SYSTEM
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';

        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hide');
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        } else {
          card.classList.add('hide');
        }
      });
    });
  });


  /* ==========================================================================
     08 — INTERSECTION OBSERVER FOR SCROLL REVEALS
     ========================================================================== */
  const revealElements = document.querySelectorAll('.flow-step, .seo-card, .timeline-item, .process-step-item, .landing-card');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
    revealObserver.observe(el);
  });

});
