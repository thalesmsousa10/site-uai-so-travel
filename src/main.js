/* ==========================================================================
   UAI SÔ TRAVEL — JAVASCRIPT ROBUSTO, LEVE E SEM BLOQUEIO DE VISIBILIDADE
   100% Visível, Sem Fades Presos, Filtros Instantâneos e Rolagem Suave
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. INICIALIZAÇÃO DO LENIS SMOOTH SCROLL (Opcional & Suave)
  if (typeof Lenis !== 'undefined') {
    try {
      const lenis = new Lenis({
        duration: 1.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    } catch (e) {
      console.warn('Lenis scroll bypass:', e);
    }
  }

  // 2. HEADER BLUR NO SCROLL
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });


  // 3. ANIMAÇÃO DE ENTRADA SUAVE (Sem esconder nenhum conteúdo)
  // Usamos IntersectionObserver leve que apenas adiciona uma classe de realce,
  // garantindo que NENHUM card fique transparente ou invisível se o script falhar!
  const allCards = document.querySelectorAll('.dest-card-v4, .exp-card-v3, .service-card-clean, .feature-pill-card');
  
  if ('IntersectionObserver' in window) {
    const cardObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('card-animated');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -20px 0px'
    });

    allCards.forEach(card => cardObserver.observe(card));
  }


  // 4. FILTROS INTERATIVOS DE DESTINOS (destinos.html)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const destCards = document.querySelectorAll('.dest-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      destCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  // 5. FORMULÁRIO DE CONTATO (Feedback Instantâneo)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn-submit-form');
      if (!btn) return;
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
        }, 4000);
      }, 800);
    });
  }


  // 6. MENU MOBILE
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
