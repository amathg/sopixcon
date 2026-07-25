# Site vitrine Sopixcon — Documentation rapide

Site one-page conforme au cahier des charges (accueil, qui sommes-nous, prestations,
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

## Ajouter / remplacer une image ou le logo

Le site n'utilise aujourd'hui aucune image (uniquement des icônes vectorielles en
CSS/SVG) en l'attente des visuels et du logo Sopixcon.

1. Déposer les fichiers images dans un dossier `assets/img/`.
2. Remplacer le logo texte dans `index.html` :
   ```html
   <a href="#accueil" class="logo">SOPIX<span>CON</span></a>
   ```
   par :
   ```html
   <a href="#accueil" class="logo"><img src="assets/img/logo-sopixcon.png" alt="Sopixcon" height="36"></a>
   ```
3. Pour une photo d'atelier en fond de section, ajouter dans `style.css` :
   ```css
   #qui-sommes-nous{ background-image: url('../img/atelier.jpg'); background-size: cover; }
   ```

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

- Logo Sopixcon et photos/visuels industriels (atelier, équipements)
- Coordonnées réelles (téléphone, e-mail) dans la section Contact
- Branchement réel du formulaire (voir ci-dessus)
- Nom de domaine choisi (ex. sopixcon.com / sopixcon.sn)
- Intégration Google Analytics / Search Console si souhaité
- Mentions légales et politique de confidentialité (liens déjà prévus en pied de page)
