// Énigme USB - Supports amovibles (3 niveaux de difficulté)
function loadUsbPuzzle(container) {
  // Configuration de la difficulté depuis l'API
  const difficulty = window.gameState?.difficulty || "easy";

  // Définition des énigmes selon la difficulté
  const usbPuzzles = {
    easy: {
      hint: "Le chiffre est écrit en numérique et intégré dans le texte, il est facile à repérer.",
      title: "CLÉ USB INCONNUE TROUVÉE",
      content: `CLÉ USB INCONNUE TROUVÉE

Tu travailles dans une usine et tu trouves une clé USB posée sur un bureau.
Elle n'a pas d'étiquette et tu ne sais pas à qui elle appartient.

Sur la clé USB, un fichier texte contient la séquence :

INF0RMATIONCONFIDENTIELLES

Tâche : Trouve le chiffre dans le mot, celui-ci sera ta clé.

⚠️ ATTENTION : Ne jamais brancher une clé USB inconnue !
Les supports amovibles sont des vecteurs courants d'intrusion.`,
      answer: "0",
      maxAttempts: 3,
    },
    medium: {
      hint: "Concentre-toi sur le fichier lié à la configuration des machines. Le chiffre dans son nom est la clé.",
      title: "ANALYSE D'UNE CLÉ USB INTERNE",
      content: `ANALYSE D'UNE CLÉ USB INTERNE

Un technicien te confie une clé USB utilisée pour transférer des fichiers 
de mise à jour des machines. Tu dois vérifier son contenu avant de l'utiliser.

Fichiers présents sur la clé :
• update1.exe
• config3.bak
• log5.txt

Tâche : Quel est le chiffre qui indique le fichier le plus critique 
à vérifier en priorité ?

💡 INFO : Un fichier .bak est une sauvegarde de configuration.
Dans l'industrie, ces fichiers contiennent les réglages des machines
et peuvent être altérés pour changer des paramètres critiques.`,
      answer: "3",
      maxAttempts: 3,
    },
    hard: {
      hint: "Le chiffre est dans le nom du fichier le plus critique pour la sécurité OT.",
      title: "CLÉ USB COMPROMISE DANS UN ENVIRONNEMENT OT",
      content: `CLÉ USB COMPROMISE DANS UN ENVIRONNEMENT OT

Une clé USB destinée à mettre à jour le système de production a été 
détectée comme suspecte par le système de logs.

Contenu de la clé USB :
• backup6_final.doc
• script2_update.bat
• audit4_report.pdf

Tâche : Trouve le chiffre correspondant au fichier le plus critique 
pour la sécurité OT.

⚠️ CRITIQUE : Un fichier .bat est un script exécutable Windows.
Dans un réseau industriel, un script malveillant peut :
• Altérer les connexions entre serveurs et automates
• Injecter du code dans des programmes de supervision
• Ouvrir une porte d'accès à un hacker`,
      answer: "2",
      maxAttempts: 3,
    },
  };

  const puzzle = usbPuzzles[difficulty];

  container.innerHTML = `
        <div class="puzzle-hint" style="display: none;">
            <strong>💡 Indice :</strong> ${puzzle.hint}
        </div>
        
        <div class="usb-container">
            <div class="usb-header">
                <h3>${puzzle.title}</h3>
                <div class="usb-icon">💾</div>
            </div>
            
            <div class="usb-content">
                <div class="usb-files">
                    ${puzzle.content}
                </div>
            </div>
        </div>
        
        <div class="code-input-section">
            <label for="usb-code">Chiffre :</label>
            <input type="text" id="usb-code" maxlength="1" placeholder="?" />
            <button id="submit-usb" class="btn btn-primary">Valider</button>
        </div>
        
        <div id="usb-feedback" class="feedback"></div>
        <div id="usb-attempts" class="attempts-count"></div>
    `;

  // Configuration des événements
  const codeInput = container.querySelector("#usb-code");
  const submitBtn = container.querySelector("#submit-usb");
  const feedback = container.querySelector("#usb-feedback");
  const attemptsDisplay = container.querySelector("#usb-attempts");

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
        completePuzzle("usb", puzzle.answer);
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
function showUsbHint() {
  const hintElement = document.querySelector(".puzzle-hint");
  if (hintElement) {
    hintElement.style.display = "block";
    hintElement.classList.add("show");
  }
}

// Exporter les fonctions
window.loadUsbPuzzle = loadUsbPuzzle;
window.showUsbHint = showUsbHint;
