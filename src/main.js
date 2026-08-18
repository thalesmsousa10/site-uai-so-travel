/* ==========================================================================
   UAI SÔ TRAVEL — JAVASCRIPT CINEMATOGRÁFICO (GSAP + LENIS + SCROLLTRIGGER)
   Animações de Entrada em Cascata pela Direita, Efeitos 3D e Rolagem Fluida
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. INICIALIZAÇÃO DO LENIS SMOOTH SCROLL (Rolagem suave de cinema)
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // 2. HEADER BLUR ON SCROLL
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });


  // 3. ANIMAÇÕES CORE GSAP + SCROLLTRIGGER
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      if (lenis) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);
      }
    }

    // A) HERO SECTION REVEAL (Entrada Suave em Cascata Vertical)
    const heroElements = document.querySelectorAll('.hero-content > *');
    if (heroElements.length > 0) {
      gsap.from(heroElements, {
        y: 35,
        opacity: 0,
        stagger: 0.12,
        duration: 1.0,
        ease: 'power3.out',
        delay: 0.1
      });
    }

    // B) DESTINOS: ENTRADA EM CASCATA PELA DIREITA (Fly-in from Right)
    const destGrids = document.querySelectorAll('.destinations-grid-4');
    destGrids.forEach(grid => {
      const cards = grid.querySelectorAll('.dest-card-v4, .dest-card');
      if (cards.length > 0) {
        gsap.from(cards, {
          scrollTrigger: {
            trigger: grid,
            start: 'top 82%',
            toggleActions: 'play none none none'
          },
          x: 120,               // Desliza da direita para a esquerda
          opacity: 0,
          scale: 0.92,
          rotationY: 8,         // Leve rotação 3D
          stagger: 0.16,        // Um de cada vez em cascata
          duration: 1.15,
          ease: 'power3.out'
        });
      }
    });

    // C) EXPERIÊNCIAS VIP: ENTRADA EM LEQUE TRIDIMENSIONAL
    const expGrids = document.querySelectorAll('.experiences-grid-3');
    expGrids.forEach(grid => {
      const cards = grid.querySelectorAll('.exp-card-v3');
      if (cards.length > 0) {
        gsap.from(cards, {
          scrollTrigger: {
            trigger: grid,
            start: 'top 80%',
            toggleActions: 'play none none none'
          },
          y: 60,
          opacity: 0,
          scale: 0.94,
          stagger: 0.18,
          duration: 1.1,
          ease: 'power3.out'
        });
      }
    });

    // D) NOSSOS SERVIÇOS: ONDA EM CASCATA COM REBOUND
    const serviceGrids = document.querySelectorAll('.services-grid-4');
    serviceGrids.forEach(grid => {
      const cards = grid.querySelectorAll('.service-card-clean');
      if (cards.length > 0) {
        gsap.from(cards, {
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          y: 45,
          opacity: 0,
          scale: 0.92,
          stagger: 0.12,
          duration: 0.9,
          ease: 'back.out(1.4)'
        });
      }
    });

    // E) SEÇÃO DA FUNDADORA: ENTRADA EM PARALAXE SUAVE
    const founderGrid = document.querySelector('.bento-founder-grid');
    if (founderGrid) {
      const founderImg = founderGrid.querySelector('.founder-image-wrapper');
      const founderText = founderGrid.querySelectorAll('.founder-story-content > *');

      if (founderImg) {
        gsap.from(founderImg, {
          scrollTrigger: {
            trigger: founderGrid,
            start: 'top 78%',
            toggleActions: 'play none none none'
          },
          x: -60,
          opacity: 0,
          scale: 0.94,
          duration: 1.2,
          ease: 'power3.out'
        });
      }

      if (founderText.length > 0) {
        gsap.from(founderText, {
          scrollTrigger: {
            trigger: founderGrid,
            start: 'top 78%',
            toggleActions: 'play none none none'
          },
          x: 50,
          opacity: 0,
          stagger: 0.12,
          duration: 1.0,
          ease: 'power3.out'
        });
      }
    }

    // F) MASCOTE FLUTUANTE & BANNER SOLAR
    const mascotCard = document.querySelector('.mascot-story-card');
    if (mascotCard) {
      gsap.from(mascotCard, {
        scrollTrigger: {
          trigger: mascotCard,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        duration: 1.0,
        ease: 'power2.out'
      });
    }

  } else {
    // Fallback caso GSAP não esteja presente
    const revealItems = document.querySelectorAll('.reveal-item');
    revealItems.forEach(el => el.classList.add('is-visible'));
  }


  // 4. MICRO-INTERAÇÃO: 3D TILT SUAVE NOS CARDS AO PASSAR O MOUSE
  const interactiveCards = document.querySelectorAll('.dest-card-v4, .exp-card-v3');
  interactiveCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotX = -(y / rect.height) * 8; // máx 8 graus
      const rotY = (x / rect.width) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });


  // 5. FILTROS INTERATIVOS DE DESTINOS (destinos.html)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const destCards = document.querySelectorAll('.dest-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      destCards.forEach((card, index) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(card, 
              { opacity: 0, x: 60, scale: 0.95 },
              { opacity: 1, x: 0, scale: 1, duration: 0.6, delay: (index % 4) * 0.08, ease: 'power2.out' }
            );
          } else {
            card.style.opacity = '1';
          }
        } else {
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });


  // 6. FORMULÁRIO DE CONTATO COM FEEDBACK ENVIADO
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn-submit-form');
      const originalHtml = btn.innerHTML;
      
      btn.innerHTML = '<span>Enviando solicitação... ✨</span>';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = '<span>Solicitação Enviada com Sucesso! 🥂</span>';
        btn.style.background = '#25D366';
        contactForm.reset();
        
        setTimeout(() => {
          btn.innerHTML = originalHtml;
          btn.style.background = '';
          btn.disabled = false;
        }, 4500);
      }, 1000);
    });
  }


  // 7. MENU MOBILE TOGGLE
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('mobile-open');
      if (isOpen) {
        navMenu.classList.remove('mobile-open');
        navMenu.style.display = '';
      } else {
        navMenu.classList.add('mobile-open');
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '84px';
        navMenu.style.left = '0';
        navMenu.style.width = '100%';
        navMenu.style.background = '#FFFFFF';
        navMenu.style.padding = '28px';
        navMenu.style.boxShadow = '0 16px 36px rgba(0,0,0,0.12)';
        navMenu.style.gap = '20px';
      }
    });
  }

});
