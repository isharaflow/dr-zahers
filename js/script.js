  // header scroll shadow
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  });

  // mobile menu
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  menuToggle.addEventListener('click', () => mobileNav.classList.toggle('open'));
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));

  // back-to-top button: show after scrolling, scroll smoothly to top on click
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // scroll reveal animation for sections
  const revealTargets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealTargets.forEach(el => revealObserver.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('in-view'));
  }

  // expandable contact menu (message bubble toggle)
  const floatToggle = document.getElementById('floatToggle');
  const floatMenu = document.getElementById('floatMenu');
  if (floatToggle && floatMenu) {
    floatToggle.addEventListener('click', () => {
      const isOpen = floatMenu.classList.toggle('open');
      floatToggle.classList.toggle('open', isOpen);
      floatToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      floatToggle.setAttribute('aria-label', isOpen ? 'Close contact options' : 'Open contact options');
    });
  }

  // testimonials carousel
  const testimonials = [
    { name:'Noushida A', time:'1 month ago', text:'I can\u2019t thank Dr. Siji Elizabeth enough for the incredible care shown to my daughter! She needed a root canal and laser fillings on her front teeth due to severe decay, and I was naturally very anxious about the whole process. Dr. Siji was so patient, gentle, and reassuring, making my daughter feel completely at ease throughout.' },
    { name:'Ahmed R', time:'2 months ago', text:'Excellent experience from start to finish. The team explained every step of my implant treatment clearly, the clinic is spotless, and the front desk staff were incredibly welcoming. Highly recommend to anyone in Ajman looking for quality dental care.' },
    { name:'Fathima S', time:'3 weeks ago', text:'Got my smile makeover done here and I couldn\u2019t be happier with the results. The doctors really listened to what I wanted and the veneers look completely natural. Booking and follow-up appointments were also very smooth.' },
    { name:'Mohammed K', time:'2 weeks ago', text:'Very professional and gentle dentists. My kids actually enjoy coming here now, which says a lot! The pedodontics team is patient and great with children. Clean, modern clinic with a genuinely caring staff.' }
  ];
  let testimonialIndex = 0;
  const tName = document.getElementById('testimonialName');
  const tTime = document.getElementById('testimonialTime');
  const tText = document.getElementById('testimonialText');
  const tAvatar = document.getElementById('testimonialAvatar');
  const tStars = document.getElementById('testimonialStars');
  const tPrev = document.getElementById('testimonialPrev');
  const tNext = document.getElementById('testimonialNext');
  const starSvg = '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>';
  function renderTestimonial() {
    if (!tName) return;
    const item = testimonials[testimonialIndex];
    tName.textContent = item.name;
    tTime.textContent = item.time;
    tText.textContent = item.text;
    tAvatar.textContent = item.name.charAt(0);
    tStars.innerHTML = starSvg.repeat(5);
  }
  if (tPrev && tNext) {
    tPrev.addEventListener('click', () => {
      testimonialIndex = (testimonialIndex - 1 + testimonials.length) % testimonials.length;
      renderTestimonial();
    });
    tNext.addEventListener('click', () => {
      testimonialIndex = (testimonialIndex + 1) % testimonials.length;
      renderTestimonial();
    });
  }
  renderTestimonial();

  // services carousel arrows
  const servicesCarousel = document.getElementById('servicesCarousel');
  const servicesPrev = document.getElementById('servicesPrev');
  const servicesNext = document.getElementById('servicesNext');
  if (servicesCarousel && servicesPrev && servicesNext) {
    const scrollAmount = () => (servicesCarousel.querySelector('.service-card')?.offsetWidth || 260) + 22;
    servicesPrev.addEventListener('click', () => servicesCarousel.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
    servicesNext.addEventListener('click', () => servicesCarousel.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // before/after drag slider
  document.querySelectorAll('[data-ba]').forEach(el => {
    const before = el.querySelector('.before');
    const handle = el.querySelector('.ba-slider-handle');
    let dragging = false;

    function setPos(clientX) {
      const rect = el.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      handle.style.left = pct + '%';
    }
    el.addEventListener('mousedown', e => { dragging = true; setPos(e.clientX); });
    window.addEventListener('mousemove', e => { if (dragging) setPos(e.clientX); });
    window.addEventListener('mouseup', () => dragging = false);
    el.addEventListener('touchstart', e => setPos(e.touches[0].clientX));
    el.addEventListener('touchmove', e => setPos(e.touches[0].clientX));
  });
