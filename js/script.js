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
    { name:'Ahmed Al Mansoori', time:'1 month ago', text:'The experience was excellent! Everything was explained clearly, and I felt comfortable throughout. The clinic is modern, clean, and welcoming. I highly recommend giving Dr. Zaher’s Softhance a try at least once!' },
    { name:'Fatima Al Nuaimi', time:'2 months ago', text:'I was very nervous about dental treatment, but the team made me feel completely at ease. Everything was explained patiently and professionally. Highly recommended.' },
    { name:'Mohammed Al Mazrouei', time:'3 weeks ago', text:'Very professional and caring team. I appreciated how carefully my treatment was planned and how clearly all the options were explained to me.' },
    { name:'Hessa Al Marri', time:'2 weeks ago', text:'The clinic provides a calm and comfortable environment. I felt well informed throughout my treatment and was very happy with the overall experience.' }
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

  // Homepage slider
(function(){
  var slider = document.getElementById('heroSlider');
  if(!slider) return;
  var slides = slider.querySelectorAll('.hero-slide');
  var dots = document.querySelectorAll('#heroDots button');
  var prevBtn = document.getElementById('heroPrev');
  var nextBtn = document.getElementById('heroNext');
  var total = slides.length;
  var index = 0;
  var timer = null;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function goTo(i){
    if(!total) return;
    slides[index].classList.remove('is-active');
    if(dots[index]) dots[index].classList.remove('active');
    index = (i + total) % total;
    slides[index].classList.add('is-active');
    if(dots[index]) dots[index].classList.add('active');
  }
  function next(){ goTo(index + 1); }
  function prev(){ goTo(index - 1); }
  function stop(){ if(timer){ clearInterval(timer); timer = null; } }
  function start(){
    stop();
    if(reduceMotion || total < 2) return;
    timer = setInterval(next, 5500);
  }

  if(nextBtn) nextBtn.addEventListener('click', function(){ next(); start(); });
  if(prevBtn) prevBtn.addEventListener('click', function(){ prev(); start(); });
  dots.forEach(function(dot, i){
    dot.addEventListener('click', function(){ goTo(i); start(); });
  });

  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);
  slider.addEventListener('focusin', stop);
  slider.addEventListener('focusout', start);

  var touchStartX = 0;
  slider.addEventListener('touchstart', function(e){
    touchStartX = e.touches[0].clientX; stop();
  }, {passive:true});
  slider.addEventListener('touchend', function(e){
    var dx = e.changedTouches[0].clientX - touchStartX;
    if(Math.abs(dx) > 40){ dx < 0 ? next() : prev(); }
    start();
  }, {passive:true});

  start();
})();


