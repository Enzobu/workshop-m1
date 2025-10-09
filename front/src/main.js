// État global du jeu
const gameState = {
  currentScreen: "welcome",
  difficulty: "easy", // Difficulté par défaut
  completedPuzzles: {
    documents: false,
    images: false,
    mail: false,
    cipher: false,
    usb: false,
    update: false,
    social: false,
    security: false,
  },
  hintsUsed: 0,
  maxHints: 3,
  puzzleCodes: {
    documents: null,
    images: null,
    mail: null,
    cipher: null,
    usb: null,
    update: null,
    social: null,
    security: null,
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
  codeInput: document.getElementById("code-input"),
  puzzleContent: document.getElementById("puzzle-content"),
  puzzleTitle: document.getElementById("puzzle-title"),
  hintBtn: document.getElementById("hint-btn"),
};

// Fonction pour récupérer la difficulté depuis l'API
async function fetchGameDifficulty() {
  try {
    const params = new URLSearchParams(window.location.search);
    const gameId = Number(params.get("gameId"));

    const response = await fetch("http://qg.enzo-palermo.com:8000/api/games/" + gameId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Données récupérées de l'API:", data);

    // Vérifier si la propriété difficulty existe
    if (data.difficulty) {
      gameState.difficulty = data.difficulty;
      console.log("✅ Difficulté récupérée de l'API:", data.difficulty);
      console.log("🎮 Toutes les énigmes utiliseront cette difficulté");
    } else {
      console.warn('Propriété "difficulty" non trouvée dans la réponse API');
    }

    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la difficulté:", error);
    // Garder la difficulté par défaut en cas d'erreur
    console.log(
      "Utilisation de la difficulté par défaut:",
      gameState.difficulty
    );
    return null;
  }
}

// Initialisation
document.addEventListener("DOMContentLoaded", async function () {
  // Récupérer la difficulté depuis l'API avant d'initialiser le jeu
  await fetchGameDifficulty();

  initializeGame();
  setupEventListeners();
  startEnigmaPolling();
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
  gameState.completedPuzzles = {
    documents: false,
    images: false,
    mail: false,
    cipher: false,
    usb: false,
    update: false,
    social: false,
    security: false,
  };
  gameState.hintsUsed = 0;
  gameState.puzzleCodes = {
    documents: null,
    images: null,
    mail: null,
    cipher: null,
    usb: null,
    update: null,
    social: null,
    security: null,
  };

  // Réinitialiser l'interface
  updatePuzzleStatus();
  updateUnlockButton();
  updateProgressTable();

  // Réinitialiser l'affichage des modales
  elements.modals.unlock.classList.remove("force-hidden");
}

function setupEventListeners() {
  // Boutons principaux
  if (elements.buttons.start) {
    elements.buttons.start.addEventListener("click", startGame);
  } else {
    console.error("Bouton start non trouvé !");
  }

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
  console.log("Démarrage du jeu...");
  showScreen("desktop");
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
  } else {
    console.error(`Écran ${screenName} non trouvé !`);
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
    case "cipher":
      loadCipherPuzzle(content);
      break;
    case "usb":
      loadUsbPuzzle(content);
      break;
    case "update":
      loadUpdatePuzzle(content);
      break;
    case "social":
      loadSocialPuzzle(content);
      break;
    case "security":
      loadSecurityPuzzle(content);
      break;
  }
}

function getPuzzleTitle(puzzleType) {
  const titles = {
    documents: "📁 Documents - Acrostiche",
    images: "🖼️ Images - Curseurs",
    mail: "📧 Mail - Phishing",
    cipher: "🔐 Chiffrement - César",
    usb: "💾 USB - Supports amovibles",
    update: "🔄 Mise à jour - Logiciels industriels",
    social: "🎭 Ingénierie sociale - Mots de passe",
    security: "🔒 Sécurité - Cybersécurité physique",
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
    case "cipher":
      if (window.showCipherHint) {
        window.showCipherHint();
      }
      break;
    case "usb":
      if (window.showUsbHint) {
        window.showUsbHint();
      }
      break;
    case "update":
      if (window.showUpdateHint) {
        window.showUpdateHint();
      }
      break;
    case "social":
      if (window.showSocialHint) {
        window.showSocialHint();
      }
      break;
    case "security":
      if (window.showSecurityHint) {
        window.showSecurityHint();
      }
      break;
  }
}

async function updateEnigmaStatus(enigmaNumber) {
  const params = new URLSearchParams(window.location.search);
  const gameId = Number(params.get("gameId"));

  if (!gameId) {
    console.warn("Aucun gameId trouvé dans l'URL — impossible de mettre à jour les énigmes.");
    return;
  }

  try {
    const response = await fetch("http://qg.enzo-palermo.com:8000/api/enigmas");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    const enigma = data.member.find(
      (e) => e.games[0] === `/api/games/${gameId}` && e.number === enigmaNumber
    );

    if (!enigma) {
      console.warn(`Aucune énigme trouvée pour gameId=${gameId}, enigmaNumber=${enigmaNumber}`);
      return;
    }

    console.log(`📡 Mise à jour de l'énigme ${enigma.name} → finished`);

    await fetch(`http://qg.enzo-palermo.com:8000/api/enigmas/${enigma.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/merge-patch+json",
        Accept: "application/ld+json",
      },
      body: JSON.stringify({ status: "finished" }),
    });
  } catch (err) {
    console.error("Erreur lors de la mise à jour de l'énigme:", err);
  }
}

function completePuzzle(puzzleType, code, enigmaNumber, isCallingBack = false) {
  gameState.completedPuzzles[puzzleType] = true;
  gameState.puzzleCodes[puzzleType] = code;

  if (isCallingBack) {
    updateEnigmaStatus(enigmaNumber);
  }

  updatePuzzleStatus();
  updateUnlockButton();
  updateProgressTable();
  hidePuzzleModal();
  playSound("success");

  if (Object.values(gameState.completedPuzzles).every((c) => c)) {
    elements.buttons.unlock.disabled = false;
    elements.buttons.unlock.classList.add("pulse");
  }
}


async function startEnigmaPolling() {
  const params = new URLSearchParams(window.location.search);
  const gameId = Number(params.get("gameId"));
  if (!gameId) {
    console.warn("Aucun gameId trouvé dans l'URL — impossible de surveiller les énigmes.");
    return;
  }

  const finishedEnigmas = new Set();

  // Codes fixes selon la difficulté
  const codesByDifficulty = {
    easy: [3, 7, 3, 5, 0, 3, 9, 8],
    medium: [7, 7, 4, 7, 3, 4, 7, 1],
    hard: [5, 7, 6, 9, 2, 8, 6, 5],
  };

  // Ordre des énigmes
  const puzzleOrder = [
    "documents",
    "images",
    "mail",
    "cipher",
    "usb",
    "update",
    "social",
    "security",
  ];

  async function fetchEnigmas() {
    try {
      const response = await fetch("http://qg.enzo-palermo.com:8000/api/enigmas");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      data.member.forEach((e) => {
        if (e.games[0] === "/api/games/" + gameId && e.status === "finished") {
          if (!finishedEnigmas.has(e.id)) {
            finishedEnigmas.add(e.id);

            const puzzleType = puzzleOrder[e.number - 1];
            const code = codesByDifficulty[gameState.difficulty][e.number - 1];

            completePuzzle(puzzleType, code, e.number, false);
          }
        }
      });
    } catch (err) {
      console.error("Erreur lors du polling des énigmes:", err);
    }
  }

  await fetchEnigmas();
  setInterval(fetchEnigmas, 3000);
}

function updatePuzzleStatus() {
  // Mapping des noms de puzzles vers les IDs HTML
  const puzzleIdMap = {
    documents: "doc-status",
    images: "img-status",
    mail: "mail-status",
    cipher: "cipher-status",
    usb: "usb-status",
    update: "update-status",
    social: "social-status",
    security: "security-status",
  };

  Object.keys(gameState.completedPuzzles).forEach((puzzleType) => {
    const statusId = puzzleIdMap[puzzleType];
    const statusElement = document.getElementById(statusId);
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

function updateProgressTable() {
  // Mapping des noms de puzzles vers les IDs HTML du tableau de progression
  const progressIdMap = {
    documents: "doc-progress",
    images: "img-progress",
    mail: "mail-progress",
    cipher: "cipher-progress",
    usb: "usb-progress",
    update: "update-progress",
    social: "social-progress",
    security: "security-progress",
  };

  Object.keys(gameState.completedPuzzles).forEach((puzzleType) => {
    const progressId = progressIdMap[puzzleType];
    const progressElement = document.getElementById(progressId);
    if (progressElement) {
      const codeDisplay = progressElement.querySelector(".code-display");
      if (codeDisplay) {
        if (
          gameState.completedPuzzles[puzzleType] &&
          gameState.puzzleCodes[puzzleType]
        ) {
          codeDisplay.textContent = gameState.puzzleCodes[puzzleType];
          codeDisplay.classList.add("found");
        } else {
          codeDisplay.textContent = "-";
          codeDisplay.classList.remove("found");
        }
      }
    }
  });
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

  if (code.length !== 8) {
    showMessage("Veuillez entrer un code à 8 chiffres", "error");
    return;
  }

  // Vérifier le code (dans un vrai jeu, on vérifierait l'ordre)
  const expectedCode = Object.values(gameState.puzzleCodes).join("");

  if (code === expectedCode) {
    console.log("Code correct ! Fermeture de la modale...");
    // Fermer la modale de déverrouillage
    elements.modals.unlock.classList.remove("active");
    console.log("Modale fermée, classes:", elements.modals.unlock.className);

    // Attendre un peu que la modale se ferme avant d'afficher la victoire
    setTimeout(() => {
      console.log("Appel de endGame(true)");
      endGame(true);
    }, 100);
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
  if (victory) {
    // Fermer toutes les modales ouvertes
    Object.values(elements.modals).forEach((modal) => {
      modal.classList.remove("active");
    });

    // Forcer la fermeture de la modale de déverrouillage
    elements.modals.unlock.classList.add("force-hidden");

    // Attendre un peu avant d'afficher la victoire
    setTimeout(() => {
      showScreen("victory");
      updateVictoryStats();
      playSound("victory");
    }, 50);
  }
}

function updateVictoryStats() {
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

function loadCipherPuzzle(container) {
  if (window.loadCipherPuzzle) {
    window.loadCipherPuzzle(container);
  }
}

// Exporter les fonctions nécessaires pour les puzzles
window.gameState = gameState;
window.completePuzzle = completePuzzle;
window.showMessage = showMessage;
window.playSound = playSound;
window.showScreen = showScreen;
window.fetchGameDifficulty = fetchGameDifficulty;
