// État global du jeu
const gameState = {
  currentScreen: "welcome",
  timeRemaining: 15 * 60, // 15 minutes en secondes
  timer: null,
  completedPuzzles: {
    documents: false,
    images: false,
    mail: false,
  },
  hintsUsed: 0,
  maxHints: 3,
  puzzleCodes: {
    documents: null,
    images: null,
    mail: null,
  },
};

// Éléments DOM
const elements = {
  screens: {
    welcome: document.getElementById("welcome-screen"),
    desktop: document.getElementById("desktop-screen"),
    victory: document.getElementById("victory-screen"),
  },
  modals: {
    puzzle: document.getElementById("puzzle-modal"),
    unlock: document.getElementById("unlock-modal"),
    help: document.getElementById("help-modal"),
  },
  buttons: {
    start: document.getElementById("start-btn"),
    help: document.getElementById("help-btn"),
    unlock: document.getElementById("unlock-btn"),
    playAgain: document.getElementById("play-again"),
    closeHelp: document.getElementById("close-help"),
    closeUnlock: document.getElementById("close-unlock"),
    closePuzzle: document.getElementById("close-puzzle"),
    submitCode: document.getElementById("submit-code"),
  },
  timer: document.getElementById("timer-display"),
  codeInput: document.getElementById("code-input"),
  puzzleContent: document.getElementById("puzzle-content"),
  puzzleTitle: document.getElementById("puzzle-title"),
  hintBtn: document.getElementById("hint-btn"),
};

// Initialisation
document.addEventListener("DOMContentLoaded", function () {
  initializeGame();
  setupEventListeners();
});

function initializeGame() {
  // Masquer toutes les modales
  Object.values(elements.modals).forEach((modal) => {
    modal.classList.remove("active");
  });

  // Afficher l'écran d'accueil
  showScreen("welcome");

  // Réinitialiser l'état du jeu
  resetGameState();
}

function resetGameState() {
  gameState.currentScreen = "welcome";
  gameState.timeRemaining = 15 * 60;
  gameState.completedPuzzles = {
    documents: false,
    images: false,
    mail: false,
  };
  gameState.hintsUsed = 0;
  gameState.puzzleCodes = {
    documents: null,
    images: null,
    mail: null,
  };

  // Réinitialiser l'interface
  updatePuzzleStatus();
  updateUnlockButton();
  updateTimer();
}

function setupEventListeners() {
  // Boutons principaux
  elements.buttons.start.addEventListener("click", startGame);
  elements.buttons.help.addEventListener("click", showHelp);
  elements.buttons.playAgain.addEventListener("click", restartGame);
  elements.buttons.unlock.addEventListener("click", showUnlockModal);

  // Modales
  elements.buttons.closeHelp.addEventListener("click", hideHelp);
  elements.buttons.closeUnlock.addEventListener("click", hideUnlockModal);
  elements.buttons.closePuzzle.addEventListener("click", hidePuzzleModal);
  elements.buttons.submitCode.addEventListener("click", submitCode);

  // Icônes du bureau
  document.querySelectorAll(".desktop-icon").forEach((icon) => {
    icon.addEventListener("click", function () {
      const puzzleType = this.dataset.puzzle;
      openPuzzle(puzzleType);
    });
  });

  // Input de code
  elements.codeInput.addEventListener("input", function () {
    const value = this.value.replace(/\D/g, ""); // Seulement les chiffres
    this.value = value;
    updateCodeDisplay(value);
  });

  // Fermer les modales en cliquant à l'extérieur
  Object.values(elements.modals).forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.remove("active");
      }
    });
  });

  // Navigation clavier
  document.addEventListener("keydown", handleKeyboard);
}

function startGame() {
  showScreen("desktop");
  startTimer();
  playSound("start");
}

function showScreen(screenName) {
  // Masquer tous les écrans
  Object.values(elements.screens).forEach((screen) => {
    screen.classList.remove("active");
  });

  // Afficher l'écran demandé
  if (elements.screens[screenName]) {
    elements.screens[screenName].classList.add("active");
    gameState.currentScreen = screenName;
  }
}

