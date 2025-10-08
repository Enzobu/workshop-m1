// Énigme Sécurité - Cybersécurité physique et sensibilisation (3 niveaux de difficulté)
function loadSecurityPuzzle(container) {
  // Configuration de la difficulté depuis l'API
  const difficulty = window.gameState?.difficulty || "easy";

  // Définition des énigmes selon la difficulté
  const securityPuzzles = {
    easy: {
      hint: "Le code est une combinaison de lettres des mots en MAJUSCULE.",
      title: "Le mot de passe sur le post-it",
      content: `Dans une petite entreprise de production, CHAQUE employé dispose d'un compte personnel pour accéder aux machines.
Un jour, un technicien remarque que son collègue a collé un post-it avec son mot de passe sur l'écran pour ne pas l'OUBLIER.
Rien de grave, pense-t-il… jusqu'à ce qu'un prestataire de passage prenne une photo de son poste.
Le lendemain, un accès non autorisé est détecté.
Depuis, un rappel a été fait : un mot de passe ne doit jamais être ECRIT, partagé ou affiché.
Ce n'est pas qu'une règle, c'est une PROTECTION pour toute l'entreprise.

Énigme : Trouve le code caché dans les mots en MAJUSCULE.

💡 INFO : La sécurité de base au travail passe par la protection des identifiants.
Un mot de passe affiché, même temporairement, peut compromettre tout un système.`,
      answer: "8",
      maxAttempts: 3,
    },
    medium: {
      hint: "Une fuite d'information est dans le message, plusieurs lettres sont en majuscules, dans le désordre et permettront de former un mot, à toi de voir quel mot cela donne ! Un seul chiffre peut être créé.",
      title: "L'appel du faux support technique",
      content: `Un matin, Léa, apprentie dans une société d'auTomatisation, reçoit un appel.
L'interlocuteur prétend apPartenir à l'équipe informatique et demande son aiDe pour "tester une mise à jour urgente".
Pressée, elle suit leS instructions : ouvrir un lien, entrer ses identifiants.
Quelques heures plus tard, plusieurs serveurs sont inaccessIbles — un virus a été introduit.
Léa découvre Qu'elle a été victime d'une attaque dite "d'ingénierie sociale", où le pirate manipule pour obtenir coNfiance et accès.
L'entreprise s'en sort, mais leçon retenUe : toujours vérifier la légitimité d'une demAnde avant d'agir.

Énigme : Les lettres en MAJUSCULE forment un mot. Quel chiffre ce mot représente-t-il ?

⚠️ ATTENTION : La manipulation et l'ingénierie sociale sont des techniques courantes.
Les pirates exploitent la confiance et l'urgence pour obtenir des accès non autorisés.
Toujours vérifier l'identité de l'interlocuteur avant de donner des informations sensibles.`,
      answer: "1",
      maxAttempts: 3,
    },
    hard: {
      hint: "Il manque certaines lettres dans le texte. Trouve les lettres manquantes pour former un mot qui donne un chiffre.",
      title: "L'incident du badge perdu",
      content: `Dans une usine automatisée, les entrées sont sécurisées par badge.
Un opérateur perd le sien dans le parking mais ne le signale pas tout de suite, pensant le retrouver.
Le lendemain, le système détecte une connexion au cœur du réseau à une heure inhabituelle.
L'analyse montre u'n individu a utilisé le badge pour entrer et installer une clé USB contenant un logiiel espion.
Aucun dommage majeur, mais l'alerte a été chaude :
le retard du signalement a permis au pirate de passer inaperçu.
Depuis, l'etreprise impose une règle stricte : tout incident, même anodin, doit être signalé immédiatemet.

Énigme : Le texte contient des erreurs. Trouve le mot correct et extrais-en le chiffre.

🚨 CRITIQUE : La cybersécurité physique et la réactivité sont essentielles.
Un badge perdu non signalé peut compromettre toute la sécurité d'une installation.
La rapidité de réaction face aux incidents limite les dégâts potentiels.`,
      answer: "5",
      maxAttempts: 3,
    },
  };

  const puzzle = securityPuzzles[difficulty];

  // Créer l'interface de l'énigme
  container.innerHTML = `
    <div class="security-container">
      <div class="security-header">
        <h3>${puzzle.title}</h3>
        <div class="security-icon">🔒</div>
      </div>
      <div class="security-content">
        <div class="security-text">
          ${puzzle.content
            .split("\n")
            .map((line) => `<p>${line}</p>`)
            .join("")}
        </div>
        <div class="security-input-section">
          <label for="security-answer">Votre réponse :</label>
          <input type="text" id="security-answer" maxlength="1" placeholder="?" />
          <button id="security-submit" class="btn btn-primary">Valider</button>
        </div>
        <div class="security-feedback" id="security-feedback"></div>
        <div class="security-attempts">
          <span id="security-attempts-count">Tentatives : 0/${
            puzzle.maxAttempts
          }</span>
        </div>
      </div>
    </div>
  `;

  // Variables pour le suivi des tentatives
  let attempts = 0;
  const maxAttempts = puzzle.maxAttempts;

  // Éléments DOM
  const answerInput = document.getElementById("security-answer");
  const submitBtn = document.getElementById("security-submit");
  const attemptsCount = document.getElementById("security-attempts-count");
  const feedback = document.getElementById("security-feedback");

  // Fonction pour afficher le feedback
  function showFeedback(message, type = "info") {
    feedback.textContent = message;
    feedback.className = `security-feedback ${type}`;
  }

  // Fonction pour mettre à jour le compteur de tentatives
  function updateAttempts() {
    attemptsCount.textContent = `Tentatives : ${attempts}/${maxAttempts}`;
  }

  // Fonction pour valider la réponse
  function validateAnswer() {
    const userAnswer = answerInput.value.trim();

    if (!userAnswer) {
      showFeedback("Veuillez entrer une réponse.", "error");
      return;
    }

    attempts++;
    updateAttempts();

    if (userAnswer === puzzle.answer) {
      showFeedback("✅ Correct ! Vous avez trouvé le code.", "success");
      answerInput.disabled = true;
      submitBtn.disabled = true;

      // Compléter l'énigme après un court délai
      setTimeout(() => {
        if (window.completePuzzle) {
          window.completePuzzle("security", puzzle.answer);
        }
      }, 1500);
    } else {
      if (attempts >= maxAttempts) {
        showFeedback(
          "❌ Nombre maximum de tentatives atteint. La réponse était : " +
            puzzle.answer,
          "error"
        );
        answerInput.disabled = true;
        submitBtn.disabled = true;
      } else {
        showFeedback(
          `❌ Incorrect. Il vous reste ${maxAttempts - attempts} tentative(s).`,
          "error"
        );
        answerInput.value = "";
        answerInput.focus();
      }
    }
  }

  // Événements
  submitBtn.addEventListener("click", validateAnswer);

  answerInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      validateAnswer();
    }
  });

  // Focus sur l'input
  answerInput.focus();
}

// Fonction pour afficher l'indice
function showSecurityHint() {
  const difficulty = window.gameState?.difficulty || "easy"; // Même difficulté que dans loadSecurityPuzzle
  const securityPuzzles = {
    easy: {
      hint: "Le code est une combinaison de lettres des mots en MAJUSCULE.",
    },
    medium: {
      hint: "Une fuite d'information est dans le message, plusieurs lettres sont en majuscules, dans le désordre et permettront de former un mot, à toi de voir quel mot cela donne ! Un seul chiffre peut être créé.",
    },
    hard: {
      hint: "Il manque certaines lettres dans le texte. Troure les lettres manquantes pour former un mot qui donne un chiffre.",
    },
  };

  const puzzle = securityPuzzles[difficulty];

  // Afficher l'indice dans une notification
  if (window.showMessage) {
    window.showMessage(`💡 Indice : ${puzzle.hint}`, "info");
  }
}

// Exporter les fonctions
window.loadSecurityPuzzle = loadSecurityPuzzle;
window.showSecurityHint = showSecurityHint;
