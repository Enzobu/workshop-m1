# 🔒 Cyber Escape Game

Un escape game interactif pour sensibiliser les lycéens à la cybersécurité.

## 🎯 Objectif

Un hacker a verrouillé le réseau du lycée ! Les élèves doivent trouver 8 indices cachés dans différents dossiers pour composer un code à 8 chiffres et déverrouiller le système.

## 🎮 Gameplay

- **Durée** : 10-15 minutes
- **Joueurs** : 1-3 (coopératif local)
- **Interface** : Web (navigateur)
- **Contrôles** : Clavier/Souris/Tactile

## 🧩 Les 8 Énigmes

### 1. 📁 Documents - Acrostiche

- **Objectif** : Trouver le mot caché en prenant la première lettre de chaque ligne
- **Compétence** : Lecture attentive, logique

### 2. 🖼️ Images - Curseurs

- **Objectif** : Ajuster luminosité et contraste pour révéler un message caché
- **Compétence** : Observation, manipulation d'outils

### 3. 📧 Mail - Phishing

- **Objectif** : Identifier 3 erreurs dans un email suspect
- **Compétence** : Esprit critique, cybersécurité

### 4. 🔐 Chiffrement - César

- **Objectif** : Déchiffrer un message codé
- **Compétence** : Cryptographie, logique

### 5. 💾 USB - Supports amovibles

- **Objectif** : Analyser un support USB suspect
- **Compétence** : Sécurité informatique

### 6. 🔄 Mise à jour - Logiciels

- **Objectif** : Identifier la version correcte
- **Compétence** : Gestion des logiciels

### 7. 👥 Ingénierie sociale - Mots de passe

- **Objectif** : Décoder un message caché
- **Compétence** : Psychologie sociale

### 8. 🔒 Sécurité - Cybersécurité physique

- **Objectif** : Analyser un rapport d'incident
- **Compétence** : Sécurité physique

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
│       ├── mail.js        # Énigme Mail
│       ├── cipher.js      # Énigme Chiffrement
│       ├── usb.js         # Énigme USB
│       ├── update.js      # Énigme Mise à jour
│       ├── social.js      # Énigme Ingénierie sociale
│       └── security.js    # Énigme Sécurité
├── assets/
│   └── img/               # Images
│       └── glitch.svg     # Image glitchée
└── README.md
```

## 🎨 Fonctionnalités

- ✅ Interface moderne et responsive
- ✅ 8 énigmes de cybersécurité
- ✅ Système d'indices (max 3)
- ✅ Validation en temps réel
- ✅ Accessibilité clavier
- ✅ Feedback visuel et sonore
- ✅ Message pédagogique final
- ✅ Difficulté dynamique via API

## 🔧 Personnalisation

### Modifier les énigmes

- **Documents** : Modifier le contenu dans `src/puzzles/doc.js`
- **Images** : Remplacer `assets/img/glitch.svg`
- **Mail** : Modifier le contenu dans `src/puzzles/mail.js`
- **Chiffrement** : Modifier le contenu dans `src/puzzles/cipher.js`
- **USB** : Modifier le contenu dans `src/puzzles/usb.js`
- **Mise à jour** : Modifier le contenu dans `src/puzzles/update.js`
- **Ingénierie sociale** : Modifier le contenu dans `src/puzzles/social.js`
- **Sécurité** : Modifier le contenu dans `src/puzzles/security.js`

### Ajuster la difficulté

- La difficulté est récupérée automatiquement depuis l'API
- Changer le nombre d'indices dans `src/main.js` (ligne 10)
- Ajuster les plages de curseurs dans `src/puzzles/image.js`
- Modifier les énigmes dans les fichiers `src/puzzles/*.js`

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
