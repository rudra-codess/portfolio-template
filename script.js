/* =============================================
   PORTFOLIO SCRIPT — Alex Mercer
   ============================================= */

(function () {
  'use strict';

  /* ---- LOADER ---- */
  const loader = document.getElementById('loader');
  const loaderFill = document.querySelector('.loader-fill');
  const loaderText = document.querySelector('.loader-text');
  const messages = ['Initializing...', 'Loading assets...', 'Almost ready...', 'Welcome.'];
  let msgIdx = 0;

  const tick = setInterval(() => {
    msgIdx++;
    if (loaderText && messages[msgIdx]) loaderText.textContent = messages[msgIdx];
  }, 400);

  if (loaderFill) {
    requestAnimationFrame(() => {
      loaderFill.style.width = '100%';
    });
  }

  window.addEventListener('load', () => {
    clearInterval(tick);
    setTimeout(() => {
      if (loader) loader.classList.add('hidden');
      startEntrance();
    }, 1700);
  });

  function startEntrance() {
    const heroEls = document.querySelectorAll('#hero .reveal-up');
    heroEls.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 130);
    });
  }

  /* ---- CUSTOM CURSOR ---- */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

  if (cursor && follower) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    const lerp = (a, b, t) => a + (b - a) * t;
    function animFollower() {
      followerX = lerp(followerX, mouseX, 0.12);
      followerY = lerp(followerY, mouseY, 0.12);
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(animFollower);
    }
    animFollower();

    const hoverEls = document.querySelectorAll('a, button, .skill-card, .project-card, .contact-card, .skill-tag');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        follower.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
      });
    });
  }

  /* ---- PARTICLE CANVAS ---- */
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const NUM = 60;
    for (let i = 0; i < NUM; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        color: Math.random() > 0.5 ? '108,99,255' : '62,207,207'
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();
      });

      // Draw connections
      particles.forEach((a, i) => {
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(108,99,255,${0.07 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  /* ---- NAVBAR ---- */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
    updateActiveNav();
    handleReveal();
  }, { passive: true });

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('.mob-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 200) current = s.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }

  /* ---- SMOOTH SCROLL ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- SCROLL REVEAL ---- */
  function handleReveal() {
    const reveals = document.querySelectorAll('.reveal-up:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible)');
    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.88) {
        el.classList.add('visible');
        // Trigger skill bars
        el.querySelectorAll('.skill-fill').forEach(fill => {
          const parent = fill.closest('.skill-bar');
          if (parent) {
            const w = parent.getAttribute('data-width') || 0;
            setTimeout(() => { fill.style.width = w + '%'; }, 200);
          }
        });
      }
    });
  }

  // Also trigger skill bars when their card becomes visible via IntersectionObserver
  const skillBars = document.querySelectorAll('.skill-bar');
  const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.skill-fill');
        const w = entry.target.getAttribute('data-width') || 0;
        if (fill) setTimeout(() => { fill.style.width = w + '%'; }, 300);
        skillObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  skillBars.forEach(bar => skillObs.observe(bar));

  // Initial call
  setTimeout(handleReveal, 200);
  window.addEventListener('scroll', handleReveal, { passive: true });

  /* ---- TYPING ANIMATION ---- */
  const typed = document.getElementById('typedText');
  const phrases = [
    'Developer',
    'Problem Solver',
    'Tech Enthusiast',
    'Open Source Advocate',
    'Systems Thinker'
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false, typingSpeed = 95;

  function type() {
    if (!typed) return;
    const current = phrases[phraseIdx];
    if (!deleting) {
      typed.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      typed.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 45 : typingSpeed);
  }

  setTimeout(type, 2200);

  /* ---- PARALLAX ---- */
  const orbs = document.querySelectorAll('.bg-orb');
  let lastScrollY = 0, ticking = false;

  function parallaxUpdate() {
    orbs.forEach((orb, i) => {
      const speed = (i + 1) * 0.03;
      const yPos = -lastScrollY * speed;
      const current = orb.style.transform || '';
      if (!current.includes('translate(')) {
        orb.style.transform = `translateY(${yPos}px)`;
      }
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(parallaxUpdate);
      ticking = true;
    }
  }, { passive: true });

  /* ---- COPY TO CLIPBOARD ---- */
  const toast = document.getElementById('toast');
  document.querySelectorAll('.copy-btn[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        btn.classList.add('copied');
        btn.querySelector('span').textContent = 'Copied!';
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.querySelector('span').textContent = 'Copy';
        }, 2000);
        showToast();
      }).catch(() => {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast();
      });
    });
  });

  function showToast() {
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }

  /* ---- RIPPLE EFFECT ---- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height) * 2;
      ripple.style.cssText = `
        position:absolute;
        width:${size}px;height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY - rect.top - size/2}px;
        background:rgba(255,255,255,0.15);
        border-radius:50%;
        transform:scale(0);
        animation:ripple 0.6s linear;
        pointer-events:none;
      `;
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `@keyframes ripple{to{transform:scale(1);opacity:0;}}`;
  document.head.appendChild(rippleStyle);

  /* ---- CARD TILT ---- */
  const tiltCards = document.querySelectorAll('.project-card, .skill-card, .contact-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---- ACTIVE SECTION HIGHLIGHT on load ---- */
  updateActiveNav();

})();
