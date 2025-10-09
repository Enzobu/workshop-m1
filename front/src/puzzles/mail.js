// Énigme Mail - Détection de phishing (3 niveaux de difficulté)
function loadMailPuzzle(container) {
  // Configuration de la difficulté depuis l'API
  const difficulty = window.gameState?.difficulty || "easy";

  // Définition des énigmes selon la difficulté
  const mailPuzzles = {
    easy: {
      hint: "Cherche les détails qui ne correspondent pas à un vrai mail officiel : expéditeur, orthographe, liens… Chaque détail compte pour trouver le chiffre.",
      subject: "Vérification urgente de votre compte",
      from: "De : service@banquefidèle.com",
      body: `
        <p>Bonjour,</p>
        <p>Nous avons remarqué une activité inhabitueIle sur votre compte.</p>
        <p>Merci de cliquer sur ce lien pour vérifier vos informations : <a href="http://banquefidèle.net/account" class="suspicious-link">http://banquefidèle.net/account</a></p>
        <p>Cordialement,<br>Service client<br>0969390001</p>
      `,
      errors: [
        {
          element: ".mail-from",
          text: "service@banquefidèle.com",
          reason: "Adresse email suspecte (domaine non officiel)",
        },
        {
          element: ".mail-body",
          text: "inhabitueIle",
          reason: "Faute d'orthographe (devrait être 'inhabituelle')",
        },
        {
          element: ".suspicious-link",
          text: "http://banquefidèle.net/account",
          reason: "Lien non sécurisé (http au lieu de https, domaine suspect)",
        },
      ],
      answer: "3",
      maxErrors: 3,
    },
    medium: {
      hint: "Même si le mail semble correct à première vue, compare-le avec ce que tu sais d'un vrai message officiel : adresse de l'expéditeur, lien, formulation, personnalisation du message… Chaque détail étrange compte.",
      subject: "Action requise – colis en attente",
      from: "De : notifications@colis-express.com",
      body: `
        <p>Bonjour,</p>
        <p>Nous avons tenté de livrer votre colis mais une erreur est survenue.</p>
        <p>Veuillez cliquer sur ce lien pour résoudre le problème et planifier une nouvelle livraison : <a href="https://colis-express.com/delivery" class="suspicious-link">[résoudre mon colis]</a></p>
        <p>Merci pour votre réactivité.</p>
        <p>Cordialement,<br>Service client Colis Express</p>
      `,
      errors: [
        {
          element: ".mail-from",
          text: "notifications@colis-express.com",
          reason: "Adresse email suspecte (domaine générique)",
        },
        {
          element: ".suspicious-link",
          text: "[résoudre mon colis]",
          reason: "Lien générique sans personnalisation",
        },
        {
          element: ".mail-body",
          text: "Merci pour votre réactivité",
          reason:
            "Formulation subtilement suspecte (pas de coordonnées officielles)",
        },
      ],
      answer: "4",
      maxErrors: 3,
    },
    hard: {
      hint: "Compare ce que tu vois (le nom affiché, le texte du lien) avec ce que tu peux vérifier sans cliquer (l'adresse réelle de l'expéditeur, l'URL complète en survol ou en copiant le lien, la nature du fichier joint). Cherche les petites différences — homoglyphes, redirections, double extensions, absence de personnalisation, formulation urgente.",
      subject: "URGENT — Votre compte sera suspendu dans 24h",
      from: "De : Google Support &lt;support@goog1e-security.com&gt;",
      body: `
        <p>Bonjour,</p>
        <p>Nous avons détecté une activité anormale sur votre compte. Pour éviter la suspension, cliquez ici pour vérifier vos informations et télécharger votre facture de conformité.</p>
        <p><a href="https://accounts.google.com/secure-reset" class="suspicious-link">https://accounts.google.com/secure-reset</a> (lien masqué)</p>
        <p>Pièce jointe : <span class="attachment">facture_1034.pdf.exe</span></p>
        <p>Cordialement,<br>Google Support</p>
      `,
      errors: [
        {
          element: ".mail-from",
          text: "support@goog1e-security.com",
          reason: "Homoglyphe dans l'adresse (goog1e au lieu de google)",
        },
        {
          element: ".mail-from",
          text: "Google Support",
          reason: "Nom affiché ≠ adresse réelle (trompeur)",
        },
        {
          element: ".suspicious-link",
          text: "https://accounts.google.com/secure-reset",
          reason: "Lien masqué/URL trompeuse",
        },
        {
          element: ".attachment",
          text: "facture_1034.pdf.exe",
          reason: "Pièce jointe à double extension (exécutable déguisé)",
        },
        {
          element: ".mail-subject",
          text: "URGENT — Votre compte sera suspendu dans 24h",
          reason: "Formulation urgente/menaçante",
        },
        {
          element: ".mail-body",
          text: "Bonjour,",
          reason: "Absence de personnalisation (salut générique)",
        },
      ],
      answer: "6",
      maxErrors: 6,
    },
  };

  const puzzle = mailPuzzles[difficulty];

  // Traiter le corps du mail pour entourer les parties suspectes de spans
  let processedBody = puzzle.body;
  puzzle.errors.forEach((error) => {
    if (error.element === ".mail-body") {
      // Remplacer le texte suspect par un span cliquable
      const regex = new RegExp(
        `(${error.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
        "g"
      );
      processedBody = processedBody.replace(
        regex,
        `<span class="suspicious-text" data-text="${error.text}">$1</span>`
      );
    }
  });

  container.innerHTML = `
        <div class="puzzle-hint" style="display: none;">
            <strong>💡 Indice :</strong> ${puzzle.hint}
        </div>
        
        <div class="mail-container">
            <div class="mail-header">
                <div class="mail-subject">${puzzle.subject}</div>
                <div class="mail-from">${puzzle.from}</div>
            </div>
            
            <div class="mail-body">
                ${processedBody}
            </div>
        </div>
        
        <div class="code-input-section">
            <label for="mail-code">Chiffre :</label>
            <input type="text" id="mail-code" maxlength="1" placeholder="?" />
            <button id="submit-mail" class="btn btn-primary">Valider</button>
        </div>
        
        <div id="mail-feedback" class="feedback"></div>
    `;

  // Configuration des événements
  const codeInput = container.querySelector("#mail-code");
  const submitBtn = container.querySelector("#submit-mail");
  const feedback = container.querySelector("#mail-feedback");

  // Éléments à surligner (erreurs de phishing) - dynamiques selon la difficulté
  const errors = puzzle.errors.map((errorDef) => {
    let element;
    if (errorDef.element === ".mail-body") {
      // Pour les erreurs dans le corps, chercher le span correspondant
      element = container.querySelector(
        `.suspicious-text[data-text="${errorDef.text}"]`
      );
    } else {
      element = container.querySelector(errorDef.element);
    }
    return {
      element: element,
      text: errorDef.text,
      reason: errorDef.reason,
    };
  });

  let foundErrors = 0;
  let highlightedElements = [];

  // Configuration des éléments cliquables
  errors.forEach((error, index) => {
    if (!error.element) return; // Skip si l'élément n'existe pas

    const element = error.element;
    element.style.cursor = "pointer";
    element.classList.add("highlightable");
    element.title = "Cliquez pour surligner cette erreur";

    // Pour les éléments .suspicious-text, ajouter les classes CSS appropriées
    if (element.classList.contains("suspicious-text")) {
      element.classList.add("suspicious-text");
    }

    element.addEventListener("click", function (e) {
      // Empêcher la navigation pour les liens
      e.preventDefault();
      e.stopPropagation();

      // Empêcher la désélection - une fois sélectionné, on ne peut plus désélectionner
      if (this.classList.contains("highlighted")) {
        return;
      }

      if (!this.classList.contains("highlighted")) {
        this.classList.add("highlighted", "correct");
        highlightedElements.push(this);
        foundErrors++;

        // Feedback visuel
        this.style.background = "#4caf50";
        this.style.color = "white";
        this.style.padding = "2px 4px";
        this.style.borderRadius = "3px";

        // Mettre à jour le feedback
        feedback.innerHTML = `<div class="info">✅ Erreur trouvée ! (${foundErrors}/${puzzle.maxErrors})</div>`;

        // Vérifier si toutes les erreurs sont trouvées
        if (foundErrors === puzzle.maxErrors) {
          feedback.innerHTML = `<div class="success">✅ Toutes les erreurs trouvées ! Indice final = ${puzzle.answer}</div>`;
          codeInput.value = puzzle.answer;
          codeInput.disabled = true;
          submitBtn.disabled = true;
          submitBtn.textContent = "✓ Résolu";

          setTimeout(() => {
            completePuzzle("mail", puzzle.answer, 3, true);
          }, 1000);

          playSound("success");
        } else {
          playSound("hint");
        }
      }
    });
  });

  // Validation manuelle du code
  submitBtn.addEventListener("click", function () {
    const code = codeInput.value.trim();

    if (code === puzzle.answer) {
      feedback.innerHTML = `<div class="success">✅ Correct ! Le chiffre est ${puzzle.answer}</div>`;
      codeInput.disabled = true;
      submitBtn.disabled = true;
      submitBtn.textContent = "✓ Résolu";

      setTimeout(() => {
        completePuzzle("mail", puzzle.answer, 3, true);
      }, 1000);

      playSound("success");
    } else {
      feedback.innerHTML = `<div class="error">❌ Incorrect. Trouvez les ${puzzle.maxErrors} erreurs dans l'email...</div>`;
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
    if (foundErrors < puzzle.maxErrors) {
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

  // Protection globale contre la navigation des liens
  const allLinks = container.querySelectorAll("a");
  allLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      // Optionnel : afficher un message d'avertissement
      console.log("Navigation bloquée :", this.href);
    });
  });
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
