// =========================================================
// SOPIXCON — Script principal du site
// =========================================================

document.addEventListener('DOMContentLoaded', function () {

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
  // NOTE : ce formulaire fonctionne côté client (validation + message de
  // confirmation). Pour un envoi d'e-mail réel, connectez-le à un service
  // comme Formspree, EmailJS ou un script serveur — voir README.md,
  // section "Brancher le formulaire de contact".
  var form = document.getElementById('contact-form');
  var feedback = document.getElementById('form-feedback');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nom = form.nom.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();
      var consentement = form.consentement.checked;

      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!nom || !email || !message || !consentement) {
        showFeedback('Merci de remplir tous les champs obligatoires (*) et d\'accepter le consentement.', 'error');
        return;
      }
      if (!emailPattern.test(email)) {
        showFeedback('Merci de saisir une adresse e-mail valide.', 'error');
        return;
      }

      // Emplacement pour brancher un envoi réel (fetch vers Formspree /
      // EmailJS / API interne). Pour l'instant : confirmation locale.
      showFeedback('Merci ' + nom + ', votre demande a bien été enregistrée. Nous revenons vers vous sous 48h.', 'success');
      form.reset();
    });
  }

  function showFeedback(msg, type) {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.className = 'form-feedback ' + type;
  }

});
