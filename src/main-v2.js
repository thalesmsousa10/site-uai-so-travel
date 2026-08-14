import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initGlobe } from './globe.js';
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

  // ================================================================
  // 0. LENIS SCROLL & INICIALIZAR GLOBO 3D
  // ================================================================
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
  });
  
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  initGlobe();


  // ================================================================
  // 1. SISTEMA DE PARTÍCULAS DOURADAS (Hero Canvas)
  // ================================================================
  const particleCanvas = document.getElementById('heroParticles');
  if (particleCanvas) {
    const ctx = particleCanvas.getContext('2d');

    function resizeCanvas() {
      particleCanvas.width = window.innerWidth;
      particleCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const PARTICLE_COUNT = 60;
    const particles = [];

    class Particle {
      constructor() { this.reset(true); }

      reset(initialSpread = false) {
        this.x = Math.random() * particleCanvas.width;
        this.y = initialSpread
          ? Math.random() * particleCanvas.height
          : particleCanvas.height + 10;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = -(Math.random() * 0.35 + 0.1);
        this.opacity = Math.random() * 0.6 + 0.1;
        this.opacitySpeed = Math.random() * 0.006 + 0.002;
        this.opacityDir = 1;
        this.type = Math.random() < 0.05 ? 'plane' : 'dot';
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity += this.opacitySpeed * this.opacityDir;
        if (this.opacity >= 0.85 || this.opacity <= 0.05) this.opacityDir *= -1;
        if (this.y < -20 || this.x < -20 || this.x > particleCanvas.width + 20) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        if (this.type === 'plane') {
          ctx.fillStyle = 'rgba(255,168,0,0.95)';
          ctx.font = `${this.size * 7}px serif`;
          ctx.fillText('✈', this.x, this.y);
        } else {
          ctx.fillStyle = '#FFA800';
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function animateParticles() {
      ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }


  // ================================================================
  // 2. HEADER TRANSPARENTE SOBRE O HERO VÍDEO
  // ================================================================
  const header = document.getElementById('header');
  const heroSection = document.getElementById('home');

  function updateHeaderMode() {
    if (!heroSection) return;
    const heroBottom = heroSection.getBoundingClientRect().bottom;
    if (heroBottom > 80) {
      header.classList.add('header-on-video');
      header.classList.remove('scrolled');
    } else {
      header.classList.remove('header-on-video');
      if (window.scrollY > 40) header.classList.add('scrolled');
    }
  }
  updateHeaderMode();
  window.addEventListener('scroll', updateHeaderMode, { passive: true });


  // ================================================================
  // 3. PRELOADER & ANIMAÇÕES DE ENTRADA DO HERO (GSAP)
  // ================================================================
  window.addEventListener('load', () => {
    const preloader = document.getElementById('premiumPreloader');
    if (!preloader) return;
    const content = preloader.querySelector('.preloader-content');
    
    // Anima o conteúdo do preloader aparecendo (fade in)
    gsap.to(content, { opacity: 1, duration: 0.5 });

    // Segura o preloader um pouquinho, então revela "puxando a cortina"
    const tlIntro = gsap.timeline({ delay: 1.5 });
    
    tlIntro.to(preloader, { 
      yPercent: -100, 
      duration: 1.2, 
      ease: 'power4.inOut',
      onComplete: () => {
        // Inicializa animação do Hero após preloader sair
        const tl = gsap.timeline();
        tl.from('.hero-top-badges-row',  { opacity: 0, y: -20, duration: 0.9, ease: 'power3.out' })
          // TEXT MASKING (Revelação da máscara)
          .from('.mask-text', { y: '100%', duration: 1.2, ease: 'power4.out', stagger: 0.15 }, '-=0.5')
          .from('.hero-ribbon-banner',   { opacity: 0, scale: 0.92, duration: 1, ease: 'power3.out' }, '-=0.8')
          .from('.hero-subtext',         { opacity: 0, y: 20, duration: 0.9, ease: 'power3.out' }, '-=0.6')
          .from('.hero-btn-row',         { opacity: 0, y: 20, duration: 0.9, ease: 'power3.out' }, '-=0.7')
          .from('.hero-stats-bar',       { opacity: 0, y: 20, duration: 0.9, ease: 'power3.out' }, '-=0.7')
          .from('.globe-editorial-card', { opacity: 0, x: 50, scale: 0.94, duration: 1.2, ease: 'power3.out' }, '-=1.0')
          .from('.scroll-indicator',     { opacity: 0, y: -12, duration: 0.8, ease: 'power3.out' }, '-=0.2');
      }
    });
  });


  // ================================================================
  // 4. VIDEO SCROLL-SCALE (Travel Productions Style)
  // ================================================================
  const videoContainer = document.getElementById('videoScaleContainer');
  if (videoContainer) {
    gsap.fromTo(videoContainer,
      { scale: 0.88, borderRadius: '36px', boxShadow: '0 15px 35px rgba(12,35,64,0.12)' },
      {
        scrollTrigger: {
          trigger: '#videoSection',
          start: 'top 75%',
          end: 'center 45%',
          scrub: 1.5
        },
        scale: 1.0,
        borderRadius: '16px',
        boxShadow: '0 30px 70px rgba(12,35,64,0.28)',
        ease: 'power2.out'
      }
    );
  }


  // ================================================================
  // 5. PARALLAX GSAP NAS SEÇÕES IMERSIVAS
  // ================================================================
  const santoriniBg = document.querySelector('.parallax-immersive-bg:not(.parallax-dubai-bg)');
  if (santoriniBg) {
    gsap.fromTo(santoriniBg,
      { yPercent: -8 },
      {
        scrollTrigger: { trigger: '#santorini', start: 'top bottom', end: 'bottom top', scrub: 1.5 },
        yPercent: 8,
        ease: 'none'
      }
    );
  }

  const dubaiBg = document.querySelector('.parallax-dubai-bg');
  if (dubaiBg) {
    gsap.fromTo(dubaiBg,
      { yPercent: -8 },
      {
        scrollTrigger: { trigger: '#dubaiParallax', start: 'top bottom', end: 'bottom top', scrub: 1.5 },
        yPercent: 8,
        ease: 'none'
      }
    );
  }

  // Conteúdo das parallax entra em cena
  gsap.from('#santorini .parallax-immersive-content', {
    scrollTrigger: { trigger: '#santorini', start: 'top 72%', end: 'top 30%', scrub: 1.5 },
    x: -60,
    opacity: 0
  });

  gsap.from('#dubaiParallax .parallax-immersive-content', {
    scrollTrigger: { trigger: '#dubaiParallax', start: 'top 72%', end: 'top 30%', scrub: 1.5 },
    y: 50,
    opacity: 0
  });


  // ================================================================
  // 6. CONTADORES ANIMADOS (Stats Section)
  // ================================================================
  function animateCounter(el, target, suffix) {
    const start = performance.now();
    const duration = 1800;
    const isSmall = target <= 12;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = isSmall
        ? Math.round(eased * target)
        : Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const statsSection = document.getElementById('statsSection');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.stat-item').forEach(item => {
            const numberEl = item.querySelector('.stat-number');
            if (!numberEl) return;
            const target = parseFloat(item.dataset.count);
            const suffix = item.dataset.suffix || '';
            animateCounter(numberEl, target, suffix);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  }


  // ================================================================
  // 7. STAGGER ITEMS (IntersectionObserver Cascata)
  // ================================================================
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const parent = entry.target.parentElement;
        const siblings = parent ? Array.from(parent.querySelectorAll('.stagger-item')) : [];
        const index = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, Math.max(index, 0) * 110);
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.stagger-item').forEach(el => staggerObserver.observe(el));


  // ================================================================
  // 8. ANIMAÇÕES SCROLLTRIGGER — SEÇÕES EDITORIAIS
  // ================================================================
  gsap.from('.founder-photo-card', {
    scrollTrigger: { trigger: '.about-section', start: 'top 80%', end: 'top 40%', scrub: 1.5 },
    scale: 0.94, opacity: 0.8
  });

  gsap.from('.founder-narrative', {
    scrollTrigger: { trigger: '.about-section', start: 'top 75%', end: 'top 35%', scrub: 1.5 },
    x: 40, opacity: 0
  });

  gsap.from('.mascot-editorial-card', {
    scrollTrigger: { trigger: '.mascot-editorial-card', start: 'top 85%', end: 'top 50%', scrub: 1.5 },
    y: 50, opacity: 0.7
  });


  // ================================================================
  // 9. MOBILE MENU TOGGLE
  // ================================================================
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
    document.querySelectorAll('.nav-item').forEach(link => {
      link.addEventListener('click', () => navMenu.classList.remove('open'));
    });
  }


  // ================================================================
  // 10. CUSTOM CURSOR ANIMADO (Travel Productions Style)
  // ================================================================
  const cursorDot      = document.getElementById('cursorDot');
  const cursorFollower = document.getElementById('cursorFollower');
  const cursorText     = document.getElementById('cursorText');

  if (cursorDot && cursorFollower && window.innerWidth > 768) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top  = `${mouseY}px`;
    });

    (function renderCursor() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top  = `${followerY}px`;
      requestAnimationFrame(renderCursor);
    })();

    document.querySelectorAll('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorFollower.classList.add('active');
        if (cursorText) cursorText.textContent = el.getAttribute('data-cursor') || 'Explorar';
      });
      el.addEventListener('mouseleave', () => cursorFollower.classList.remove('active'));
    });
  }


  // ================================================================
  // 11. FORM — MODAL DE CONFIRMAÇÃO
  // ================================================================
  const triageForm       = document.getElementById('triageForm');
  const confirmModal     = document.getElementById('confirmationModal');
  const closeModalBtn    = document.getElementById('closeModal');

  if (triageForm) {
    triageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (confirmModal) confirmModal.classList.add('open');
      triageForm.reset();
    });
  }

  if (closeModalBtn && confirmModal) {
    closeModalBtn.addEventListener('click', () => confirmModal.classList.remove('open'));
    confirmModal.addEventListener('click', (e) => {
      if (e.target === confirmModal) confirmModal.classList.remove('open');
    });
  }

  // ================================================================
  // 12. MOUSE DRAG TO SCROLL (Experiences Slider)
  // ================================================================
  const slider = document.getElementById('experiencesSlider');
  if (slider) {
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.style.cursor = 'grabbing';
      // Disable scroll-snap during drag for smoother free-scrolling
      slider.style.scrollSnapType = 'none';
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.style.cursor = 'grab';
      slider.style.scrollSnapType = 'x mandatory';
    });

    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.style.cursor = 'grab';
      slider.style.scrollSnapType = 'x mandatory';
    });

    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2; // Scroll-fast
      slider.scrollLeft = scrollLeft - walk;
    });
  }

  // ================================================================
  // 13. BOTÕES MAGNÉTICOS
  // ================================================================
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const position = btn.getBoundingClientRect();
      const x = e.clientX - position.left - position.width / 2;
      const y = e.clientY - position.top - position.height / 2;
      
      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.6,
        ease: 'power3.out'
      });
      // Move o texto interno de forma independente para efeito de profundidade
      const innerElement = btn.querySelector('span');
      if (innerElement) {
        gsap.to(innerElement, {
          x: x * 0.1,
          y: y * 0.1,
          duration: 0.6,
          ease: 'power3.out'
        });
      }
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)'
      });
      const innerElement = btn.querySelector('span');
      if (innerElement) {
        gsap.to(innerElement, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.3)'
        });
      }
    });
  });

});
