/* ==========================================================================
   UAI SÔ TRAVEL — JAVASCRIPT LUMINOUS (STITCH EDITION)
   Animações de Scroll em Cascata, Filtros Interativos e Micro-Interações
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Header Blur & Shadow on Scroll
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });


  // 2. Scroll Reveal em Cascata (Staggered Animation)
  const revealItems = document.querySelectorAll('.reveal-item');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealItems.forEach((el, index) => {
      // Delay incremental para efeito de cascata
      const delay = (index % 3) * 0.15;
      el.style.transitionDelay = `${delay}s`;
      observer.observe(el);
    });
  } else {
    // Fallback se o navegador não tiver IntersectionObserver
    revealItems.forEach(el => el.classList.add('is-visible'));
  }


  // 3. Filtros Interativos de Destinos
  const filterBtns = document.querySelectorAll('.filter-btn');
  const destCards = document.querySelectorAll('.dest-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Atualizar classe active
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      destCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });


  // 4. Form Submission & Feedback
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn-submit-form');
      const originalText = btn.innerText;
      
      btn.innerText = 'Enviando... ✨';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerText = 'Solicitação Enviada com Sucesso! 🥂';
        btn.style.background = '#25D366';
        contactForm.reset();
        
        setTimeout(() => {
          btn.innerText = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      }, 1000);
    });
  }


  // 5. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.style.display === 'flex';
      navMenu.style.display = isOpen ? 'none' : 'flex';
      if (!isOpen) {
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '80px';
        navMenu.style.left = '0';
        navMenu.style.width = '100%';
        navMenu.style.background = '#FFFFFF';
        navMenu.style.padding = '24px';
        navMenu.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
      }
    });
  }

});
