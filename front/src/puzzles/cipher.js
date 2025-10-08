// Énigme Chiffrement - Chiffrement de César (3 niveaux de difficulté)
function loadCipherPuzzle(container) {
  // Configuration de la difficulté depuis l'API
  const difficulty = window.gameState?.difficulty || "easy";

  // Définition des énigmes selon la difficulté
  const cipherPuzzles = {
    easy: {
      hint: "Il ne s'agit pas d'un nombre premier. Utilisez un décalage de -7 pour déchiffrer, puis additionnez les chiffres du nombre obtenu.",
      title: "Chiffrement de César - Facile",
      instructions:
        "Nous imposons un décalage de +7, notre mot initial donne un nombre, additionnez ensuite ses chiffres afin d'avoir une partie du code, saurez-vous le déchiffrer ?",
      example:
        "La position de H est 8, alors une fois déchiffré avec -7 on obtient 1, soit la lettre A",
      cipherText: "XBHAVYGL",
      clearText: "QUATORZE",
      answer: "5",
      maxAttempts: 3,
    },
    medium: {
      hint: "Le nombre pour déchiffrer ce message est en lien avec le calendrier. Utilise ce nombre pour reculer chaque lettre dans l'alphabet.",
      title: "Chiffrement de César - Moyen",
      instructions:
        "Quelqu'un est entré dans le système et a laissé ce message étrange. À côté de l'ordinateur, il y a un petit calendrier avec tous les jours de la semaine entourés en rouge.",
      cipherText: "UVBZ ZVTTLZ WHZZLZ. CVBZ U'LALZ WSBZ H S'HIYP.",
      clearText: "NOUS SOMMES PASSES. VOUS N'ETES PLUS A L'ABRI",
      shift: 7, // 7 jours dans la semaine
      answer: "7",
      maxAttempts: 5,
    },
    hard: {
      hint: "Il faut reculer les lettres du message clair pour trouver la clé.",
      title: "Chiffrement de César - Difficile",
      instructions:
        "Tu travailles dans une usine connectée et tu as résolu les précédents messages chiffrés laissés par un « hacker » fictif. Toutefois, nous n'avons pas trouvé la clé reliant les 2 messages, aide nous à la retrouver.",
      cipherText: "Sraogk kf vp ofkl ñ wlfk wy vx zsbssuwqofk",
      clearText: "Bravo tu es venu à bout de ce chiffrement",
      shift: -9, // Clé à trouver
      answer: "9",
      maxAttempts: 7,
    },
  };

  const puzzle = cipherPuzzles[difficulty];

  container.innerHTML = `
        <div class="puzzle-hint" style="display: none;">
            <strong>💡 Indice :</strong> ${puzzle.hint}
        </div>
        
        <div class="cipher-container">
            <h3>${puzzle.title}</h3>
            <div class="cipher-instructions">
                <p>${puzzle.instructions}</p>
                ${
                  puzzle.example
                    ? `<p class="example"><strong>Exemple :</strong> ${puzzle.example}</p>`
                    : ""
                }
            </div>
            
            <div class="cipher-text">
                <label>Message chiffré :</label>
                <div class="cipher-display">${puzzle.cipherText}</div>
            </div>
            
            <div class="decrypt-area">
                <label for="decrypted-text">Texte déchiffré :</label>
                <textarea id="decrypted-text" placeholder="Écrivez votre déchiffrement ici..."></textarea>
            </div>
            
            <div class="cipher-validation">
                <div class="code-input-section">
                    <label for="cipher-code">Réponse finale :</label>
                    <input type="text" id="cipher-code" maxlength="2" placeholder="?" />
                    <button id="submit-cipher" class="btn btn-primary">Valider</button>
                </div>
                
                <div id="cipher-feedback" class="feedback"></div>
                
                <div class="attempts-count">
                    Tentatives restantes : <span id="attempts-remaining">${
                      puzzle.maxAttempts
                    }</span>
                </div>
            </div>
        </div>
    `;

  // Configuration des événements
  const decryptedText = container.querySelector("#decrypted-text");
  const codeInput = container.querySelector("#cipher-code");
  const submitBtn = container.querySelector("#submit-cipher");
  const feedback = container.querySelector("#cipher-feedback");
  const attemptsRemaining = container.querySelector("#attempts-remaining");

  let attempts = 0;
  let isSolved = false;

  // Fonction de déchiffrement de César
  function caesarCipher(text, shift) {
    return text
      .split("")
      .map((char) => {
        if (char.match(/[A-Z]/i)) {
          const code = char.charCodeAt(0);
          const base = code >= 65 && code <= 90 ? 65 : 97; // A-Z ou a-z
          return String.fromCharCode(((code - base + shift + 26) % 26) + base);
        }
        return char;
      })
      .join("");
  }

  // Fonction pour additionner les chiffres d'un nombre
  function sumDigits(number) {
    return number
      .toString()
      .split("")
      .reduce((sum, digit) => sum + parseInt(digit), 0);
  }

  // Validation du code
  submitBtn.addEventListener("click", function () {
    if (isSolved) return;

    const code = codeInput.value.trim();

    // Vérifier le texte déchiffré
    if (decryptedText && decryptedText.value.trim() !== puzzle.clearText) {
      feedback.innerHTML = `<div class="error">❌ Le texte déchiffré ne correspond pas. Vérifiez votre déchiffrement.</div>`;
      return;
    }

    attempts++;
    attemptsRemaining.textContent = puzzle.maxAttempts - attempts;

    if (code === puzzle.answer) {
      isSolved = true;
      feedback.innerHTML = `<div class="success">✅ Correct ! La réponse est ${puzzle.answer}</div>`;
      codeInput.disabled = true;
      submitBtn.disabled = true;
      submitBtn.textContent = "✓ Résolu";

      setTimeout(() => {
        completePuzzle("cipher", puzzle.answer);
      }, 1000);

      playSound("success");
    } else {
      if (attempts >= puzzle.maxAttempts) {
        feedback.innerHTML = `<div class="error">❌ Nombre de tentatives dépassé ! La réponse était ${puzzle.answer}</div>`;
        codeInput.disabled = true;
        submitBtn.disabled = true;
        submitBtn.textContent = "Échec";
      } else {
        feedback.innerHTML = `<div class="error">❌ Incorrect. Il vous reste ${
          puzzle.maxAttempts - attempts
        } tentatives.</div>`;
        codeInput.classList.add("shake");
        setTimeout(() => {
          codeInput.classList.remove("shake");
        }, 500);
        playSound("error");
      }
    }
  });

  // Validation en temps réel
  codeInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, ""); // Seulement les chiffres
    if (!isSolved) {
      feedback.innerHTML = "";
    }
  });

  // Validation avec Entrée
  codeInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      submitBtn.click();
    }
  });

  // Pas d'auto-déchiffrement pour le niveau facile

  // Focus sur l'input
  codeInput.focus();
}

// Fonction pour afficher l'indice
function showCipherHint() {
  const hintElement = document.querySelector(".puzzle-hint");
  if (hintElement) {
    hintElement.style.display = "block";
    hintElement.classList.add("show");
  }
}

// Exporter les fonctions
window.loadCipherPuzzle = loadCipherPuzzle;
window.showCipherHint = showCipherHint;
