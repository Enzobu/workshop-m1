// Énigme Ingénierie sociale - Mots de passe dans l'industrie (3 niveaux de difficulté)
function loadSocialPuzzle(container) {
  // Configuration de la difficulté depuis l'API
  const difficulty = window.gameState?.difficulty || "easy";

  // Définition des énigmes selon la difficulté
  const socialPuzzles = {
    easy: {
      hint: "Le milieu n'est pas une lettre, c'est un chiffre. Méfie-toi de ce qu'on te demande de lire.",
      title: "L'APPEL DU FAUX TECHNICIEN",
      content: `L'APPEL DU FAUX TECHNICIEN

Un "technicien du support" appelle un employé de maintenance et prétend 
qu'il doit vérifier son compte. Il lui dicte un code de validation et 
lui demande de le lire à voix haute.

Le message reçu sur l'écran du téléphone est :

Code de vérification : 59GHFZ4O9ER34FA2F

Le technicien dit :
"Donnez-moi juste le chiffre du milieu, c'est tout ce dont j'ai besoin."

Énigme : Quel chiffre le technicien tente-t-il d'obtenir ?

⚠️ ATTENTION : Les pirates utilisent la voix et la confiance humaine 
pour obtenir des codes ou mots de passe (technique de vishing).
Ne jamais communiquer un code, même partiel, par téléphone ou message.
Dans le milieu industriel, ces codes peuvent donner accès à des systèmes 
de contrôle à distance.`,
      answer: "9",
      maxAttempts: 3,
    },
    medium: {
      hint: "Regarde bien la fin : il demande le dernier chiffre.",
      title: "L'EMAIL DU RESPONSABLE SÉCURITÉ",
      content: `L'EMAIL DU RESPONSABLE SÉCURITÉ

Un employé reçoit un email apparemment envoyé par le "Responsable Cybersécurité" :

"Bonjour,
Nous faisons un audit des mots de passe des superviseurs.
Merci d'envoyer le dernier chiffre de votre code d'accès.
— Service IT"

L'adresse d'envoi est : cybersecurite@indus-sec.com
Mais l'adresse réelle est cachée : cybersecurite@indus-sec.co

Énigme : Quel chiffre cherche le pirate à obtenir ?
(Indices : le code du superviseur est "A2B6C7D".)

⚠️ ATTENTION : Ce mail est une forme de phishing ciblé (attaque par 
ingénierie sociale). Un pirate peut modifier légèrement une adresse 
(ex. .co au lieu de .com) pour tromper la vigilance.
Ne jamais répondre à un email qui demande un mot de passe ou un code.`,
      answer: "7",
      maxAttempts: 3,
    },
    hard: {
      hint: "Un badge compromis est celui refusé juste avant un accès réussi au même lieu.",
      title: "LE BADGE PERDU",
      content: `LE BADGE PERDU

Un badge d'accès à la salle serveur a été retrouvé dans le parking.
Le service de sécurité découvre un rapport d'accès suspect listant 
les tentatives d'ouverture.

Badge_1 : refusé à 08h12 - secteur administratif  
Badge_4 : accepté à 09h45 - zone production  
Badge_6 : refusé à 10h03 - salle serveur  
Badge_7 : accepté à 10h05 - salle serveur  
Badge_9 : refusé à 10h08 - local technique

Le chef de sécurité te demande :
"Un badge volé a permis l'accès à une zone sensible.
Trouve le chiffre du badge utilisé illégalement."

Énigme : Quel chiffre du badge a été utilisé illégalement ?

🔍 ANALYSE : Dans un réseau industriel, un badge ou identifiant compromis 
peut servir à contourner les contrôles physiques et informatiques.
Les logs d'accès doivent être corrélés pour repérer un schéma suspect : 
refus + réussite juste après = probable usurpation.`,
      answer: "6",
      maxAttempts: 3,
    },
  };

  const puzzle = socialPuzzles[difficulty];

  container.innerHTML = `
        <div class="puzzle-hint" style="display: none;">
            <strong>💡 Indice :</strong> ${puzzle.hint}
        </div>
        
        <div class="social-container">
            <div class="social-header">
                <h3>${puzzle.title}</h3>
                <div class="social-icon">🎭</div>
            </div>
            
            <div class="social-content">
                <div class="social-scenario">
                    ${puzzle.content}
                </div>
            </div>
        </div>
        
        <div class="code-input-section">
            <label for="social-code">Chiffre :</label>
            <input type="text" id="social-code" maxlength="1" placeholder="?" />
            <button id="submit-social" class="btn btn-primary">Valider</button>
        </div>
        
        <div id="social-feedback" class="feedback"></div>
        <div id="social-attempts" class="attempts-count"></div>
    `;

  // Configuration des événements
  const codeInput = container.querySelector("#social-code");
  const submitBtn = container.querySelector("#submit-social");
  const feedback = container.querySelector("#social-feedback");
  const attemptsDisplay = container.querySelector("#social-attempts");

  let attempts = 0;
  const maxAttempts = puzzle.maxAttempts;

  // Mettre à jour l'affichage des tentatives
  function updateAttemptsDisplay() {
    attemptsDisplay.textContent = `Tentatives : ${attempts}/${maxAttempts}`;
  }

  // Validation du code
  submitBtn.addEventListener("click", function () {
    const code = codeInput.value.trim();
    attempts++;

    if (code === puzzle.answer) {
      // Code correct
      feedback.innerHTML = `<div class="success">✅ Correct ! Le chiffre est ${puzzle.answer}</div>`;
      codeInput.disabled = true;
      submitBtn.disabled = true;
      submitBtn.textContent = "✓ Résolu";

      // Compléter le puzzle
      setTimeout(() => {
        completePuzzle("social", puzzle.answer);
      }, 1000);

      playSound("success");
    } else {
      // Code incorrect
      if (attempts >= maxAttempts) {
        feedback.innerHTML = `<div class="error">❌ Échec ! Le chiffre était ${puzzle.answer}</div>`;
        codeInput.disabled = true;
        submitBtn.disabled = true;
        submitBtn.textContent = "✗ Échoué";
      } else {
        feedback.innerHTML = `<div class="error">❌ Incorrect. ${puzzle.hint}</div>`;
        codeInput.classList.add("shake");
        setTimeout(() => {
          codeInput.classList.remove("shake");
        }, 500);
      }
      playSound("error");
    }

    updateAttemptsDisplay();
  });

  // Validation en temps réel
  codeInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, ""); // Seulement les chiffres
    feedback.innerHTML = "";
  });

  // Validation avec Entrée
  codeInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      submitBtn.click();
    }
  });

  // Initialiser l'affichage des tentatives
  updateAttemptsDisplay();

  // Focus sur l'input
  codeInput.focus();
}

// Fonction pour afficher l'indice
function showSocialHint() {
  const hintElement = document.querySelector(".puzzle-hint");
  if (hintElement) {
    hintElement.style.display = "block";
    hintElement.classList.add("show");
  }
}

// Exporter les fonctions
window.loadSocialPuzzle = loadSocialPuzzle;
window.showSocialHint = showSocialHint;