(function () {

  const form = document.getElementById('appointmentModalForm');

  if (!form) return;

  const fullname = document.getElementById('modalFullname');
  const lastname = document.getElementById('modalLastname');
  const phone = document.getElementById('modalPhone');
  const email = document.getElementById('modalEmail');
  const dateInput = document.getElementById('modalDate');
  const place = document.getElementById('modalPlace');
  const treatment = document.getElementById('modalTreatment');
  const doctor = document.getElementById('modalDoctor');
  const status = document.getElementById('appointmentModalStatus');
  const submitBtn = form.querySelector('.apt-btn-primary');

  /*
   * ============================================================
   * GOOGLE FORM
   * ============================================================
   */

  const googleFormURL =
    'https://script.google.com/macros/s/AKfycbz-lKzrDF-8r_c-4tD3iHQDFbOdx42YPsmax1w82Qf0cCai4_NC5sc-dh7K1cVSL6em/exec';


  /*
   * ============================================================
   * ADD GOOGLE FORM DATE FIELDS
   * ============================================================
   */

  const dateYear = document.createElement('input');
  dateYear.type = 'hidden';
  dateYear.name = 'entry.1711041097_year';

  const dateMonth = document.createElement('input');
  dateMonth.type = 'hidden';
  dateMonth.name = 'entry.1711041097_month';

  const dateDay = document.createElement('input');
  dateDay.type = 'hidden';
  dateDay.name = 'entry.1711041097_day';

  form.appendChild(dateYear);
  form.appendChild(dateMonth);
  form.appendChild(dateDay);


  /*
   * ============================================================
   * FLATPICKR
   * ============================================================
   */

  if (typeof flatpickr !== 'undefined' && dateInput) {

    flatpickr(dateInput, {

      dateFormat: 'Y-m-d',

      minDate: 'today',

      disable: [
        function (date) {
          // Sunday = 0
          return date.getDay() === 0;
        }
      ],

      onChange: function (selectedDates, dateStr) {

        if (!dateStr) {
          dateYear.value = '';
          dateMonth.value = '';
          dateDay.value = '';
          return;
        }

        const parts = dateStr.split('-');

        dateYear.value = parts[0];
        dateMonth.value = parseInt(parts[1], 10);
        dateDay.value = parseInt(parts[2], 10);

      }

    });

  }


  /*
   * ============================================================
   * VALIDATION
   * ============================================================
   */

  function validateField(field) {

    if (!field) return true;

    const value = field.value.trim();

    // Required fields
    if (field.hasAttribute('required') && value === '') {
      field.classList.add('is-invalid');
      return false;
    }

    // Email validation
    if (
      field === email &&
      value !== ''
    ) {

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(value)) {
        field.classList.add('is-invalid');
        return false;
      }

    }

    // Phone validation
    if (field === phone && value !== '') {

      const phonePattern =
        /^[0-9+\-\s()]{7,20}$/;

      if (!phonePattern.test(value)) {
        field.classList.add('is-invalid');
        return false;
      }

    }

    field.classList.remove('is-invalid');

    return true;
  }


  /*
   * ============================================================
   * LIVE VALIDATION
   * ============================================================
   */

  [
    fullname,
    lastname,
    phone,
    email,
    dateInput,
    place,
    treatment,
    doctor
  ].forEach(function (field) {

    if (!field) return;

    field.addEventListener('input', function () {
      validateField(field);
    });

    field.addEventListener('change', function () {
      validateField(field);
    });

    field.addEventListener('blur', function () {
      validateField(field);
    });

  });


  /*
   * ============================================================
   * SUBMIT
   * ============================================================
   */

  form.addEventListener('submit', function (e) {

    e.preventDefault();

    /*
     * Hide previous status
     */

    status.hidden = true;

    /*
     * Validate fields
     */

    let isValid = true;
    let firstInvalid = null;

    [
      fullname,
      lastname,
      phone,
      email,
      dateInput,
      place,
      treatment,
      doctor
    ].forEach(function (field) {

      if (!field) return;

      if (!validateField(field)) {

        isValid = false;

        if (!firstInvalid) {
          firstInvalid = field;
        }

      }

    });


    /*
     * Stop submission if invalid
     */

    if (!isValid) {

      if (firstInvalid) {
        firstInvalid.focus();
      }

      return;
    }


    /*
     * Make sure date exists
     */

    if (!dateInput.value) {

      dateInput.classList.add('is-invalid');

      alert('Please select your preferred date.');

      return;
    }


    /*
     * Set Google Form date values
     */

    const dateParts = dateInput.value.split('-');

    dateYear.value = dateParts[0];
    dateMonth.value = parseInt(dateParts[1], 10);
    dateDay.value = parseInt(dateParts[2], 10);


    /*
     * Loading state
     */

    const originalButtonText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';


    /*
     * Prepare form data
     */

    const formData = new FormData(form);


    /*
     * Remove custom date field.
     *
     * Google Forms uses the 3 hidden date fields instead.
     */

    formData.delete('date');


    /*
     * Submit to Google Forms
     */

    fetch(googleFormURL, {

      method: 'POST',

      body: formData,

      mode: 'no-cors'

    })

    .then(function () {

      /*
       * Google Forms with no-cors does not return
       * a readable response, so a completed fetch
       * is treated as successful.
       */

      form.reset();

      /*
       * Clear date fields
       */

      dateYear.value = '';
      dateMonth.value = '';
      dateDay.value = '';


      /*
       * Remove validation classes
       */

      [
        fullname,
        lastname,
        phone,
        email,
        dateInput,
        place,
        treatment,
        doctor
      ].forEach(function (field) {

        if (field) {
          field.classList.remove('is-invalid');
          field.classList.remove('is-valid');
        }

      });


      /*
       * Reset Flatpickr
       */

      if (
        dateInput &&
        dateInput._flatpickr
      ) {
        dateInput._flatpickr.clear();
      }


      /*
       * Restore button
       */

      submitBtn.disabled = false;
      submitBtn.textContent = originalButtonText;


      /*
       * Success message
       */

      status.textContent =
        'Thank you! Our team will confirm your appointment shortly.';

      status.hidden = false;


      /*
       * Automatically hide message after 8 seconds
       */

      setTimeout(function () {
        status.hidden = true;
      }, 8000);

    })

    .catch(function (error) {

      console.error(
        'Appointment form submission error:',
        error
      );


      /*
       * Restore button
       */

      submitBtn.disabled = false;
      submitBtn.textContent = originalButtonText;


      /*
       * Error message
       */

      status.textContent =
        'Something went wrong. Please call or WhatsApp us directly.';

      status.hidden = false;

    });

  });

})();