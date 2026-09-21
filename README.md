# Portfolio — ZANGO-DIALLO Ibrahima

Portfolio personnel développé avec **React 19** et **Vite**, construit avec une
architecture modulaire par composants.

## ✨ Fonctionnalités

- 🌗 **Thème clair / sombre** persistant (localStorage)
- 🧭 **Navbar sticky** avec scroll-spy, barre de progression et menu mobile
- ⌨️ **Effet machine à écrire** sur les rôles dans le Hero
- 🎞️ **Animations d'apparition** au scroll (IntersectionObserver)
- 🗂️ **Filtre de projets** par catégorie (Web, Mobile, Data, IA)
- 📬 **Formulaire de contact** avec validation et brouillon mailto prérempli
- ♿ Accessible : navigation clavier, `aria-*`, `prefers-reduced-motion` respecté
- 📱 100 % responsive (desktop, tablette, mobile)

## 🏗️ Architecture

```
src/
├── main.jsx                  # Point d'entrée
├── App.jsx                   # Composition de la page
├── App.css                   # Styles partagés (sections, boutons, tags)
├── index.css                 # Design system (variables, thèmes, utilitaires)
├── assets/
├── data/                     # ← Toutes les données éditables
│   ├── profile.js            #    Identité, contacts, langues, centres d'intérêt
│   ├── skills.js             #    Compétences techniques & qualités
│   ├── projects.js           #    Projets du portfolio
│   └── experience.js         #    Expériences, formation, certifications
├── hooks/                    # Logique réutilisable
│   ├── useTheme.js           #    Thème clair/sombre persistant
│   ├── useActiveSection.js   #    Scroll-spy (IntersectionObserver)
│   ├── useScrolled.js        #    Détection de scroll
│   ├── useReveal.js          #    Animations d'apparition
│   ├── useTypewriter.js      #    Effet machine à écrire
│   └── index.js
└── components/
    ├── ui/                   # Primitives génériques
    │   ├── Icon.jsx          #    Set d'icônes SVG centralisé
    │   ├── Section.jsx       #    Wrapper de section (eyebrow + titre)
    │   ├── Button.jsx        #    Bouton polymorphe (a / button)
    │   └── Tag.jsx
    ├── layout/
    │   ├── Navbar.jsx        #    Navigation + thème + menu mobile
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
