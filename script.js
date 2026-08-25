/* ============================================
   PORTFOLIO — Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initSnakeWave();
  initCanvasBackground();
  initNavbar();
  initScrollReveal();
  initSkillBars();
  initCounters();
  initCursorGlow();
  initSmoothScroll();
  initContactForm();
});

/* ---------- Canvas Particle Grid ---------- */
function initCanvasBackground() {
  const canvas = document.getElementById('canvas-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, particles, mouse;

  mouse = { x: null, y: null, radius: 150 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const spacing = 60;
    const cols = Math.ceil(width / spacing);
    const rows = Math.ceil(height / spacing);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        particles.push({
          x: i * spacing + spacing / 2,
          y: j * spacing + spacing / 2,
          originX: i * spacing + spacing / 2,
          originY: j * spacing + spacing / 2,
          size: 1.2,
          opacity: 0.15 + Math.random() * 0.1,
        });
      }
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      let dx = 0, dy = 0;

      if (mouse.x !== null) {
        const distX = p.originX - mouse.x;
        const distY = p.originY - mouse.y;
        const dist = Math.sqrt(distX * distX + distY * distY);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          dx = distX * force * 0.3;
          dy = distY * force * 0.3;
        }
      }

      p.x += (p.originX + dx - p.x) * 0.1;
      p.y += (p.originY + dy - p.y) * 0.1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(28, 105, 212, ${p.opacity})`;
      ctx.fill();
    });

    // Draw connection lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 70) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(28, 105, 212, ${0.04 * (1 - dist / 70)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    drawParticles();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  resize();
  createParticles();
  animate();
}

/* ---------- Navbar ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const links = navLinks.querySelectorAll('a');

  // Scroll state
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // Mobile toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active link highlight on scroll
  const sections = document.querySelectorAll('section[id]');

  function highlightNav() {
    const scrollY = window.pageYOffset + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = navLinks.querySelector(`a[href="#${id}"]`);

      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          links.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', highlightNav);
}

/* ---------- Scroll Reveal ---------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ---------- Skill Bar Animation ---------- */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const width = target.getAttribute('data-width');
        target.style.width = width + '%';
        observer.unobserve(target);
      }
    });
  }, {
    threshold: 0.3
  });

  bars.forEach(bar => observer.observe(bar));
}

/* ---------- Counter Animation ---------- */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el, target) {
  const duration = 2000;
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out expo
    const eased = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(eased * target);

    el.textContent = current + '+';

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target + '+';
    }
  }

  requestAnimationFrame(step);
}

/* ---------- Cursor Glow ---------- */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;

  // Check for touch devices
  if ('ontouchstart' in window) return;

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

/* ---------- Smooth Scroll ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ---------- Contact Form ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const btn = form.querySelector('.btn-primary');
    const originalHTML = btn.innerHTML;

    // Animate button
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 0.8s linear infinite;"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
      Sending...
    `;
    btn.style.pointerEvents = 'none';

    // Simulate send
    setTimeout(() => {
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        Message Sent!
      `;
      btn.style.background = 'linear-gradient(135deg, #34d399, #4ecafc)';

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.style.pointerEvents = '';
        form.reset();
      }, 2500);
    }, 1500);
  });

  // Add spin keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}



/* ---------- Preloader / Ignition Sequence ---------- */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const bar = document.getElementById('preloader-bar');
  const percentText = document.getElementById('preloader-percentage');
  const statusText = document.getElementById('preloader-status');

  if (!preloader) {
    document.body.classList.add('loaded');
    return;
  }

  // Disable scroll while loading
  document.body.style.overflow = 'hidden';

  const statuses = [
    { threshold: 0, text: "Configuring environment..." },
    { threshold: 20, text: "Optimizing DOM components..." },
    { threshold: 45, text: "Engaging M Sport Engine..." },
    { threshold: 70, text: "Tuning turbochargers..." },
    { threshold: 90, text: "Ignition Sequence ready..." }
  ];

  let percent = 0;

  function updateLoader() {
    if (percent >= 100) {
      percent = 100;
      if (bar) bar.style.width = '100%';
      if (percentText) percentText.textContent = '100%';
      if (statusText) statusText.textContent = 'Ignition Ready!';
      
      setTimeout(() => {
        preloader.classList.add('preloader-hidden');
        document.body.classList.add('loaded');
        document.body.style.overflow = ''; // Restore scroll
      }, 500);
      return;
    }

    if (bar) bar.style.width = percent + '%';
    if (percentText) percentText.textContent = Math.floor(percent) + '%';

    // Find correct status message based on percentage
    const currentStatus = statuses.reduce((prev, curr) => {
      return (percent >= curr.threshold) ? curr : prev;
    }, statuses[0]);
    
    if (statusText) statusText.textContent = currentStatus.text;

    // Dynamic variable step to feel organic and high-performance
    let step = 1;
    if (percent < 25) {
      step = 1.5 + Math.random() * 2;
    } else if (percent < 55) {
      step = 0.8 + Math.random() * 0.8; // slows down on engine load
    } else if (percent < 85) {
      step = 2 + Math.random() * 2; // speed boost
    } else {
      step = 0.5 + Math.random() * 0.6; // final precision check
    }

    percent += step;
    
    // Organic speed intervals
    setTimeout(updateLoader, 30 + Math.random() * 25);
  }

  // Start sequence
  updateLoader();
}

/* ---------- Snake Wave Name & Dynamic Color Shift ---------- */
function initSnakeWave() {
  const nameContainer = document.querySelector('.hero-title .gradient-text');
  if (!nameContainer) return;

  const rawText = nameContainer.textContent.trim();
  nameContainer.innerHTML = '';
  nameContainer.classList.add('snake-container');

  const chars = [...rawText];
  const total = chars.length;

  chars.forEach((char, index) => {
    const span = document.createElement('span');
    if (char === ' ') {
      span.innerHTML = '&nbsp;';
      span.className = 'snake-char space';
    } else {
      span.textContent = char;
      span.className = 'snake-char';
    }
    
    // Wave animation delay based on index for smooth undulating snake motion
    span.style.animationDelay = `${index * 0.08}s, ${index * 0.15}s`;
    nameContainer.appendChild(span);
  });

  // Dynamic background color sync on cursor movement over hero section
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const hue = Math.floor(x * 360);
      nameContainer.style.setProperty('--dynamic-hue', `${hue}deg`);
    });
  }
}
