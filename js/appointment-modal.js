/*!
 * Appointment Modal — Dr. Zahers Aesthetic Dental Center
 * Drop-in, self-contained popup booking form.
 *
 * USAGE: add this one line before </body> on every page:
 *   <script src="js/appointment-modal.js" defer></script>
 *
 * It automatically:
 *  - injects its own CSS (no changes needed to styles.css)
 *  - injects the modal markup into the page
 *  - opens the popup when ANY link/button pointing to "#book-appointment"
 *    is clicked (nav links, hero buttons, footer CTA, floating action button, etc.)
 *  - also opens for any element with [data-open-appointment]
 *
 * Works on pages that don't have a #book-appointment section at all —
 * the popup itself IS the booking form on those pages.
 */
(function () {
  'use strict';

  // avoid double-init if the script is accidentally included twice
  if (window.__appointmentModalLoaded) return;
  window.__appointmentModalLoaded = true;

  var CSS = '\
  .apt-modal-overlay{\
    position:fixed; inset:0; z-index:999; display:flex; align-items:center; justify-content:center;\
    padding:20px; background:rgba(42,24,16,.55); backdrop-filter:blur(3px);\
    opacity:0; visibility:hidden; transition:opacity .28s ease, visibility .28s ease;\
    font-family: var(--font-body, "Plus Jakarta Sans", system-ui, sans-serif);\
  }\
  .apt-modal-overlay.open{opacity:1; visibility:visible;}\
  body.apt-modal-open{overflow:hidden;}\
  .apt-modal-box{\
    position:relative; width:100%; max-width:640px; max-height:90vh; overflow-y:auto;\
    background:#fff; border-radius:var(--radius-lg, 24px); box-shadow:var(--shadow-float, 0 25px 60px -20px rgba(20,22,60,.35));\
    padding:36px 30px 30px; transform:translateY(24px) scale(.97); opacity:0;\
    transition:transform .32s cubic-bezier(.2,.8,.2,1), opacity .28s ease;\
    box-sizing:border-box;\
  }\
  .apt-modal-box *{box-sizing:border-box;}\
  .apt-modal-overlay.open .apt-modal-box{transform:translateY(0) scale(1); opacity:1;}\
  .apt-modal-close{\
    position:absolute; top:16px; right:16px; width:36px; height:36px; border-radius:50%; border:none; cursor:pointer;\
    display:flex; align-items:center; justify-content:center; background:var(--surface-tint, #f3ece3);\
    color:var(--brand-ink, #2a1810); transition:background .2s ease, transform .2s ease;\
  }\
  .apt-modal-close:hover{background:var(--brand-soft, #f3ece3); transform:rotate(90deg);}\
  .apt-modal-close svg{width:18px; height:18px; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round;}\
  .apt-modal-head{margin-bottom:22px; padding-right:30px;}\
  .apt-modal-eyebrow{display:flex; align-items:center; gap:8px; font-size:12.5px; font-weight:700; letter-spacing:.24em; color:var(--brand, #6b4530); text-transform:uppercase;}\
  .apt-modal-eyebrow .line{width:24px; height:1px; background:var(--brand, #6b4530); display:inline-block;}\
  .apt-modal-head h3{margin:10px 0 0; font-size:clamp(22px,3.2vw,28px); font-weight:800; color:var(--brand-ink, #2a1810); letter-spacing:-.01em;}\
  .apt-modal-head p{margin-top:8px; font-size:14.5px; line-height:1.6; color:var(--muted, #8a7768);}\
  .apt-modal-form{padding:0; box-shadow:none; background:transparent;}\
  .apt-form-row{display:grid; gap:16px; margin-bottom:16px;}\
  @media (min-width:560px){.apt-form-row{grid-template-columns:1fr 1fr;}}\
  .apt-field label{display:block; font-size:13.5px; font-weight:700; color:var(--brand-ink, #2a1810); margin-bottom:7px;}\
  .apt-field input, .apt-field select, .apt-field textarea{\
    width:100%; height:46px; border-radius:12px; border:1px solid var(--border, #e7ddd0); background:#fff;\
    padding:0 14px; font-size:14.5px; font-family:inherit; color:var(--brand-ink, #2a1810);\
  }\
  .apt-field select{height:46px;}\
  .apt-field input:focus, .apt-field select:focus, .apt-field textarea:focus{outline:none; border-color:var(--brand, #6b4530);}\
  .apt-form-actions{margin-top:6px; display:flex; flex-wrap:wrap; gap:12px;}\
  .apt-btn-primary{\
    height:48px; padding:0 26px; border:none; border-radius:999px; cursor:pointer;\
    background:var(--brand, #6b4530); color:#fff; font-size:14.5px; font-weight:700; font-family:inherit;\
    box-shadow:var(--shadow-soft, 0 10px 30px -12px rgba(20,22,60,.18)); transition:background .2s ease;\
  }\
  .apt-btn-primary:hover{background:var(--brand-dark, #4a2f1f);}\
  .apt-modal-status{\
    margin-top:14px; padding:12px 16px; border-radius:14px; background:var(--brand-soft, #f3ece3);\
    color:var(--brand-dark, #4a2f1f); font-size:13.5px; font-weight:600; text-align:center;\
  }\
  @media (max-width:480px){\
    .apt-modal-box{padding:28px 20px 22px; border-radius:20px;}\
  }';

  function injectCSS() {
    var style = document.createElement('style');
    style.setAttribute('data-appointment-modal', '');
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  var HTML = '' +
    '<div class="apt-modal-overlay" id="appointmentModalOverlay">' +
      '<div class="apt-modal-box" role="dialog" aria-modal="true" aria-labelledby="appointmentModalTitle" id="appointmentModalBox">' +
        '<button type="button" class="apt-modal-close" id="appointmentModalClose" aria-label="Close appointment form">' +
          '<svg viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>' +
        '</button>' +
        '<div class="apt-modal-head">' +
          '<span class="apt-modal-eyebrow"><span class="line"></span>Book Now</span>' +
          '<h3 id="appointmentModalTitle">Book an Appointment</h3>' +
          '<p>Fill in your details and our team will confirm a time with you shortly.</p>' +
        '</div>' +
        '<form class="apt-modal-form" id="appointmentModalForm" aria-label="Book an appointment form">' +
          '<div class="apt-form-row">' +
            '<div class="apt-field">' +
              '<label for="modalFullname">Full Name</label>' +
              '<input id="modalFullname" name="fullname" type="text" placeholder="Your name" autocomplete="name" required>' +
            '</div>' +
            '<div class="apt-field">' +
              '<label for="modalPhone">Phone Number</label>' +
              '<input id="modalPhone" name="phone" type="tel" placeholder="+971 5x xxx xxxx" autocomplete="tel" required>' +
            '</div>' +
          '</div>' +
          '<div class="apt-form-row">' +
            '<div class="apt-field">' +
              '<label for="modalEmail">Email Address</label>' +
              '<input id="modalEmail" name="email" type="email" placeholder="you@example.com" autocomplete="email">' +
            '</div>' +
            '<div class="apt-field">' +
              '<label for="modalDate">Preferred Date</label>' +
              '<input id="modalDate" name="date" type="date">' +
            '</div>' +
          '</div>' +
          '<div class="apt-form-row">' +
            '<div class="apt-field">' +
              '<label for="modalTreatment">Treatment</label>' +
              '<select id="modalTreatment" name="treatment">' +
                '<option>Consultation</option>' +
                '<option>Dental Implants</option>' +
                '<option>Veneers &amp; Smile Design</option>' +
                '<option>Cleaning, Polishing &amp; Whitening</option>' +
                '<option>Root Canal Treatment</option>' +
                '<option>Full Mouth Rehabilitation</option>' +
              '</select>' +
            '</div>' +
            '<div class="apt-field">' +
              '<label for="modalDoctor">Preferred Doctor</label>' +
              '<select id="modalDoctor" name="doctor">' +
                '<option>No Preference</option>' +
                '<option>Dr. Zaher Mine — GP Dentist</option>' +
                '<option>Dr. Joji Markose — Specialist Prosthodontist / PhD Implantologist</option>' +
              '</select>' +
            '</div>' +
          '</div>' +
          '<div class="apt-form-actions">' +
            '<button type="submit" class="apt-btn-primary">Book an Appointment</button>' +
          '</div>' +
          '<p class="apt-modal-status" id="appointmentModalStatus" hidden>Thank you! Our team will confirm your appointment shortly.</p>' +
        '</form>' +
      '</div>' +
    '</div>';

  function injectHTML() {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = HTML;
    document.body.appendChild(wrapper.firstChild);
  }

  function init() {
    injectCSS();
    injectHTML();

    var overlay = document.getElementById('appointmentModalOverlay');
    var box = document.getElementById('appointmentModalBox');
    var closeBtn = document.getElementById('appointmentModalClose');
    var form = document.getElementById('appointmentModalForm');
    var status = document.getElementById('appointmentModalStatus');
    var lastFocused = null;

    function openModal(e) {
      if (e) e.preventDefault();
      lastFocused = document.activeElement;
      if (status) status.hidden = true;
      overlay.classList.add('open');
      document.body.classList.add('apt-modal-open');
      var firstField = box.querySelector('input, select, textarea');
      if (firstField) firstField.focus();

      // close any site mobile/floating menus that might be open behind it
      document.querySelectorAll('.mobile-nav.open').forEach(function (el) { el.classList.remove('open'); });
      document.querySelectorAll('.float-menu.open').forEach(function (el) { el.classList.remove('open'); });
      document.querySelectorAll('#floatToggle.open').forEach(function (el) { el.classList.remove('open'); });
    }

    function closeModal() {
      overlay.classList.remove('open');
      document.body.classList.remove('apt-modal-open');
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    // open for any link/button pointing to #book-appointment, plus explicit opt-in attribute
    document.querySelectorAll('a[href="#book-appointment"], [data-open-appointment]').forEach(function (el) {
      el.addEventListener('click', openModal);
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.hidden = false;
      form.reset();
    });

    // expose a manual trigger, e.g. onclick="window.openAppointmentModal()"
    window.openAppointmentModal = openModal;

    autoOpenOnFirstVisit(openModal);
  }

  var FIRST_VISIT_KEY = 'aptModalSeen';

  function isHomepage() {
    var path = window.location.pathname;
    // matches "", "/", "/index.html", "/website/", "/website/index.html" etc.
    return /(^|\/)(index\.html)?$/.test(path);
  }

  function autoOpenOnFirstVisit(openModal) {
    if (!isHomepage()) return;

    var alreadySeen;
    try {
      alreadySeen = localStorage.getItem(FIRST_VISIT_KEY);
    } catch (err) {
      // localStorage unavailable (privacy mode, disabled cookies, etc.) — skip auto-open silently
      return;
    }

    if (alreadySeen) return;

    // small delay so the popup doesn't fight the page's own load/entrance animations
    window.setTimeout(function () {
      openModal();
      try {
        localStorage.setItem(FIRST_VISIT_KEY, 'true');
      } catch (err) {
        // ignore write failures (e.g. storage full or blocked)
      }
    }, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();