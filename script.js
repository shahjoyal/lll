document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav: scrolled state ---------- */
  const nav = document.getElementById('siteNav');
  const onScrollNav = () => {
    if (window.scrollY > 24) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal-up');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Route rail progress (desktop signature element) ---------- */
  const rail = document.querySelector('.route-rail');
  const railFill = document.querySelector('.route-rail__fill');
  const railPin = document.getElementById('routePin');
  const railPath = document.querySelector('.route-rail__fill');

  function updateRail() {
    if (!rail || window.innerWidth < 1100) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(Math.max(scrollTop / docHeight, 0), 1);

    const pathLength = railPath.getTotalLength ? railPath.getTotalLength() : 1400;
    railFill.style.strokeDasharray = pathLength;
    railFill.style.strokeDashoffset = pathLength * (1 - progress);

    // move pin along path
    if (railPath.getPointAtLength) {
      const point = railPath.getPointAtLength(pathLength * progress);
      const railHeight = rail.offsetHeight;
      const svgHeight = 1000; // matches viewBox height
      const pinTopPx = (point.y / svgHeight) * railHeight;
      railPin.style.top = pinTopPx + 'px';
      railPin.style.left = (point.x / 40 * rail.offsetWidth) + 'px';
    }
  }
  window.addEventListener('scroll', updateRail, { passive: true });
  window.addEventListener('resize', updateRail);
  updateRail();

  /* ---------- Founder "read more" ---------- */
  const bioText = document.getElementById('bioText');
  const readMoreBtn = document.getElementById('readMoreBtn');
  readMoreBtn.addEventListener('click', () => {
    const isOpen = bioText.classList.toggle('is-open');
    readMoreBtn.classList.toggle('is-open', isOpen);
    readMoreBtn.querySelector('span').textContent = isOpen ? 'Show Less' : 'Read Full Story';
    if (!isOpen) {
      bioText.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  /* ---------- Episode cards ---------- */
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast() {
    clearTimeout(toastTimer);
    toast.classList.add('is-visible');
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 4200);
  }

  document.querySelectorAll('.ep-card').forEach(card => {
    card.addEventListener('click', () => {
      const link = card.getAttribute('data-link');
      const isSoon = card.getAttribute('data-soon') === 'true';
      if (isSoon) {
        showToast();
      } else if (link) {
        window.open(link, '_blank', 'noopener');
      }
    });
  });

});
