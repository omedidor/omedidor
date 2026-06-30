/**
 * O Medidor de Terras — JavaScript Principal
 * Animações: partículas de poeira, efeitos de scroll, navbar, pena escrevendo
 */

/* ============================================================
   PARTÍCULAS DE POEIRA
   ============================================================ */
(function initDustParticles() {
  const canvas = document.getElementById('dustCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width  = W;
  canvas.height = H;

  const PARTICLE_COUNT = 60;
  const particles = [];

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function createParticle() {
    return {
      x:     randomBetween(0, W),
      y:     randomBetween(0, H),
      r:     randomBetween(0.5, 2.5),
      vx:    randomBetween(-0.15, 0.15),
      vy:    randomBetween(-0.3, -0.05),
      alpha: randomBetween(0.05, 0.35),
      life:  randomBetween(0.003, 0.008),
      phase: randomBetween(0, Math.PI * 2)
    };
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle());
  }

  let frame = 0;

  function animateDust() {
    ctx.clearRect(0, 0, W, H);
    frame++;

    particles.forEach((p, i) => {
      p.x  += p.vx + Math.sin(frame * 0.01 + p.phase) * 0.08;
      p.y  += p.vy;
      p.alpha -= p.life;

      if (p.alpha <= 0 || p.y < -10) {
        particles[i] = createParticle();
        particles[i].y = H + 10;
        particles[i].alpha = randomBetween(0.05, 0.3);
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 168, 76, ${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(animateDust);
  }

  animateDust();

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;
  });
})();

/* ============================================================
   NAVBAR — scroll e hamburger
   ============================================================ */
(function initNavbar() {
  const navbar    = document.querySelector('.navbar');
  const hamburger = document.getElementById('hamburger');
  const links     = document.querySelector('.navbar__links');

  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (hamburger && links) {
    hamburger.addEventListener('click', () => {
      links.classList.toggle('open');
    });

    // Fechar ao clicar em link
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }
})();

/* ============================================================
   REVEAL ON SCROLL
   ============================================================ */
(function initReveal() {
  const targets = document.querySelectorAll(
    '.parchment-card, .timeline__item, .math__formula-card, .section__header, .hero__ruler'
  );

  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
})();

/* ============================================================
   ANIMAÇÃO DE PENA ESCREVENDO O TÍTULO
   ============================================================ */
(function initPenAnimation() {
  const titleLines = document.querySelectorAll('.hero__title-line');
  if (!titleLines.length) return;

  // A animação CSS já cuida do fade-in; aqui adicionamos um cursor de pena
  const title = document.querySelector('.hero__title');
  if (!title) return;

  const pen = document.createElement('span');
  pen.className = 'pen-cursor';
  pen.style.cssText = `
    display: inline-block;
    width: 3px;
    height: 0.8em;
    background: #c9a84c;
    margin-left: 4px;
    vertical-align: middle;
    animation: penBlink 0.8s step-end infinite;
    opacity: 0;
    animation-delay: 0.5s;
    animation-fill-mode: forwards;
  `;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes penBlink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // Mostrar cursor por 4 segundos após a animação do título
  setTimeout(() => {
    const lastLine = titleLines[titleLines.length - 1];
    lastLine.appendChild(pen);
    pen.style.opacity = '1';

    setTimeout(() => {
      pen.style.transition = 'opacity 0.5s';
      pen.style.opacity = '0';
      setTimeout(() => pen.remove(), 500);
    }, 4000);
  }, 1200);
})();

/* ============================================================
   EFEITO PARALLAX SUAVE NO HERO
   ============================================================ */
(function initParallax() {
  const mapBg = document.querySelector('.hero__map-bg');
  if (!mapBg) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const maxScroll = window.innerHeight;
        if (scrollY < maxScroll) {
          const offset = scrollY * 0.3;
          mapBg.style.transform = `scale(1.05) translateY(${offset}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  });
})();

/* ============================================================
   SMOOTH SCROLL PARA LINKS INTERNOS
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navbarH = document.querySelector('.navbar')?.offsetHeight || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - navbarH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ============================================================
   EFEITO DE HOVER NOS CARDS — luz dourada
   ============================================================ */
(function initCardGlow() {
  const cards = document.querySelectorAll('.parchment-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--glow-x', `${x}%`);
      card.style.setProperty('--glow-y', `${y}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--glow-x');
      card.style.removeProperty('--glow-y');
    });
  });
})();

/* ============================================================
   CONTADOR ANIMADO DE ESTATÍSTICAS (se visível)
   ============================================================ */
(function initStats() {
  // Pequeno efeito de contagem para a ficha técnica
  const specCells = document.querySelectorAll('.specs-table td:last-child');
  // Apenas visual — já está preenchido no HTML
})();

/* ============================================================
   INDICADOR DE PROGRESSO DE LEITURA
   ============================================================ */
(function initReadingProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 2px;
    background: linear-gradient(to right, #8b6914, #c9a84c, #e8c96a);
    z-index: 9999;
    width: 0%;
    transition: width 0.1s linear;
    box-shadow: 0 0 8px rgba(201,168,76,0.6);
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const docH   = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / docH) * 100;
    bar.style.width = scrolled + '%';
  });
})();

/* ============================================================
   EFEITO DE ENTRADA NA TIMELINE
   ============================================================ */
(function initTimelineAnimation() {
  const items = document.querySelectorAll('.timeline__item');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 150);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
  });
})();
