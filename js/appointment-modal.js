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
 *
 * NOTE: every element this script injects is namespaced with the
 * "aptPopup..." id prefix (aptPopupForm, aptPopupDate, etc). This is
 * deliberate — some pages (like the homepage) already have their own
 * booking form with ids like "appointmentModalForm"/"modalDate". Reusing
 * those same ids here caused document.getElementById() to grab the
 * wrong <form> (duplicate ids resolve to whichever one appears first in
 * the page), which is why submissions were failing on those pages. Keep
 * these ids unique to this file.
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
  .apt-field-hint{display:block; margin-top:6px; font-size:12.5px; color:var(--muted, #8a7768);}\
  @media (max-width:480px){\
    .apt-modal-box{padding:28px 20px 22px; border-radius:20px;}\
  }';

  function injectCSS() {
    var style = document.createElement('style');
    style.setAttribute('data-appointment-modal', '');
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  // Google Form this modal submits to, and the entry IDs for each field
  // (taken from the "Dr-zaheers appointment" Google Form's HTML source).
  var GOOGLE_FORM_ACTION = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLScauGVV-Lam5UfTCucb4tVY7LpdPBc3hmUTsRogdD-u-P2lHQ/formResponse';

  var HTML = '' +
    '<div class="apt-modal-overlay" id="aptPopupOverlay">' +
      '<div class="apt-modal-box" role="dialog" aria-modal="true" aria-labelledby="aptPopupTitle" id="aptPopupBox">' +
        '<button type="button" class="apt-modal-close" id="aptPopupClose" aria-label="Close appointment form">' +
          '<svg viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>' +
        '</button>' +
        '<div class="apt-modal-head">' +
          '<span class="apt-modal-eyebrow"><span class="line"></span>Book Now</span>' +
          '<h3 id="aptPopupTitle">Book an Appointment</h3>' +
          '<p>Fill in your details and our team will confirm a time with you shortly.</p>' +
        '</div>' +
        '<form class="apt-modal-form" id="aptPopupForm" aria-label="Book an appointment form" ' +
              'action="' + GOOGLE_FORM_ACTION + '" method="POST" target="aptHiddenFrame">' +
          '<div class="apt-form-row" style="margin-bottom: 15px;">' +
            '<div class="apt-field">' +
              '<label for="aptPopupFullname">First Name</label>' +
              '<input id="aptPopupFullname" name="entry.2070707873" type="text" placeholder="First name" autocomplete="given-name" required>' +
            '</div>' +
            '<div class="apt-field">' +
              '<label for="aptPopupLastname">Last Name</label>' +
              '<input id="aptPopupLastname" name="entry.1107755455" type="text" placeholder="Last name" autocomplete="family-name">' +
            '</div>' +
          '</div>' +
          '<div class="apt-form-row">' +
			'<div class="apt-field">' +
              '<label for="aptPopupPhone">Phone Number</label>' +
              '<input id="aptPopupPhone" name="entry.1895314843" type="tel" placeholder="+971 5x xxx xxxx" autocomplete="tel" required>' +
            '</div>' +
            '<div class="apt-field">' +
              '<label for="aptPopupEmail">Email Address</label>' +
              '<input id="aptPopupEmail" name="entry.1377789024" type="email" placeholder="you@example.com" autocomplete="email">' +
            '</div>' +
          '</div>' +
          '<div class="apt-form-row">' +
			'<div class="apt-field">' +
              '<label for="aptPopupDate">Preferred Date</label>' +
              '<input id="aptPopupDate" name="modalDateDisplay" type="text" placeholder="Select a date" autocomplete="off" required readonly>' +
              '<input type="hidden" id="aptPopupDateYear" name="entry.1711041097_year">' +
              '<input type="hidden" id="aptPopupDateMonth" name="entry.1711041097_month">' +
              '<input type="hidden" id="aptPopupDateDay" name="entry.1711041097_day">' +
            '</div>' +
            '<div class="apt-field">' +
              '<label for="aptPopupPlace">Place</label>' +
              '<input id="aptPopupPlace" name="entry.930583085" type="text" placeholder="Your location" autocomplete="off" required>' +
            '</div>' +
          '</div>' +
          '<div class="apt-form-row">' +
            '<div class="apt-field">' +
              '<label for="aptPopupTreatment">Treatment</label>' +
              '<select id="aptPopupTreatment" name="entry.735072590" required>' +
				'<option value="Consultation">Consultation</option>' +
                '<option value="Dental Implants">Dental Implants</option>' +
                '<option value="Veneers &amp; Smile Design">Veneers &amp; Smile Design</option>' +
                '<option value="Cleaning, Polishing &amp; Whitening">Cleaning, Polishing &amp; Whitening</option>' +
                '<option value="Root Canal Treatment">Root Canal Treatment</option>' +
                '<option value="Full Mouth Rehabilitation">Full Mouth Rehabilitation</option>' +
				'<option value="Other">Other</option>' +
              '</select>' +
            '</div>' +
			'<div class="apt-field">' +
              '<label for="aptPopupDoctor">Preferred Doctor</label>' +
              '<select id="aptPopupDoctor" name="entry.1550509698" required>' +
                '<option value="No Preference">No Preference</option>' +
                '<option value="Dr. Zaher Mine">Dr. Zaher Mine — GP Dentist</option>' +
                '<option value="Dr. Joji Markose">Dr. Joji Markose — Specialist Prosthodontist / PhD Implantologist</option>' +
              '</select>' +
            '</div>' +
          '</div>' +
          '<div class="apt-form-actions">' +
            '<button type="submit" class="apt-btn-primary">Book an Appointment</button>' +
          '</div>' +
          '<p class="apt-modal-status" id="aptPopupStatus" hidden>Thank you! Our team will confirm your appointment shortly.</p>' +
        '</form>' +
      '</div>' +
    '</div>' +
    '<iframe name="aptHiddenFrame" id="aptHiddenFrame" style="display:none" aria-hidden="true" tabindex="-1"></iframe>';

  function injectHTML() {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = HTML;
    // HTML has two top-level nodes now (the modal overlay + the hidden iframe)
    while (wrapper.firstChild) {
      document.body.appendChild(wrapper.firstChild);
    }
  }

  // Loads the Flatpickr library (CSS + JS) if it isn't already on the page,
  // then calls back. Pages like the homepage already load Flatpickr for
  // their own inline booking form, so this reuses it instead of loading it
  // twice; other pages get it fetched on demand so the popup stays "drop-in".
  function loadFlatpickr(callback) {
    if (window.flatpickr) { callback(); return; }

    if (window.__aptFlatpickrLoading) {
      document.addEventListener('apt:flatpickr-ready', function ready() {
        document.removeEventListener('apt:flatpickr-ready', ready);
        callback();
      });
      return;
    }
    window.__aptFlatpickrLoading = true;

    if (!document.querySelector('link[href*="flatpickr"]')) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.13/flatpickr.min.css';
      document.head.appendChild(link);
    }

    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.13/flatpickr.min.js';
    script.onload = function () {
      document.dispatchEvent(new Event('apt:flatpickr-ready'));
      callback();
    };
    script.onerror = function () {
      // Offline / blocked — fall back to a plain native date input so
      // booking still works, just without the Sunday restriction.
      callback();
    };
    document.head.appendChild(script);
  }

  function setupDatePicker() {
    var dateInput = document.getElementById('aptPopupDate');
    if (!dateInput) return;

    if (window.flatpickr) {
      window.flatpickr(dateInput, {
        dateFormat: 'Y-m-d',    // value stored/submitted as YYYY-MM-DD
        altInput: true,         // shows a friendlier display format
        altFormat: 'D, d M Y',  // e.g. "Mon, 15 Sep 2026"
        minDate: 'today',
        disable: [
          function (date) {
            return date.getDay() === 0; // 0 = Sunday — disables every Sunday
          }
        ]
      });
    } else {
      // Flatpickr failed to load — fall back to a native date picker
      // (no Sunday restriction, but still usable).
      dateInput.type = 'date';
      dateInput.removeAttribute('readonly');
    }
  }

  function init() {
    injectCSS();
    injectHTML();
    loadFlatpickr(setupDatePicker);

    var overlay = document.getElementById('aptPopupOverlay');
    var box = document.getElementById('aptPopupBox');
    var closeBtn = document.getElementById('aptPopupClose');
    var form = document.getElementById('aptPopupForm');
    var status = document.getElementById('aptPopupStatus');
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

    var dateInput = document.getElementById('aptPopupDate');

    form.addEventListener('submit', function () {
      // Google's date field expects separate year/month/day params, so split
      // the native <input type="date"> value (YYYY-MM-DD) into the three
      // hidden inputs right before the form actually posts.
      if (dateInput && dateInput.value) {
        var parts = dateInput.value.split('-');
        document.getElementById('aptPopupDateYear').value = parts[0] || '';
        document.getElementById('aptPopupDateMonth').value = parts[1] || '';
        document.getElementById('aptPopupDateDay').value = parts[2] || '';
      }
      // Do NOT preventDefault: the form's action/method/target post the data
      // to the Google Form in the background via the hidden iframe, so the
      // page never navigates away. We just show the confirmation and reset.
      status.hidden = false;
      window.setTimeout(function () {
        form.reset();
      }, 300);
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

    // Don't auto-open this popup on pages that already have their own
    // inline booking form (like the homepage's #appointmentModalForm
    // section) — surprising a visitor with a second, separate form is
    // how you end up with two independent submissions (and two emails)
    // for what felt like one booking. The popup can still be opened
    // manually via a "Book Appointment" link/button on such pages.
    if (document.getElementById('appointmentModalForm')) return;

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