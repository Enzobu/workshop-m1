// Énigme Documents - Acrostiche
function loadDocumentsPuzzle(container) {
  const documentText = `RAPPORT DE SÉCURITÉ - RÉSEAU LYCÉE

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

Signé : Service Informatique`;

  container.innerHTML = `
        <div class="puzzle-hint" style="display: none;">
            <strong>💡 Indice :</strong> Regarde le début de chaque ligne du rapport...
        </div>
        
        <div class="document-editor">
            ${documentText}
        </div>
        
        <div class="code-input-section">
            <label for="doc-code">Chiffre 1 :</label>
            <input type="text" id="doc-code" maxlength="1" placeholder="?" />
            <button id="submit-doc" class="btn btn-primary">Valider</button>
        </div>
        
        <div id="doc-feedback" class="feedback"></div>
    `;

  // Configuration des événements
  const codeInput = container.querySelector("#doc-code");
  const submitBtn = container.querySelector("#submit-doc");
  const feedback = container.querySelector("#doc-feedback");

  // Validation du code
  submitBtn.addEventListener("click", function () {
    const code = codeInput.value.trim();

    if (code === "3") {
      // Code correct
      feedback.innerHTML =
        '<div class="success">✅ Correct ! Le chiffre est 3</div>';
      codeInput.disabled = true;
      submitBtn.disabled = true;
      submitBtn.textContent = "✓ Résolu";

      // Compléter le puzzle
      setTimeout(() => {
        completePuzzle("documents", "3");
      }, 1000);

      playSound("success");
    } else {
      // Code incorrect
      feedback.innerHTML =
        '<div class="error">❌ Incorrect. Regardez bien le début de chaque ligne...</div>';
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
    feedback.innerHTML = "";
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
