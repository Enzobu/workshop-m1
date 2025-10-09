const API_BASE = "http://qg.enzo-palermo.com:8000";

const indexForm = document.getElementById("joinForm");
const errorP = document.getElementById("error");

let postError = false;

let localPlayer = JSON.parse(localStorage.getItem("playerInfo") || "null");
if (
    localPlayer &&
    localPlayer.id &&
    localPlayer.gameId &&
    window.location.pathname.endsWith("index.html")
) {
    window.location.href = `lobby.html?gameId=${localPlayer.gameId}&playerId=${localPlayer.id}`;
}

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
            const gameRes = await fetch(`${API_BASE}/api/games/${gameId}`);
            if (!gameRes.ok) throw new Error("Partie introuvable");

            const game = await gameRes.json();

            if (game.players && game.players.length >= game.maxPlayer) {
                if (errorP) errorP.textContent = "La partie est pleine !";
                return;
            }

            const playerData = {
                name: playerName,
                gameId: `/api/games/${gameId}`
            };


            const playerRes = await fetch(`${API_BASE}/api/players`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/ld+json",
                    "Accept": "application/ld+json"
                },
                body: JSON.stringify(playerData)
            });


            if (!playerRes.ok) throw new Error("Erreur à la création du joueur");

            const createdPlayer = await playerRes.json();

            localStorage.setItem("playerInfo", JSON.stringify({
                id: createdPlayer.id,
                name: createdPlayer.name,
                gameId: gameId
            }));

            window.location.href = `lobby.html?gameId=${gameId}&playerId=${createdPlayer.id}`;

        } catch (err) {
            console.error("Erreur front :", err);
            if (errorP) errorP.textContent = err.message;
            localStorage.removeItem("playerInfo");
        }
    });
}

const playerListDiv = document.getElementById("playerList");
const gameErrorDiv = document.getElementById("gameError");

async function loadGame() {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get("gameId");

    if (!gameId) {
        console.warn("Aucun gameId dans l'URL");
        return;
    }


    try {
        const gameRes = await fetch(`${API_BASE}/api/games/${gameId}`);
        if (!gameRes.ok) throw new Error("Impossible de récupérer la partie");

        const game = await gameRes.json();
        const players = [];

        if (game.players && game.players.length > 0) {
            for (const playerIRI of game.players) {
                try {
                    const res = await fetch(`${API_BASE}${playerIRI}`);
                    if (res.ok) {
                        const p = await res.json();
                        players.push(p);
                    }
                } catch (err) {
                    console.error("Erreur fetch joueur :", err);
                }
            }
        }


        if (playerListDiv) {
            playerListDiv.innerHTML =
                players.length > 0
                    ? players.map(p => `<li>${p.name || "(sans nom)"}</li>`).join("")
                    : "<li>En attente de joueurs...</li>";
        }

        if (players.length === game.maxPlayer) {
            try {
                const res = await fetch(`${API_BASE}/api/games/${gameId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/merge-patch+json",
                        "Accept": "application/ld+json"
                    },
                    body: JSON.stringify({
                        startedAt: new Date().toISOString()
                    })
                });

                if (!res.ok) {
                    console.error("Erreur lors du démarrage de la partie :", res.status);
                }

                const enigmaNameList = ["documents", "images", "mail", "cipher", "usb", "update", "social", "security"];

                for (enigma of enigmaNameList) {
                    enigmaIndex = enigmaNameList.indexOf(enigma) + 1;

                    const enigmaRes = await fetch(`${API_BASE}/api/enigmas`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/ld+json",
                            "Accept": "application/ld+json"
                        },
                        body: JSON.stringify({ name: enigma, status: "pending", difficulty: game.difficulty, games: [`/api/games/${gameId}`], number: enigmaIndex })
                    });


                    if (!enigmaRes.ok) throw new Error("Erreur à la création de l'énigme");
                }

                const enigmaFinalRes = await fetch(`${API_BASE}/api/enigmas`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/ld+json",
                        "Accept": "application/ld+json"
                    },
                    body: JSON.stringify({ name: 'final', status: "pending", difficulty: game.difficulty, games: [`/api/games/${gameId}`], number: enigmaIndex })
                });


                if (!enigmaFinalRes.ok) throw new Error("Erreur à la création de l'énigme finale");

                window.location.href = `../../index.html?gameId=${gameId}`;
            } catch (err) {
                console.error("Erreur fetch démarrage partie :", err);
            }
        }

        if (gameErrorDiv) gameErrorDiv.textContent = "";

    } catch (err) {
        console.error("Erreur loadGame :", err);
        if (gameErrorDiv) gameErrorDiv.textContent = "Impossible de charger la partie.";

        console.warn("Suppression du localStorage (partie inaccessible)");
        localStorage.removeItem("playerInfo");
    }
}

if (window.location.pathname.endsWith("lobby.html")) {
    loadGame();
    setInterval(loadGame, 3000);
}