function startTimer() {
  if (gameState.timer) {
    clearInterval(gameState.timer);
  }

  gameState.timer = setInterval(() => {
    gameState.timeRemaining--;
    updateTimer();

    if (gameState.timeRemaining <= 0) {
      endGame(false);
    }
  }, 1000);
}

function updateTimer() {
  const minutes = Math.floor(gameState.timeRemaining / 60);
  const seconds = gameState.timeRemaining % 60;
  elements.timer.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  // Changement de couleur quand le temps est critique
  if (gameState.timeRemaining <= 60) {
    elements.timer.style.color = "#ff6b6b";
  } else if (gameState.timeRemaining <= 300) {
    elements.timer.style.color = "#ffa726";
  } else {
    elements.timer.style.color = "#ff6b6b";
  }
}

function openPuzzle(puzzleType) {
  if (gameState.completedPuzzles[puzzleType]) {
    return; // Puzzle déjà résolu
  }

  // Charger le contenu du puzzle
  loadPuzzleContent(puzzleType);

  // Afficher la modale
  elements.modals.puzzle.classList.add("active");
  elements.puzzleTitle.textContent = getPuzzleTitle(puzzleType);

  // Configurer le bouton d'indice
  setupHintButton(puzzleType);
}

function loadPuzzleContent(puzzleType) {
  const content = elements.puzzleContent;
  content.innerHTML = "";

  switch (puzzleType) {
    case "documents":
      loadDocumentsPuzzle(content);
      break;
    case "images":
      loadImagesPuzzle(content);
      break;
    case "mail":
      loadMailPuzzle(content);
      break;
  }
}

function getPuzzleTitle(puzzleType) {
  const titles = {
    documents: "📁 Documents - Acrostiche",
    images: "🖼️ Images - Curseurs",
    mail: "📧 Mail - Phishing",
  };
  return titles[puzzleType] || "Énigme";
}

function setupHintButton(puzzleType) {
  elements.hintBtn.onclick = () => useHint(puzzleType);
  elements.hintBtn.disabled = gameState.hintsUsed >= gameState.maxHints;
}

function useHint(puzzleType) {
  if (gameState.hintsUsed >= gameState.maxHints) {
    return;
  }

  gameState.hintsUsed++;
  elements.hintBtn.disabled = true;

  // Afficher l'indice selon le type de puzzle
  showHint(puzzleType);
  playSound("hint");
}

function showHint(puzzleType) {
  // Utiliser les fonctions spécifiques de chaque puzzle
  switch (puzzleType) {
    case "documents":
      if (window.showDocumentsHint) {
        window.showDocumentsHint();
      }
      break;
    case "images":
      if (window.showImagesHint) {
        window.showImagesHint();
      }
      break;
    case "mail":
      if (window.showMailHint) {
        window.showMailHint();
      }
      break;
  }
}

function completePuzzle(puzzleType, code) {
  gameState.completedPuzzles[puzzleType] = true;
  gameState.puzzleCodes[puzzleType] = code;

  // Mettre à jour l'interface
  updatePuzzleStatus();
  updateUnlockButton();

  // Fermer la modale
  hidePuzzleModal();

  // Son de succès
  playSound("success");

  // Vérifier si tous les puzzles sont résolus
  if (
    Object.values(gameState.completedPuzzles).every((completed) => completed)
  ) {
    // Tous les puzzles sont résolus, activer le bouton de déverrouillage
    elements.buttons.unlock.disabled = false;
    elements.buttons.unlock.classList.add("pulse");
  }
}

function updatePuzzleStatus() {
  Object.keys(gameState.completedPuzzles).forEach((puzzleType) => {
    const statusElement = document.getElementById(`${puzzleType}-status`);
    if (statusElement) {
      if (gameState.completedPuzzles[puzzleType]) {
        statusElement.classList.add("completed");
      } else {
        statusElement.classList.remove("completed");
      }
    }
  });
}

