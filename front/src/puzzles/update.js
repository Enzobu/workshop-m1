// Énigme Mise à jour - Gestion des logiciels industriels (3 niveaux de difficulté)
function loadUpdatePuzzle(container) {
  // Configuration de la difficulté depuis l'API
  const difficulty = window.gameState?.difficulty || "easy";

  // Définition des énigmes selon la difficulté
  const updatePuzzles = {
    easy: {
      hint: "Cherche la plus grande valeur après la lettre v.",
      title: "LA VERSION OUBLIÉE",
      content: `LA VERSION OUBLIÉE

Un technicien découvre que la machine de découpe tourne sur une version 
ancienne du logiciel. Sur l'écran, trois versions apparaissent :

v1.5
v2.4
v3.1

Énigme : Quel chiffre correspond à la version la plus récente ?

💡 INFO : Les mises à jour logicielles corrigent des failles de sécurité.
Utiliser une version obsolète, c'est laisser une porte ouverte aux attaques.
Dans l'industrie, mettre à jour régulièrement les logiciels protège les 
machines, les réseaux et la production.`,
      answer: "3",
      maxAttempts: 3,
    },
    medium: {
      hint: "Un vrai correctif ne finit jamais par une extension de document texte ou image.",
      title: "LE FAUX PATCH DE SÉCURITÉ",
      content: `LE FAUX PATCH DE SÉCURITÉ

Un mail envoyé à un technicien contient un lien vers un "patch de sécurité urgent" :

update_7_patch_signed.exe
update_3_patch.docx
update_9_fix.bat
update_5_release.bin
update_2_trusted.msi
update_4_secure.exe
update_8_patch.tar.gz
security6_update.zip
update_1_readme.txt
firmware_0_v2.img
hotfix11_patch.pkg
installer_12_secure.msu
update_temp_13.exe.sig
upgrade14.sh
patch15_update.dll

Mais un seul fichier est légitime — les autres sont dangereux.
Ton rôle est d'identifier le vrai patch.

Énigme : Quel chiffre correspond au fichier correct ?

⚠️ ATTENTION : Les cyberattaques passent souvent par de faux fichiers 
de mise à jour. Toujours vérifier l'extension et la source d'un fichier 
avant de l'exécuter.`,
      answer: "4",
      maxAttempts: 3,
    },
    hard: {
      hint: "Cherche celui qui n'indique pas un état normal dans les logs.",
      title: "LE SERVEUR DE MISE À JOUR COMPROMIS",
      content: `LE SERVEUR DE MISE À JOUR COMPROMIS

Dans une usine automatisée, les ingénieurs découvrent un serveur suspect 
qui envoie des mises à jour aux machines.

LOGS D'ACCÈS :
[2025-10-06 01:12:03] Server_1_update  - IP 10.2.1.11  - package: update_2_trusted.msi      - size: 4,572,032  - sig: VALID   - status: OK
[2025-10-06 02:08:21] Server_4_secure  - IP 10.2.1.14  - package: update_7_patch_signed.exe - size: 6,214,400  - sig: VALID   - status: OK
[2025-10-06 03:15:49] Server_8_patch   - IP 172.16.99.45- package: firmware_0_v2.img        - size: 12,345,600 - sig: MISSING - status: UNKNOWN
[2025-10-06 04:00:12] Server_9_system  - IP 10.2.1.20  - package: update_9_fix.bat          - size: 15,360      - sig: MISSING - status: REJECTED
[2025-10-06 05:23:05] Server_8_patch   - IP 198.51.100.77 - package: firmware_0_v2.img        - size: 12,345,600 - sig: INVALID - status: FAIL  (checksum differs from repo)
[2025-10-06 07:30:44] Server_2_update  - IP 10.2.1.12  - package: update_4_secure.exe      - size: 6,214,400  - sig: VALID   - status: OK
[2025-10-06 08:05:19] Server_8_patch   - IP 203.0.113.22 - package: firmware_0_v2.img        - size: 12,345,600 - sig: INVALID - status: FAIL  (delivered outside maintenance window)
[2025-10-06 09:45:51] Server_11_aux    - IP 10.2.1.30  - package: patch15_update.dll        - size: 2,048,000  - sig: VALID   - status: OK
[2025-10-06 10:12:12] Server_3_hotfix  - IP 10.2.1.13  - package: update_5_release.bin     - size: 8,388,608  - sig: VALID   - status: OK
[2025-10-06 11:00:03] Server_8_patch   - IP 198.51.100.77 - package: firmware_0_v2.img        - size: 12,345,600 - sig: INVALID - status: FAIL  (package signature altered)
[2025-10-06 12:30:00] Server_4_secure  - IP 10.2.1.14  - package: update_7_patch_signed.exe - size: 6,214,400  - sig: VALID   - status: OK
[2025-10-06 13:02:10] Server_8_patch   - IP 198.51.100.77 - package: firmware_0_v2.img        - size: 12,345,600 - sig: INVALID - status: FAIL  (retries 5x)
[2025-10-06 14:20:41] Server_9_system  - IP 10.2.1.20  - package: update_9_fix.bat          - size: 15,360      - sig: MISSING - status: QUARANTINE
[2025-10-06 16:08:59] Server_8_patch   - IP 203.0.113.22 - package: firmware_0_v2.img        - size: 12,345,600 - sig: INVALID - status: FAIL  (geolocation mismatch)
[2025-10-06 18:31:22] Server_12_mirror  - IP 10.2.1.40 - package: hotfix11_patch.pkg        - size: 3,145,728  - sig: VALID   - status: OK

Une note précise : "Un seul serveur a été compromis. Le chiffre présent 
dans son nom est la clé."

Énigme : Quel chiffre correspond au serveur compromis ?

🔍 ANALYSE : Même les serveurs internes peuvent être piratés. Les mots 
comme FAIL ou UNKNOWN dans des journaux sont des signaux d'alerte.`,
      answer: "8",
      maxAttempts: 3,
    },
  };

  const puzzle = updatePuzzles[difficulty];

  container.innerHTML = `
        <div class="puzzle-hint" style="display: none;">
            <strong>💡 Indice :</strong> ${puzzle.hint}
        </div>
        
        <div class="update-container">
            <div class="update-header">
                <h3>${puzzle.title}</h3>
                <div class="update-icon">🔄</div>
            </div>
            
            <div class="update-content">
                <div class="update-files">
                    ${puzzle.content}
                </div>
            </div>
        </div>
        
        <div class="code-input-section">
            <label for="update-code">Chiffre :</label>
            <input type="text" id="update-code" maxlength="1" placeholder="?" />
            <button id="submit-update" class="btn btn-primary">Valider</button>
        </div>
        
        <div id="update-feedback" class="feedback"></div>
        <div id="update-attempts" class="attempts-count"></div>
    `;

  // Configuration des événements
  const codeInput = container.querySelector("#update-code");
  const submitBtn = container.querySelector("#submit-update");
  const feedback = container.querySelector("#update-feedback");
  const attemptsDisplay = container.querySelector("#update-attempts");

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
        completePuzzle("update", puzzle.answer);
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
function showUpdateHint() {
  const hintElement = document.querySelector(".puzzle-hint");
  if (hintElement) {
    hintElement.style.display = "block";
    hintElement.classList.add("show");
  }
}

// Exporter les fonctions
window.loadUpdatePuzzle = loadUpdatePuzzle;
window.showUpdateHint = showUpdateHint;
