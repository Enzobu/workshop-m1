# 🔒 Cyber Escape Game

Un escape game interactif pour sensibiliser les lycéens à la cybersécurité.

## 🎯 Objectif

Un hacker a verrouillé le réseau du lycée ! Les élèves doivent trouver 3 indices cachés dans différents dossiers pour composer un code à 3 chiffres et déverrouiller le système.

## 🎮 Gameplay

- **Durée** : 10-15 minutes
- **Joueurs** : 1-3 (coopératif local)
- **Interface** : Web (navigateur)
- **Contrôles** : Clavier/Souris/Tactile

## 🧩 Les 3 Énigmes

### 1. 📁 Documents - Acrostiche

- **Objectif** : Trouver le mot caché en prenant la première lettre de chaque ligne
- **Solution** : "TROIS" = 3
- **Compétence** : Lecture attentive, logique

### 2. 🖼️ Images - Curseurs

- **Objectif** : Ajuster luminosité et contraste pour révéler un message caché
- **Solution** : "CODE: 7" = 7
- **Compétence** : Observation, manipulation d'outils

### 3. 📧 Mail - Phishing

- **Objectif** : Identifier 3 erreurs dans un email suspect
- **Solution** : 3 erreurs trouvées = 2
- **Compétence** : Esprit critique, cybersécurité

## 🚀 Installation

1. Cloner ou télécharger le projet
2. Ouvrir `index.html` dans un navigateur web
3. C'est tout ! Aucune installation requise.

## 📁 Structure du Projet

```
CyberEscapeGame/
├── index.html              # Page principale
├── src/
│   ├── styles.css          # Styles CSS
│   ├── main.js            # Logique principale
│   └── puzzles/           # Énigmes individuelles
│       ├── doc.js         # Énigme Documents
│       ├── image.js       # Énigme Images
│       └── mail.js        # Énigme Mail
├── assets/
│   └── img/               # Images
│       └── glitch.svg     # Image glitchée
├── data/                  # Données
│   ├── document.txt       # Texte acrostiche
│   └── mail.html          # Email de phishing
└── README.md
```

## 🎨 Fonctionnalités

- ✅ Interface moderne et responsive
- ✅ Timer de 15 minutes
- ✅ Système d'indices (max 3)
- ✅ Validation en temps réel
- ✅ Accessibilité clavier
- ✅ Feedback visuel et sonore
- ✅ Message pédagogique final

## 🔧 Personnalisation

### Modifier les énigmes

- **Documents** : Éditer le texte dans `data/document.txt`
- **Images** : Remplacer `assets/img/glitch.svg`
- **Mail** : Modifier le contenu dans `src/puzzles/mail.js`

### Ajuster la difficulté

- Modifier le timer dans `src/main.js` (ligne 4)
- Changer le nombre d'indices dans `src/main.js` (ligne 10)
- Ajuster les plages de curseurs dans `src/puzzles/image.js`

## 🎓 Objectifs Pédagogiques

- **Cybersécurité** : Reconnaître les emails de phishing
- **Esprit critique** : Analyser les informations
- **Logique** : Résoudre des énigmes
- **Collaboration** : Travailler en équipe
- **Gestion du temps** : Respecter les délais

## 🌐 Compatibilité

- **Navigateurs** : Chrome, Firefox, Safari, Edge
- **Appareils** : Desktop, tablette, mobile
- **Résolution** : Responsive (320px - 1920px+)

## 📝 Notes Techniques

- **Technologies** : HTML5, CSS3, JavaScript ES6+
- **Aucune dépendance** : Fonctionne sans serveur
- **Stockage local** : Utilise localStorage pour la rejouabilité
- **Performance** : Optimisé pour les appareils bas de gamme

## 🤝 Contribution

Ce projet est conçu pour être facilement modifiable et étendu. N'hésitez pas à :

- Ajouter de nouvelles énigmes
- Améliorer l'interface
- Corriger des bugs
- Suggérer des améliorations

## 📄 Licence

Projet éducatif - Libre d'utilisation pour l'enseignement.

---

**Développé pour sensibiliser les jeunes à la cybersécurité** 🛡️
