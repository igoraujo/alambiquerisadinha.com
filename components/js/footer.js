document.addEventListener('DOMContentLoaded', () => {
  const footerPlaceholder = document.getElementById('footer-placeholder');

  if (footerPlaceholder) {
    fetch('components/footer.html')
      .then(response => {
        if (!response.ok) throw new Error('Erro ao carregar o footer');
        return response.text();
      })
      .then(data => {
        footerPlaceholder.innerHTML = data;
        
        // Inicializa todas as interações do footer após o HTML existir no DOM
        initfooterLogic();
      })
      .catch(error => console.error(error));
  }
});

function initfooterLogic() {
  /* ── NAVBAR SCROLL ── */
  const navbar = document.getElementById('navbar') || document.getElementById('footer-placeholder');
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
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Fecha ao clicar em qualquer link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });

    // Fecha ao clicar fora
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
}