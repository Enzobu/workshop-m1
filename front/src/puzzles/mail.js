// Énigme Mail - Détection de phishing
function loadMailPuzzle(container) {
  container.innerHTML = `
        <div class="puzzle-hint" style="display: none;">
            <strong>💡 Indice :</strong> Regarde l'expéditeur, les liens et les fautes d'orthographe...
        </div>
        
        <div class="mail-container">
            <div class="mail-header">
                <div class="mail-subject">URGENT : Votre compte va être suspendu !</div>
                <div class="mail-from">De : support@microsoft-security.com</div>
            </div>
            
            <div class="mail-body">
                <p>Cher utilisateur,</p>
                
                <p>Nous avons détecté une activité suspecte sur votre compte Microsoft. 
                Pour des raisons de sécurité, votre compte sera suspendu dans les 24 heures 
                si vous ne confirmez pas votre identité immédiatement.</p>
                
                <p><strong>Cliquez sur ce lien pour vérifier votre compte :</strong><br>
                <a href="http://microsoft-security-verification.com" class="suspicious-link">
                    http://microsoft-security-verification.com
                </a></p>
                
                <p>Vous devez fournir les informations suivantes :</p>
                <ul>
                    <li>Nom d'utilisateur</li>
                    <li>Mot de passe actuel</li>
                    <li>Numéro de carte bancaire</li>
                    <li>Code de sécurité</li>
                </ul>
                
                <p>Cette action est obligatoire et ne peut pas être annulée. 
                Si vous ne répondez pas dans les délais, votre compte sera définitivement 
                supprimé et vous perdrez tous vos données.</p>
                
                <p>Cordialement,<br>
                L'équipe de sécurité Microsoft</p>
            </div>
        </div>
        
        <div class="code-input-section">
            <label for="mail-code">Chiffre 3 :</label>
            <input type="text" id="mail-code" maxlength="1" placeholder="?" />
            <button id="submit-mail" class="btn btn-primary">Valider</button>
        </div>
        
        <div id="mail-feedback" class="feedback"></div>
        
        <div class="error-count">
            Erreurs trouvées : <span id="error-count">0</span>/3
        </div>
    `;

  // Configuration des événements
  const codeInput = container.querySelector("#mail-code");
  const submitBtn = container.querySelector("#submit-mail");
  const feedback = container.querySelector("#mail-feedback");
  const errorCount = container.querySelector("#error-count");

  // Éléments à surligner (erreurs de phishing)
  const errors = [
    {
      element: container.querySelector(".mail-from"),
      text: "support@microsoft-security.com",
      reason: "Adresse email suspecte (Microsoft utilise @microsoft.com)",
    },
    {
      element: container.querySelector(".suspicious-link"),
      text: "http://microsoft-security-verification.com",
      reason: "Lien suspect (http au lieu de https, domaine non officiel)",
    },
    {
      element: container.querySelector(".mail-body"),
      text: "Cordialement,",
      reason: 'Faute d\'orthographe (devrait être "Cordialement")',
    },
  ];

  let foundErrors = 0;
  let highlightedElements = [];

  // Configuration des éléments cliquables
  errors.forEach((error, index) => {
    const element = error.element;
    element.style.cursor = "pointer";
    element.classList.add("highlightable");
    element.title = "Cliquez pour surligner cette erreur";

    element.addEventListener("click", function () {
      if (!this.classList.contains("highlighted")) {
        this.classList.add("highlighted", "correct");
        highlightedElements.push(this);
        foundErrors++;
        errorCount.textContent = foundErrors;

        // Feedback visuel
        this.style.background = "#4caf50";
        this.style.color = "white";
        this.style.padding = "2px 4px";
        this.style.borderRadius = "3px";

        // Vérifier si toutes les erreurs sont trouvées
        if (foundErrors === 3) {
          feedback.innerHTML =
            '<div class="success">✅ Toutes les erreurs trouvées ! Indice final = 2</div>';
          codeInput.value = "2";
          codeInput.disabled = true;
          submitBtn.disabled = true;
          submitBtn.textContent = "✓ Résolu";

          setTimeout(() => {
            completePuzzle("mail", "2");
          }, 1000);

          playSound("success");
        } else {
          feedback.innerHTML = `<div class="success">✅ Erreur trouvée ! (${foundErrors}/3)</div>`;
          playSound("hint");
        }
      }
    });
  });

  // Validation manuelle du code
  submitBtn.addEventListener("click", function () {
    const code = codeInput.value.trim();

    if (code === "2") {
      feedback.innerHTML =
        '<div class="success">✅ Correct ! Le chiffre est 2</div>';
      codeInput.disabled = true;
      submitBtn.disabled = true;
      submitBtn.textContent = "✓ Résolu";

      setTimeout(() => {
        completePuzzle("mail", "2");
      }, 1000);

      playSound("success");
    } else {
      feedback.innerHTML =
        '<div class="error">❌ Incorrect. Trouvez les 3 erreurs dans l\'email...</div>';
      codeInput.classList.add("shake");
      setTimeout(() => {
        codeInput.classList.remove("shake");
      }, 500);
      playSound("error");
    }
  });

  // Validation en temps réel
  codeInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, ""); // Seulement les chiffres
    if (foundErrors < 3) {
      feedback.innerHTML = "";
    }
  });

  // Validation avec Entrée
  codeInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      submitBtn.click();
    }
  });

  // Focus sur l'input
  codeInput.focus();
}

// Fonction pour afficher l'indice
function showMailHint() {
  const hintElement = document.querySelector(".puzzle-hint");
  if (hintElement) {
    hintElement.style.display = "block";
    hintElement.classList.add("show");
  }
}

// Exporter les fonctions
window.loadMailPuzzle = loadMailPuzzle;
window.showMailHint = showMailHint;
