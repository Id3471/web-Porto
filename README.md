# Portfolio — ZANGO-DIALLO Ibrahima

Portfolio personnel développé avec **React 19** et **Vite**, construit avec une
architecture modulaire par composants.

## ✨ Fonctionnalités

- 🌙 **Interface sombre** avec palette nocturne cohérente
- 🧭 **Navbar sticky** avec scroll-spy, barre de progression et menu mobile
- ⌨️ **Effet machine à écrire** sur les rôles dans le Hero
- 🎞️ **Animations d'apparition** au scroll (IntersectionObserver)
- 🗂️ **Filtre de projets** par catégorie (Web, Mobile, Data, IA)
- 📬 **Formulaire de contact** avec envoi direct par e-mail et confirmation
- 📄 **Téléchargement du CV** après publication du PDF dans l’administration
- ♿ Accessible : navigation clavier, `aria-*`, `prefers-reduced-motion` respecté
- 📱 100 % responsive (desktop, tablette, mobile)

## 🏗️ Architecture

```
src/
├── main.jsx                  # Point d'entrée
├── App.jsx                   # Composition de la page
├── App.css                   # Styles partagés (sections, boutons, tags)
├── index.css                 # Design system sombre (variables, utilitaires)
├── assets/
├── data/                     # ← Toutes les données éditables
│   ├── profile.js            #    Identité, contacts, langues, centres d'intérêt
│   ├── skills.js             #    Compétences techniques & qualités
│   ├── projects.js           #    Projets du portfolio
│   ├── experience.js         #    Expériences, formation, certifications
│   ├── PortfolioContext.jsx  #    Chargement des données publiques de l'API
│   └── portfolioDefaults.js  #    Valeurs de repli pour le contenu éditorial
├── hooks/                    # Logique réutilisable
│   ├── useActiveSection.js   #    Scroll-spy (IntersectionObserver)
│   ├── useScrolled.js        #    Détection de scroll
│   ├── useReveal.js          #    Animations d'apparition
│   ├── useTypewriter.js      #    Effet machine à écrire
│   ├── usePortfolio.js       #    Accès aux données éditoriales partagées
│   └── index.js
├── admin/                    # Interface de gestion responsive
│   ├── Admin.jsx             #    Session, sauvegarde et composition des onglets
│   ├── adminConfig.js        #    Onglets, libellés et modèles de contenu
│   ├── components/           #    Champs, éditeurs de listes et structure commune
│   ├── pages/                #    Une page par onglet de l’administration
│   └── Admin.css             #    Styles de l'espace d'administration
└── components/
    ├── ui/                   # Primitives génériques
    │   ├── Icon.jsx          #    Set d'icônes SVG centralisé
    │   ├── Section.jsx       #    Wrapper de section (eyebrow + titre)
    │   ├── Button.jsx        #    Bouton polymorphe (a / button)
    │   └── Tag.jsx
    ├── layout/
    │   ├── Navbar.jsx        #    Navigation + menu mobile
    │   └── Footer.jsx
    └── sections/             # Une section = un dossier de la page
        ├── Hero.jsx          #    Bannière d'introduction
        ├── About.jsx         #    À propos + langues + intérêts
        ├── Skills.jsx        #    Compétences + qualités
        ├── Projects.jsx      #    Projets filtrables
        ├── Experience.jsx    #    Timeline expérience + formation
        ├── Contact.jsx       #    Contact + formulaire
        └── BackToTop.jsx
```

Chaque section possède son fichier CSS (`Component.css`) importé par le
composant — les styles sont co-localisés et l'arborescence reste à plat.

## 🚀 Démarrage

```bash
npm install     # installer les dépendances
npm run dev     # serveur de développement (http://localhost:5173)
```

## 📦 Scripts

| Commande         | Description                    |
| ---------------- | ------------------------------ |
| `npm run dev`    | Serveur de développement Vite  |
| `npm run build`  | Build de production (`dist/`)  |
| `npm run preview`| Prévisualiser le build         |
| `npm run lint`   | Linter ESLint                  |

## ✏️ Personnaliser le contenu

Tout le contenu éditorial vit dans `src/data/` : modifiez ces fichiers pour
mettre à jour vos infos, projets et expériences sans toucher aux composants.

## 🔐 Administration du portfolio

Un lien **Administration** est disponible dans le pied de page. L’espace privé
permet de modifier le profil et les coordonnées, d’ajouter ou supprimer des
projets, compétences, expériences, formations et certifications, de remplacer
le CV PDF et de modifier les identifiants administrateur. Le contenu enregistré
est publié sur le site à partir de l’API Laravel.

Pour activer ces fonctions :

1. Démarrez le backend Laravel, configurez sa base de données et renseignez
   `FRONTEND_URL` dans son fichier `.env` avec l’origine exacte du site.
2. Dans `backend/`, exécutez `php artisan migrate`, puis
   `php artisan admin:create` pour créer le premier compte de manière
   interactive. Aucun mot de passe par défaut n’est fourni.
3. Pour les fichiers CV sur le disque local, définissez
   `FILESYSTEM_DISK=public` et exécutez `php artisan storage:link`.
4. En local, lancez Vite et Laravel sur les ports par défaut. Le proxy Vite
   transmet les appels au backend ; `BACKEND_URL` permet de remplacer son URL.
5. En production, définissez `VITE_API_URL` lors de la compilation du front-end
   avec l’URL de l’API. Si l’API est sur un autre site, configurez des cookies
   de session sécurisés compatibles avec les requêtes inter-sites et HTTPS ;
   un reverse proxy sur le même site est recommandé lorsque le navigateur
   bloque les cookies tiers.
6. Pour recevoir les messages du formulaire, configurez dans `backend/.env`
   un transport SMTP fonctionnel, l’adresse expéditrice vérifiée
   `MAIL_FROM_ADDRESS` et la boîte destinataire `CONTACT_TO_EMAIL`. Les
   identifiants du fournisseur e-mail restent dans `.env` et ne doivent jamais
   être publiés. En local, les appels `/contact` et `/cv` sont aussi transmis
   au backend par le proxy Vite.

Le contenu d’origine sert de valeur initiale jusqu’au premier enregistrement.
Les routes privées exigent une session Laravel, un compte administrateur et un
jeton CSRF pour les modifications.
