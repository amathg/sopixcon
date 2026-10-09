// =========================================================
// SOPIXCON — Suivi des événements (dataLayer → Google Tag Manager → GA4)
//
// - Aucun cookie posé ici, aucune donnée personnelle remontée : jamais le nom,
//   l'e-mail, le téléphone ni le message saisis dans le formulaire.
// - Chaque action utile pousse un événement dans window.dataLayer ; GTM les
//   transmet ensuite à Google Analytics 4 (voir le « Plan de taggage GA4 »).
// - Le contexte de page (site_language, content_group) est poussé dans le
//   <head> de chaque page, juste avant le snippet GTM.
// =========================================================
(function () {
  'use strict';

  window.dataLayer = window.dataLayer || [];

  // ---------- Envoi d'un événement dans le dataLayer ----------
  function track(name, params) {
    var evt = { event: name };
    for (var k in params) {
      if (!Object.prototype.hasOwnProperty.call(params, k)) continue;
      var v = params[k];
      if (v === undefined || v === null || v === '') continue;
      evt[k] = typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, 100) : v;
    }
    window.dataLayer.push(evt);
  }
  // Exposé pour main.js (formulaire de contact)
  window.sopixTrack = track;

  // ---------- Outils ----------
  function urlOf(a) {
    try { return new URL(a.getAttribute('href'), window.location.href); } catch (e) { return null; }
  }

  // Où se trouve l'élément cliqué sur la page ?
  function locationOf(el) {
    if (el.closest('.site-header')) return 'header';
    if (el.closest('.site-footer')) return 'footer';
    if (el.closest('.hero, .detail-hero')) return 'hero';
    if (el.closest('.detail-cta')) return 'fin_de_page';
    if (el.closest('.level-nav')) return 'navigation_niveaux';
    if (el.closest('.faq-card, .faq-answer')) return 'faq';
    var s = el.closest('section[id]');
    if (s) return 'section_' + s.id;
    return 'contenu';
  }

  // Famille de la page de destination (pour l'événement select_content)
  var FAMILIES = [
    [/^\/(?:en\/)?prestation-[a-z-]+\.html$/, 'prestation'],
    [/^\/(?:en\/)?reconditionnement-n[123]\.html$/, 'reconditionnement'],
    [/^\/(?:en\/)?engagement-[a-z-]+\.html$/, 'engagement'],
    [/^\/(?:en\/)?methode-[a-z-]+\.html$/, 'methode'],
    [/^\/(?:en\/)?pourquoi-[a-z-]+\.html$/, 'pourquoi_nous']
  ];
  function contentOf(u) {
    if (!u || u.origin !== window.location.origin) return null;
    for (var i = 0; i < FAMILIES.length; i++) {
      if (FAMILIES[i][0].test(u.pathname)) {
        return { type: FAMILIES[i][1], id: u.pathname.split('/').pop().replace(/\.html$/, '') };
      }
    }
    // Cartes « 3 axes » de l'accueil : #axe-deee, #axe-reconditionnement, #axe-industrielle
    if (/^\/(?:en\/)?(?:index\.html)?$/.test(u.pathname) && /^#axe-/.test(u.hash)) {
      return { type: 'axe', id: u.hash.slice(1) };
    }
    return null;
  }

  // ---------- Clics sur les liens ----------
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var where = locationOf(a);
    var text = (a.textContent || '').replace(/\s+/g, ' ').trim();

    // 1. E-mail / téléphone
    if (/^mailto:/i.test(href)) {
      return track('contact_click', { contact_method: 'email', link_location: where });
    }
    if (/^tel:/i.test(href)) {
      return track('contact_click', { contact_method: 'telephone', link_location: where });
    }

    var u = urlOf(a);

    // 2. Changement de langue
    if (a.classList.contains('lang-switch')) {
      var toEn = u ? /^\/en(\/|$)/.test(u.pathname) : document.documentElement.lang !== 'en';
      return track('language_switch', { language_to: toEn ? 'en' : 'fr' });
    }

    // 3. Menu principal (en-tête) et liens du pied de page
    if (a.closest('#main-nav')) {
      return track('menu_click', { menu_item: text, link_location: 'header' });
    }
    if (a.closest('.footer-links')) {
      return track('menu_click', { menu_item: text, link_location: 'footer' });
    }

    // 4. Boutons d'appel à l'action
    if (a.classList.contains('btn')) {
      var dest = u ? (u.origin === window.location.origin ? u.pathname + u.hash : u.hostname) : href;
      return track('cta_click', { cta_text: text, link_location: where, cta_destination: dest });
    }

    // 5. Cartes et liens vers les pages de détail
    var c = contentOf(u);
    if (c) {
      track('select_content', { content_type: c.type, content_id: c.id, link_location: where });
    }
  });

  // ---------- FAQ : ouverture d'une question (clic ou clavier sur le titre) ----------
  document.addEventListener('click', function (e) {
    var s = e.target.closest ? e.target.closest('summary') : null;
    if (!s) return;
    var d = s.parentNode;
    // d.open vaut encore l'état AVANT le clic : on ne compte que les ouvertures
    if (!d || !d.classList || !d.classList.contains('faq-card') || d.open) return;
    var h = s.querySelector('h3');
    track('faq_open', {
      faq_question: (h || s).textContent,
      faq_location: d.closest('.faq-home') ? 'accueil' : 'page_faq'
    });
  });

  // ---------- FAQ : recherche (après 1 s sans frappe, 3 caractères minimum) ----------
  var searchInput = document.getElementById('faq-search');
  if (searchInput) {
    var searchTimer, lastTerm = '';
    searchInput.addEventListener('input', function () {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function () {
        var q = searchInput.value.trim().toLowerCase();
        if (q.length < 3 || q === lastTerm) return;
        lastTerm = q;
        track('search', {
          search_term: q,
          search_results: document.querySelectorAll('.faq-card:not([hidden])').length
        });
      }, 1000);
    });
  }

  // ---------- Formulaire de contact : premier champ utilisé ----------
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('focusin', function onFirstFocus() {
      form.removeEventListener('focusin', onFirstFocus);
      track('contact_form_start', {});
    });
  }

  // ---------- Sections de l'accueil réellement consultées ----------
  // Une section est « vue » quand son haut atteint le milieu de l'écran
  // et qu'elle y reste 0,8 s (évite de compter les sections survolées par un scroll rapide).
  var SECTIONS = ['a-propos', 'prestations', 'methode', 'resultats', 'pourquoi-nous', 'faq', 'contact'];
  if ('IntersectionObserver' in window) {
    var timers = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var id = en.target.id;
        if (en.isIntersecting) {
          timers[id] = setTimeout(function () {
            io.unobserve(en.target);
            track('section_view', { section_id: id });
          }, 800);
        } else if (timers[id]) {
          clearTimeout(timers[id]);
          delete timers[id];
        }
      });
    }, { rootMargin: '0px 0px -50% 0px', threshold: 0 });
    SECTIONS.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.tagName === 'SECTION') io.observe(el);
    });
  }
})();
