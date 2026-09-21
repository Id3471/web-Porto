export const projects = [
  {
    id: 'reunions',
    title: 'Plateforme de gestion de réunions',
    description:
      'Application web complète d’organisation de réunions : authentification, gestion des rôles, création et validation des réunions, et notifications automatiques.',
    tech: ['Laravel', 'MySQL', 'Blade', 'Bootstrap'],
    category: 'Web',
    icon: 'calendar',
    highlights: ['Auth & rôles', 'Workflow de validation', 'Notifications'],
    links: { demo: null, github: null },
  },
  {
    id: 'projet-manager',
    title: 'Site de gestion de projets',
    description:
      'Plateforme de suivi de projets et de tâches avec tableau de bord, attribution des tâches, échéances et suivi d’avancement en temps réel.',
    tech: ['PHP', 'MySQL', 'JavaScript'],
    category: 'Web',
    icon: 'kanban',
    highlights: ['Tableau de bord', 'Suivi des tâches', 'Multi-utilisateurs'],
    links: { demo: null, github: null },
  },
  {
    id: 'groupe-scolaire',
    title: 'Site vitrine groupe scolaire',
    description:
      'Site web dynamique pour un groupe scolaire : présentation des établissements, actualités, inscriptions en ligne et espace d’administration.',
    tech: ['WordPress', 'PHP', 'CSS'],
    category: 'Web',
    icon: 'school',
    highlights: ['Inscriptions en ligne', 'Gestion d’actualités', 'Admin back-office'],
    links: { demo: null, github: null },
  },
  {
    id: 'mobile-app',
    title: 'Application mobile cross-platform',
    description:
      'Application mobile développée avec React Native : interface moderne, consommation d’API REST et gestion d’état global.',
    tech: ['React Native', 'REST API', 'AsyncStorage'],
    category: 'Mobile',
    icon: 'smartphone',
    highlights: ['iOS & Android', 'API REST', 'Design moderne'],
    links: { demo: null, github: null },
  },
  {
    id: 'ml-analyse',
    title: 'Analyse de données & Machine Learning',
    description:
      'Pipeline d’analyse et de visualisation de données en Python : nettoyage, exploration et modèles de prédiction avec scikit-learn.',
    tech: ['Python', 'Pandas', 'scikit-learn', 'Matplotlib'],
    category: 'Data',
    icon: 'chart',
    highlights: ['Nettoyage de données', 'Modèles prédictifs', 'Visualisations'],
    links: { demo: null, github: null },
  },
  {
    id: 'chatbot',
    title: 'Agent conversationnel IA',
    description:
      'Assistant intelligent avec architecture multi-agents et intégration d’outils externes (RAG, mémoire de conversation).',
    tech: ['TypeScript', 'Mastra', 'LLM'],
    category: 'IA',
    icon: 'bot',
    highlights: ['Multi-agents', 'RAG & mémoire', 'Intégration outils'],
    links: { demo: null, github: null },
  },
]

export const projectCategories = ['Tous', 'Web', 'Mobile', 'Data', 'IA']
