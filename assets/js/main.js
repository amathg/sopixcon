// =========================================================
// SOPIXCON — Script principal du site
// =========================================================

document.addEventListener('DOMContentLoaded', function () {

  // ---------- Langue (FR / EN) ----------
  var isEN = document.documentElement.lang === 'en';
  var T = isEN ? {
    required: 'Please fill in all required fields (*) and tick the consent box.',
    email: 'Please enter a valid email address.',
    thanks: function (n) { return 'Thank you ' + n + ', your request has been received. We will get back to you within 48 hours.'; },
    error: 'Something went wrong while sending your message. Please try again or contact us directly by email.'
  } : {
    required: 'Merci de remplir tous les champs obligatoires (*) et d\'accepter le consentement.',
    email: 'Merci de saisir une adresse e-mail valide.',
    thanks: function (n) { return 'Merci ' + n + ', votre demande a bien été enregistrée. Nous revenons vers vous sous 48h.'; },
    error: 'Une erreur est survenue lors de l\'envoi. Merci de réessayer ou de nous contacter directement par e-mail.'
  };
  // Mémorise le choix de langue quand le visiteur clique sur FR / EN
  document.querySelectorAll('.lang-switch').forEach(function (a) {
    a.addEventListener('click', function () {
      try { localStorage.setItem('sopixcon-lang', a.getAttribute('hreflang')); } catch (e) {}
    });
  });


  // ---------- Année dynamique dans le footer ----------
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  // ---------- Menu mobile ----------
  var navToggle = document.getElementById('nav-toggle');
  var mainNav = document.getElementById('main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Ferme le menu quand on clique sur un lien (mobile)
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------- Bouton "retour en haut" ----------
  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Header : ombre au scroll ----------
  var header = document.getElementById('header');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 10) {
      header.style.boxShadow = '0 4px 16px rgba(8,21,39,0.25)';
    } else {
      header.style.boxShadow = '';
    }
  });

  // ---------- Apparition au scroll ----------
  var revealTargets = document.querySelectorAll(
    '.axe-card, .engagement-card, .why-card, .step, .volet-card, .founders, .stat'
  );
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity .5s ease, transform .5s ease';
      observer.observe(el);
    });
  }

  // ---------- Formulaire de contact ----------
  // Envoi réel des messages via Formspree (https://formspree.io/f/mwvgwnyg).
  // La validation se fait côté client, puis l'envoi se fait en AJAX (fetch)
  // pour rester sur la page et afficher le message de confirmation.
  var form = document.getElementById('contact-form');
  var feedback = document.getElementById('form-feedback');

  // Suivi (dataLayer → GTM → GA4) : voir assets/js/tracking.js
  var track = window.sopixTrack || function () {};
  var LEAD_TYPES = { audit: 'prestation_industrielle', deee: 'recyclage_deee', reconditionnement: 'reconditionnement', autre: 'autre' };

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nom = form.nom.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();
      var consentement = form.consentement.checked;

      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!nom || !email || !message || !consentement) {
        showFeedback(T.required, 'error');
        track('contact_form_error', { error_type: 'champs_manquants' });
        return;
      }
      if (!emailPattern.test(email)) {
        showFeedback(T.email, 'error');
        track('contact_form_error', { error_type: 'email_invalide' });
        return;
      }

      var leadType = LEAD_TYPES[form.besoin ? form.besoin.value : ''] || 'autre';
      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          showFeedback(T.thanks(nom), 'success');
          form.reset();
          track('generate_lead', { lead_type: leadType });
        } else {
          showFeedback(T.error, 'error');
          track('contact_form_error', { error_type: 'erreur_serveur' });
        }
      }).catch(function () {
        showFeedback(T.error, 'error');
        track('contact_form_error', { error_type: 'erreur_reseau' });
      }).finally(function () {
        if (submitBtn) submitBtn.disabled = false;
      });
    });
  }

  function showFeedback(msg, type) {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.className = 'form-feedback ' + type;
  }

});