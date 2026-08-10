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
  const toastText = toast.querySelector('p');
  const toastLink = toast.querySelector('a');
  let toastTimer;
  function showToast(message, linkHref, linkText) {
    clearTimeout(toastTimer);
    toastText.innerHTML = message;
    if (linkHref) {
      toastLink.style.display = 'inline';
      toastLink.href = linkHref;
      toastLink.textContent = linkText || 'Learn more →';
    } else {
      toastLink.style.display = 'none';
    }
    toast.classList.add('is-visible');
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 4500);
  }

  document.querySelectorAll('.ep-card').forEach(card => {
    card.addEventListener('click', () => {
      const link = card.getAttribute('data-link');
      const isSoon = card.getAttribute('data-soon') === 'true';
      if (isSoon) {
        showToast('This episode is <strong>coming soon</strong> — follow on LinkedIn for updates.', 'https://www.linkedin.com/company/ladies-leadership-logistics/', 'Visit LinkedIn →');
      } else if (link) {
        window.open(link, '_blank', 'noopener');
      }
    });
  });

  /* ---------- Star rating ---------- */
  const starRating = document.getElementById('starRating');
  const ratingValue = document.getElementById('ratingValue');
  if (starRating) {
    const stars = Array.from(starRating.querySelectorAll('.star'));

    function paintStars(count) {
      stars.forEach(s => {
        const active = Number(s.dataset.value) <= count;
        s.classList.toggle('is-hover', active);
      });
    }
    function setActive(count) {
      stars.forEach(s => {
        const active = Number(s.dataset.value) <= count;
        s.classList.toggle('is-active', active);
        s.setAttribute('aria-checked', active ? 'true' : 'false');
      });
    }

    stars.forEach(star => {
      star.addEventListener('mouseenter', () => paintStars(Number(star.dataset.value)));
      star.addEventListener('focus', () => paintStars(Number(star.dataset.value)));
      star.addEventListener('click', () => {
        const value = Number(star.dataset.value);
        ratingValue.value = value;
        setActive(value);
      });
    });
    starRating.addEventListener('mouseleave', () => paintStars(Number(ratingValue.value)));
  }

  /* ---------- Feedback form (opens mail client) ---------- */
  const feedbackForm = document.getElementById('feedbackForm');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const rating = Number(ratingValue.value);
      const name = feedbackForm.name.value.trim();
      const message = feedbackForm.message.value.trim();

      if (rating === 0) {
        showToast('Please choose a star rating before sending your feedback.', null, null);
        return;
      }
      if (!message) {
        showToast('Please add a short message so we know what you loved.', null, null);
        return;
      }

      const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
      const subject = encodeURIComponent(`Podcast Feedback — ${rating}/5 stars`);
      const body = encodeURIComponent(
        `Rating: ${stars} (${rating}/5)\n` +
        (name ? `Name: ${name}\n` : '') +
        `\nFeedback:\n${message}`
      );
      window.location.href = `mailto:ladiesleadershiplogistics@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  /* ---------- Guest request form (opens mail client) ---------- */
  const guestForm = document.getElementById('guestForm');
  if (guestForm) {
    guestForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = guestForm.name.value.trim();
      const email = guestForm.email.value.trim();
      const message = guestForm.message.value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in your name, email, and a short note before sending.', null, null);
        return;
      }

      const subject = encodeURIComponent(`Guest Request — ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nAbout them / pitch:\n${message}`
      );
      window.location.href = `mailto:ladiesleadershiplogistics@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  /* ---------- WhatsApp community link (placeholder until real link is added) ---------- */
  const whatsappLink = document.getElementById('whatsappLink');
  if (whatsappLink) {
    whatsappLink.addEventListener('click', (e) => {
      if (whatsappLink.getAttribute('href') === '#') {
        e.preventDefault();
        showToast('Our WhatsApp community link is <strong>coming soon</strong> — check back shortly.', null, null);
      }
    });
  }

});