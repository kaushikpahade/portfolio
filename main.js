
(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const safe = (fn) => { try { fn(); } catch (e) { console.error(e); } };

  let siteRevealed = false; // ✅ new flag

  document.addEventListener('DOMContentLoaded', () => {
    const splash = $('#splash');
    const splashMsg = $('#splash-msg');
    const site = $('#site');
    const messages = ['WELCOME', 'ようこそ','स्वागत है' ];
    let idx = 0;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // rotate splash messages
    function rotate() {
      if (splashMsg) splashMsg.textContent = messages[idx % messages.length];
      idx++;
    }

    let rot;
    if (!prefersReduced) {
      rotate();
      rot = setInterval(rotate, 900);
    }

    // reveal site safely
    function showSite(reason = 'timer') {
      if (siteRevealed) return; // ✅ prevent multiple triggers
      siteRevealed = true;

      if (rot) clearInterval(rot);

      if (splash) {
        splash.style.transition = 'opacity 420ms ease';
        splash.style.opacity = 0;
        setTimeout(() => {
          splash.remove();
          site?.removeAttribute('hidden');
          initAfterSplash();
          console.info('✅ Site revealed:', reason);
        }, 420);
      } else {
        site?.removeAttribute('hidden');
        initAfterSplash();
      }
    }

    // normal flow
    setTimeout(() => showSite('timeout'), 1600);

    // fallback: ensure site shows if something blocks
    const fallback = setTimeout(() => {
      showSite('fallback');
    }, 6000);

    // once page finishes load
    window.addEventListener('load', () => {
      clearTimeout(fallback);
      showSite('load');
    });

    // reduced motion: skip splash
    if (prefersReduced) {
      showSite('reduced-motion');
    }
  });

  // init interactions (idempotent)
  function initAfterSplash() {
    safe(() => {
      // year
      const y = document.getElementById('year');
      if (y) y.textContent = new Date().getFullYear();

      // theme
      const themeToggle = document.getElementById('theme-toggle');
      const stored = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial = stored || (prefersDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', initial);
      if (themeToggle) {
        themeToggle.setAttribute('aria-pressed', initial === 'dark');
        themeToggle.textContent = initial === 'dark' ? '☀️' : '🌙';
      }
      themeToggle?.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
        themeToggle.setAttribute('aria-pressed', next === 'dark');
      });

      // reveal on scroll
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const revealEls = document.querySelectorAll('[data-reveal]');
      if (!prefersReduced && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries, obs) => {
          entries.forEach(e => {
            if (e.isIntersecting) {
              e.target.classList.add('is-revealed');
              obs.unobserve(e.target);
            }
          });
        }, { threshold: 0.06 });
        revealEls.forEach(el => io.observe(el));
      } else {
        revealEls.forEach(el => el.classList.add('is-revealed'));
      }

      // smooth anchor nav
      document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', ev => {
          const href = a.getAttribute('href');
          if (!href || href === '#') return;
          const t = document.querySelector(href);
          if (t) {
            ev.preventDefault();
            t.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
          }
        });
      });

      // back to top
      const btt = document.getElementById('back-to-top');
      if (btt) {
        window.addEventListener('scroll', () => {
          if (window.scrollY > 320) btt.classList.add('show'); else btt.classList.remove('show');
        });
        btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
      }

      // skill bars
      setTimeout(() => {
        document.querySelectorAll('.bar span').forEach(s => {
          const w = getComputedStyle(s).getPropertyValue('--w') || '70%';
          s.style.width = w;
        });
      }, 600);

      // cert buttons
     

      // init canvas background
      safe(() => initHeroCanvas(true));
    });
  }

  // canvas animation
  function initHeroCanvas(enable) {
    if (!enable) return;
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    let w = canvas.clientWidth, h = canvas.clientHeight;
    const DPR = Math.max(1, window.devicePixelRatio || 1);
    let particles = [];
    let frame;

    function resize() {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.floor(w * DPR); canvas.height = Math.floor(h * DPR);
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    window.addEventListener('resize', resize);
    resize();

    const count = Math.max(28, Math.floor(w * 0.06));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.9 + Math.random() * 2.8,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        a: 0.18 + Math.random() * 0.6
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, 'rgba(0,229,255,0.03)');
      grad.addColorStop(0.6, 'rgba(255,64,129,0.02)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#00E5FF';
      ctx.fillStyle = accent;
      particles.forEach(p => {
        ctx.globalAlpha = p.a;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      });

      ctx.globalAlpha = 0.06;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const p1 = particles[a], p2 = particles[b];
          const dx = p1.x - p2.x, dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    }
    draw();

    // pause when tab hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
      } else {
        draw();
      }
    });
  }

})();
