// Énigme Documents - Acrostiche (3 niveaux de difficulté)
function loadDocumentsPuzzle(container) {
  // Configuration de la difficulté depuis l'API
  const difficulty = window.gameState?.difficulty || "easy";

  // Définition des énigmes selon la difficulté
  const docPuzzles = {
    easy: {
      hint: "Regarde le début de chaque ligne du rapport...",
      title: "RAPPORT DE SÉCURITÉ - RÉSEAU LYCÉE",
      content: `RAPPORT DE SÉCURITÉ - RÉSEAU LYCÉE

Tous les systèmes sont opérationnels
Rien de suspect détecté aujourd'hui
Ordinateurs fonctionnent normalement
Incidents signalés : aucun
Sécurité renforcée depuis hier

Vérifications effectuées :
- Pare-feu actif
- Antivirus à jour
- Sauvegardes OK
- Accès contrôlés

Recommandations :
- Maintenir la vigilance
- Former le personnel
- Mettre à jour les mots de passe

Signé : Service Informatique`,
      answer: "3",
      maxAttempts: 3,
    },
    medium: {
      hint: "Extrais le mot caché dans le poème en prenant la première lettre de chaque ligne...",
      title: "NOTIFICATION DE LIVRAISON",
      content: `De : notifications@colis-express.com
Objet : Votre colis est en attente

Bonjour,

Votre colis est en attente dans notre entrepôt.
Un bloc poétique cache une information importante.

POÈME :
Pense à vérifier l'expéditeur avant d'ouvrir,
En route, certaines adresses demandent vérification,
Toujours passer par le site officiel pour confirmer.
Silence dans l'entrepôt, machines en veille,

Cordialement,
Service Client Colis Express`,
      answer: "7", // "sept" = 7
      maxAttempts: 3,
    },
    hard: {
      hint: "Le chiffre est caché verticalement au centre exact d'un mot sur chaque ligne. Lis les lettres de haut en bas...",
      title: "MESSAGE TROUVÉ SUR ÉCRAN D'AUTOMATE",
      content: `MESSAGE TROUVÉ SUR ÉCRAN D'AUTOMATE

Certains contrôles automatiques préviennent les erreurs et permettent de garder le système Constantement sécurisé.
Les techniciens ajustent les réglages pour éviter tout problème Inattendu.
Les données remontent régulièrement et aucune alarme n'est ignorée Naturellement.
La sécurité informatique est maintenue grâce aux procédures qui garantissent la protecQtion.

Analysez ce message pour trouver le chiffre caché.`,
      answer: "5", // "CINQ" caché verticalement
      maxAttempts: 3,
    },
  };

  const puzzle = docPuzzles[difficulty];

  container.innerHTML = `
        <div class="puzzle-hint" style="display: none;">
            <strong>💡 Indice :</strong> ${puzzle.hint}
        </div>
        
        <div class="document-editor">
            <h3>${puzzle.title}</h3>
            <div class="document-content">${puzzle.content}</div>
        </div>
        
        <div class="code-input-section">
            <label for="doc-code">Chiffre :</label>
            <input type="text" id="doc-code" maxlength="1" placeholder="?" />
            <button id="submit-doc" class="btn btn-primary">Valider</button>
        </div>
        
        <div id="doc-feedback" class="feedback"></div>
        <div id="doc-attempts" class="attempts-count"></div>
    `;

  // Configuration des événements
  const codeInput = container.querySelector("#doc-code");
  const submitBtn = container.querySelector("#submit-doc");
  const feedback = container.querySelector("#doc-feedback");
  const attemptsDisplay = container.querySelector("#doc-attempts");

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
        completePuzzle("documents", puzzle.answer);
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
function showDocumentsHint() {
  const hintElement = document.querySelector(".puzzle-hint");
  if (hintElement) {
    hintElement.style.display = "block";
    hintElement.classList.add("show");
  }
}

// Exporter les fonctions
window.loadDocumentsPuzzle = loadDocumentsPuzzle;
window.showDocumentsHint = showDocumentsHint;
