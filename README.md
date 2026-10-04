# Site vitrine Sopixcon — Documentation rapide

Site one-page conforme au cahier des charges (accueil, A propos, prestations,
méthode, résultats & engagements, pourquoi nous choisir, contact). Responsive
mobile / tablette / desktop, sans dépendance externe (pas de framework, pas de CMS).

## Structure des fichiers

```
sopixcon-site/
├── index.html            → tout le contenu du site
├── assets/
│   ├── css/style.css     → mise en page et charte graphique
│   └── js/main.js        → menu mobile, formulaire, animations
└── README.md
```

## Modifier un texte

Ouvrir `index.html` dans un éditeur de texte (ou un CMS type WordPress si le site y
est migré plus tard). Chaque section est identifiée par un commentaire
`<!-- ===== ... ===== -->` et un `id` (ex: `id="qui-sommes-nous"`). Repérer le texte
à changer entre les balises `<p>`, `<h2>`, `<h3>` et le remplacer directement.

## Images du site

Les photos proviennent de Pexels (licence Pexels : usage commercial gratuit,
attribution non obligatoire) et sont chargées directement depuis leur CDN
(`images.pexels.com`, en plusieurs tailles selon l'écran).

| Emplacement | Photo |
|---|---|
| Fond de l'accueil | https://www.pexels.com/photo/2081132/ |
| A propos · fond pages Engagements | https://www.pexels.com/photo/3862619/ |
| Axe 01 · fond pages Test / Méthode / Supply Chain | https://www.pexels.com/photo/10699354/ |
| Axe 02 — DEEE | https://www.pexels.com/photo/9953442/ |
| Axe 03 · fond pages N1 / N2 / N3 | https://www.pexels.com/photo/2136243/ |
| Bandeau « Notre approche » · fond pages Méthode | https://www.pexels.com/photo/9242855/ |
| Pourquoi nous · fond pages Pourquoi | https://www.pexels.com/photo/30689114/ |

**Remplacer par une vraie photo Sopixcon** : déposer le fichier dans `assets/img/`
puis remplacer l'adresse `https://images.pexels.com/...` correspondante par
`assets/img/mon-fichier.jpg` (dans `index.html`, attributs `src` et `srcset` — le
`srcset` peut simplement être supprimé) ou par `../img/mon-fichier.jpg` dans
`assets/css/style.css` (fonds : accueil, bandeau, pages détail — bloc « PHOTOS »
en fin de fichier).

**Logo** : remplacer `      <a href="index.html" class="logo"><img src="assets/logo.png" alt="Sopixcon" style="height:40px; width:auto; display:block;"></a>    `
par `<a href="index.html" class="logo"><img src="assets/img/logo-sopixcon.png" alt="Sopixcon" height="36"></a>`.

## Brancher le formulaire de contact à un envoi d'e-mail réel

Le formulaire (section Contact) valide les champs et affiche une confirmation, mais
n'envoie pas encore d'e-mail — cela nécessite un service tiers ou un script serveur.
Deux options simples, sans back-end à héberger :

**Option A — Formspree (le plus rapide)**
1. Créer un compte sur formspree.io et récupérer l'URL de formulaire.
2. Dans `index.html`, ajouter `action` et `method` à la balise `<form>` :
   ```html
   <form id="contact-form" class="contact-form" action="https://formspree.io/f/VOTRE_ID" method="POST">
   ```
3. Supprimer ou adapter le `e.preventDefault()` dans `main.js` si vous laissez
   Formspree gérer l'envoi et la redirection.

**Option B — EmailJS**
Permet un envoi en JavaScript pur sans recharger la page. Voir la documentation
EmailJS pour la clé API à insérer dans `main.js`, à la place du commentaire
"Emplacement pour brancher un envoi réel".

## Nom de domaine & hébergement

Le site est statique (HTML/CSS/JS) : il peut être déployé sur n'importe quel
hébergement standard (OVH, o2switch, Netlify, Vercel, GitHub Pages...). Prévoir un
certificat SSL (https), généralement inclus automatiquement chez ces hébergeurs.

## À finaliser avant mise en ligne

- Logo Sopixcon ; à terme, remplacer les photos Pexels par de vraies photos de l'atelier
- Coordonnées réelles (téléphone, e-mail) dans la section Contact
- Branchement réel du formulaire (voir ci-dessus)
- Nom de domaine choisi (ex. sopixcon.com / sopixcon.sn)
- Intégration Google Analytics / Search Console si souhaité
- Mentions légales et politique de confidentialité (liens déjà prévus en pied de page)
