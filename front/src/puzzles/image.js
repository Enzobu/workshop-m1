// Énigme Images - Curseurs de luminosité/contraste
function loadImagesPuzzle(container) {
  container.innerHTML = `
        <div class="puzzle-hint" style="display: none;">
            <strong>💡 Indice :</strong> Observe les zones sombres de l'image et ajustez les curseurs...
        </div>
        
        <div class="image-puzzle">
            <div class="image-container">
                <img id="glitch-image" src="assets/img/glitch.png" alt="Image glitchée" class="glitch-image" />
            </div>
            
            <div class="controls">
                <div class="control-group">
                    <label for="brightness">Luminosité :</label>
                    <input type="range" id="brightness" min="0" max="100" value="40" />
                    <span class="control-value" id="brightness-value">40</span>
                </div>
                
                <div class="control-group">
                    <label for="contrast">Contraste :</label>
                    <input type="range" id="contrast" min="0" max="100" value="30" />
                    <span class="control-value" id="contrast-value">30</span>
                </div>
            </div>
            
            <div class="code-input-section">
                <label for="img-code">Chiffre 2 :</label>
                <input type="text" id="img-code" maxlength="1" placeholder="?" />
                <button id="submit-img" class="btn btn-primary">Valider</button>
            </div>
            
            <div id="img-feedback" class="feedback"></div>
        </div>
    `;

  // Configuration des événements
  const brightnessSlider = container.querySelector("#brightness");
  const contrastSlider = container.querySelector("#contrast");
  const brightnessValue = container.querySelector("#brightness-value");
  const contrastValue = container.querySelector("#contrast-value");
  const image = container.querySelector("#glitch-image");
  const codeInput = container.querySelector("#img-code");
  const submitBtn = container.querySelector("#submit-img");
  const feedback = container.querySelector("#img-feedback");

  // Mise à jour des curseurs
  function updateImage() {
    const brightness = brightnessSlider.value;
    const contrast = contrastSlider.value;

    brightnessValue.textContent = brightness;
    contrastValue.textContent = contrast;

    // Appliquer les filtres CSS
    image.style.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

    // Vérifier si la combinaison révèle le code
    checkCodeReveal(brightness, contrast);
  }

  // Vérifier si le code est révélé
  function checkCodeReveal(brightness, contrast) {
    // Plages pour révéler le code (ajustables selon l'image)
    const brightnessRange = { min: 55, max: 65 };
    const contrastRange = { min: 40, max: 50 };

    if (
      brightness >= brightnessRange.min &&
      brightness <= brightnessRange.max &&
      contrast >= contrastRange.min &&
      contrast <= contrastRange.max
    ) {
      // Révéler le code
      if (!feedback.querySelector(".code-revealed")) {
        feedback.innerHTML =
          '<div class="code-revealed success">🔍 Code révélé : 7</div>';
        codeInput.value = "7";
        codeInput.disabled = true;
        submitBtn.disabled = true;
        submitBtn.textContent = "✓ Résolu";

        // Compléter le puzzle
        setTimeout(() => {
          completePuzzle("images", "7");
        }, 1000);

        playSound("success");
      }
    } else {
      // Masquer le code si on sort de la plage
      const codeRevealed = feedback.querySelector(".code-revealed");
      if (codeRevealed) {
        codeRevealed.remove();
        codeInput.value = "";
        codeInput.disabled = false;
        submitBtn.disabled = false;
        submitBtn.textContent = "Valider";
      }
    }
  }

  // Événements des curseurs
  brightnessSlider.addEventListener("input", updateImage);
  contrastSlider.addEventListener("input", updateImage);

  // Validation manuelle du code
  submitBtn.addEventListener("click", function () {
    const code = codeInput.value.trim();

    if (code === "7") {
      feedback.innerHTML =
        '<div class="success">✅ Correct ! Le chiffre est 7</div>';
      codeInput.disabled = true;
      submitBtn.disabled = true;
      submitBtn.textContent = "✓ Résolu";

      setTimeout(() => {
        completePuzzle("images", "7");
      }, 1000);

      playSound("success");
    } else {
      feedback.innerHTML =
        '<div class="error">❌ Incorrect. Ajustez les curseurs pour révéler le code...</div>';
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
    if (!feedback.querySelector(".code-revealed")) {
      feedback.innerHTML = "";
    }
  });

  // Validation avec Entrée
  codeInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      submitBtn.click();
    }
  });

  // Initialisation
  updateImage();
  codeInput.focus();
}

// Fonction pour afficher l'indice
function showImagesHint() {
  const hintElement = document.querySelector(".puzzle-hint");
  if (hintElement) {
    hintElement.style.display = "block";
    hintElement.classList.add("show");
  }
}

// Exporter les fonctions
window.loadImagesPuzzle = loadImagesPuzzle;
window.showImagesHint = showImagesHint;
