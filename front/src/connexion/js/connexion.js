const API_BASE = "http://qg.enzo-palermo.com:8000";

// --- INDEX.HTML --- //
const indexForm = document.getElementById("joinForm");
const errorP = document.getElementById("error");

let postError = false;

// 🔹 Vérifie si on a déjà un joueur stocké localement (et valide)
let localPlayer = JSON.parse(localStorage.getItem("playerInfo") || "null");
if (
    localPlayer &&
    localPlayer.id &&
    localPlayer.gameId &&
    window.location.pathname.endsWith("index.html")
) {
    console.log("📦 Joueur valide trouvé → redirection vers game.html");
    window.location.href = `game.html?gameId=${localPlayer.gameId}&playerId=${localPlayer.id}`;
}

// --- FORMULAIRE DE CONNEXION --- //
if (indexForm) {
    indexForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (errorP) errorP.textContent = "";

        const gameId = document.getElementById("gameIdInput").value.trim();
        const playerName = document.getElementById("playerNameInput").value.trim();

        if (!gameId || !playerName) {
            if (errorP) errorP.textContent = "Veuillez remplir tous les champs";
            return;
        }

        try {
            console.log("📡 Vérif si la partie existe :", gameId);
            const gameRes = await fetch(`${API_BASE}/api/games/${gameId}`);
            if (!gameRes.ok) throw new Error("Partie introuvable");

            const game = await gameRes.json();
            console.log("🎯 Partie trouvée :", game);

            if (game.players && game.players.length >= game.maxPlayer) {
                if (errorP) errorP.textContent = "La partie est pleine !";
                return;
            }

            // 🔹 Créer le joueur (API Platform attend un IRI pour gameId)
            const playerData = {
                name: playerName,
                gameId: `/api/games/${gameId}`
            };

            console.log("📤 Envoi du joueur :", playerData);

            const playerRes = await fetch(`${API_BASE}/api/players`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/ld+json",
                    "Accept": "application/ld+json"
                },
                body: JSON.stringify(playerData)
            });

            console.log("📡 Réponse POST joueur :", playerRes.status);

            if (!playerRes.ok) throw new Error("Erreur à la création du joueur");

            const createdPlayer = await playerRes.json();
            console.log("✅ Joueur créé :", createdPlayer);

            localStorage.setItem("playerInfo", JSON.stringify({
                id: createdPlayer.id,
                name: createdPlayer.name,
                gameId: gameId
            }));

            window.location.href = `game.html?gameId=${gameId}&playerId=${createdPlayer.id}`;

        } catch (err) {
            console.error("❌ Erreur front :", err);
            if (errorP) errorP.textContent = err.message;

            // 🧹 Nettoyage localStorage si le POST échoue
            localStorage.removeItem("playerInfo");
        }
    });
}

// --- GAME.HTML --- //
const playerListDiv = document.getElementById("playerList");
const readyButton = document.getElementById("readyButton");
const gameErrorDiv = document.getElementById("gameError");

let gameData = null;

async function loadGame() {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get("gameId");

    if (!gameId) {
        console.warn("⚠️ Aucun gameId dans l'URL");
        return;
    }

    console.log("📡 Chargement de la partie", gameId);

    try {
        const gameRes = await fetch(`${API_BASE}/api/games/${gameId}`);
        console.log("🌍 Statut API loadGame :", gameRes.status);
        if (!gameRes.ok) throw new Error("Impossible de récupérer la partie");

        const game = await gameRes.json();
        gameData = game;

        const players = [];

        // 🔹 Récupère les infos des joueurs à partir des IRIs
        if (game.players && game.players.length > 0) {
            for (const playerIRI of game.players) {
                try {
                    const res = await fetch(`${API_BASE}${playerIRI}`);
                    if (res.ok) {
                        const p = await res.json();
                        players.push(p);
                    } else {
                        console.warn("Impossible de récupérer le joueur :", playerIRI);
                    }
                } catch (err) {
                    console.error("Erreur fetch joueur :", err);
                }
            }
        }

        console.log("👥 Joueurs :", players);

        if (playerListDiv) {
            playerListDiv.innerHTML =
                players.length > 0
                    ? players.map(p => `<li>${p.name || "(sans nom)"} ${p.ready ? "✅" : "🕓"}</li>`).join("")
                    : "<li>🕓 En attente de joueurs...</li>";
        }

        // 🔹 Vérifie si tous les joueurs sont prêts
        const allReady = players.length === game.maxPlayer && players.every(p => p.ready);

        if (readyButton) {
            const localPlayer = JSON.parse(localStorage.getItem("playerInfo"));
            if (!localPlayer.ready) readyButton.style.display = "block";
            else readyButton.style.display = "none";
        }

        // 🔹 Redirige si tous les joueurs sont prêts
        if (allReady) {
            console.log("🚀 Tous les joueurs sont prêts → redirection vers enigme.html");
            window.location.href = `enigme.html?gameId=${gameId}`;
        }

        if (gameErrorDiv) gameErrorDiv.textContent = "";

    } catch (err) {
        console.error("❌ Erreur loadGame :", err);
        if (gameErrorDiv) gameErrorDiv.textContent = "Impossible de charger la partie.";

        // 🧹 Suppression du localStorage pour éviter le loop
        console.warn("🧹 Suppression du localStorage (partie inaccessible)");
        localStorage.removeItem("playerInfo");
    }
}

// 🔹 Bouton READY
if (readyButton) {
    readyButton.addEventListener("click", async () => {
        try {
            const localPlayer = JSON.parse(localStorage.getItem("playerInfo"));
            if (!localPlayer || !localPlayer.id) throw new Error("Pas de joueur trouvé en localStorage");

            const playerData = { ready: true };

            const res = await fetch(`${API_BASE}/api/players/${localPlayer.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/merge-patch+json",
                    "Accept": "application/ld+json"
                },
                body: JSON.stringify(playerData)
            });

            console.log("📡 PATCH ready statut :", res.status);

            if (!res.ok) throw new Error("Impossible de passer en ready");

            localPlayer.ready = true;
            localStorage.setItem("playerInfo", JSON.stringify(localPlayer));

            await loadGame();

        } catch (err) {
            console.error("❌ Erreur bouton prêt :", err);
            postError = true;
        }
    });
}

// 🔹 Charge la partie uniquement si on est sur game.html
if (window.location.pathname.endsWith("game.html")) {
    console.log("🕹️ Page GAME détectée → chargement de la partie...");
    loadGame();

    // 🔹 Actualisation automatique toutes les 3 secondes
    setInterval(loadGame, 3000);
}