function updateUnlockButton() {
  const allCompleted = Object.values(gameState.completedPuzzles).every(
    (completed) => completed
  );
  elements.buttons.unlock.disabled = !allCompleted;

  if (allCompleted) {
    elements.buttons.unlock.classList.add("pulse");
  } else {
    elements.buttons.unlock.classList.remove("pulse");
  }
}

function showUnlockModal() {
  elements.modals.unlock.classList.add("active");
  elements.codeInput.focus();
}

function hideUnlockModal() {
  elements.modals.unlock.classList.remove("active");
}

function hidePuzzleModal() {
  elements.modals.puzzle.classList.remove("active");
}

function showHelp() {
  elements.modals.help.classList.add("active");
}

function hideHelp() {
  elements.modals.help.classList.remove("active");
}

function updateCodeDisplay(value) {
  const digits = document.querySelectorAll(".code-digit");
  digits.forEach((digit, index) => {
    if (index < value.length) {
      digit.textContent = value[index];
      digit.classList.add("filled");
    } else {
      digit.textContent = "_";
      digit.classList.remove("filled");
    }
  });
}

function submitCode() {
  const code = elements.codeInput.value;

  if (code.length !== 3) {
    showMessage("Veuillez entrer un code à 3 chiffres", "error");
    return;
  }

  // Vérifier le code (dans un vrai jeu, on vérifierait l'ordre)
  const expectedCode = Object.values(gameState.puzzleCodes).join("");

  if (code === expectedCode) {
    endGame(true);
  } else {
    showMessage("Code incorrect ! Vérifiez vos indices.", "error");
    elements.codeInput.classList.add("shake");
    setTimeout(() => {
      elements.codeInput.classList.remove("shake");
    }, 500);
    playSound("error");
  }
}

function endGame(victory) {
  // Arrêter le timer
  if (gameState.timer) {
    clearInterval(gameState.timer);
  }

  if (victory) {
    showScreen("victory");
    updateVictoryStats();
    playSound("victory");
  } else {
    showMessage("Temps écoulé ! Le réseau reste verrouillé.", "error");
    setTimeout(() => {
      restartGame();
    }, 3000);
  }
}

function updateVictoryStats() {
  document.getElementById("time-remaining").textContent = `${Math.floor(
    gameState.timeRemaining / 60
  )}:${(gameState.timeRemaining % 60).toString().padStart(2, "0")}`;
  document.getElementById(
    "hints-used"
  ).textContent = `${gameState.hintsUsed}/${gameState.maxHints}`;
}

function restartGame() {
  initializeGame();
}

function showMessage(text, type = "info") {
  // Créer une notification temporaire
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = text;
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "error" ? "#f44336" : "#4caf50"};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function playSound(soundType) {
  // Placeholder pour les sons
  // Dans un vrai projet, on utiliserait des fichiers audio
  console.log(`Playing sound: ${soundType}`);
}

function handleKeyboard(e) {
  // Navigation clavier pour l'accessibilité
  if (e.key === "Escape") {
    // Fermer les modales ouvertes
    Object.values(elements.modals).forEach((modal) => {
      if (modal.classList.contains("active")) {
        modal.classList.remove("active");
      }
    });
  }
}

// Fonctions pour les puzzles (définies dans les fichiers séparés)
function loadDocumentsPuzzle(container) {
  if (window.loadDocumentsPuzzle) {
    window.loadDocumentsPuzzle(container);
  }
}

function loadImagesPuzzle(container) {
  if (window.loadImagesPuzzle) {
    window.loadImagesPuzzle(container);
  }
}

function loadMailPuzzle(container) {
  if (window.loadMailPuzzle) {
    window.loadMailPuzzle(container);
  }
}

// Exporter les fonctions nécessaires pour les puzzles
window.gameState = gameState;
window.completePuzzle = completePuzzle;
window.showMessage = showMessage;
window.playSound = playSound;
