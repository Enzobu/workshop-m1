#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <LiquidCrystal_I2C.h>
#include <Wire.h>

// Config Wi-Fi
// const char* WIFI_SSID = "MyDIL_2G";
// const char* WIFI_PASS = "MyD1LP@sswOrd";
const char* WIFI_SSID = "A15 de Enzo";
const char* WIFI_PASS = "h6rl7abu";
const char* API_BASE  = "http://qg.enzo-palermo.com:8000";

// Écran LCD I2C (adresse la plus courante : 0x27 ou 0x3F)
LiquidCrystal_I2C lcd(0x27, 20, 4);

String gameId = "";
String adminToken = "";

bool standby = true;
bool POSTSend = false;

const char* difficulties[] = {
  "Facile",
  "Moyen",
  "Difficile"
};

#define LEDV D0
#define LEDJ D3
#define LEDR D8

#define BTN1 D5
#define BTN2 D6
#define BTN3 D7
#define BTN4 D4

// Petite fonction pratique pour effacer une ligne
void lcdPrintLine(uint8_t row, const String& text) {
    lcd.setCursor(0, row);
    String padded = text;
    while (padded.length() < 20) padded += ' '; // efface le reste de la ligne
    lcd.print(padded);
}

static String difficultyToString(int difficulty) {
  // Adaptez le mapping si besoin
  switch (difficulty) {
    case 0: return "easy";
    case 1: return "medium";
    case 2: return "hard";
    default: return String(difficulty); // fallback: "0", "3", etc.
  }
}

String postGameConfig(int players, int difficulty, String url) {
  // Normalise URL
  if (!url.startsWith("http://") && !url.startsWith("https://")) url = "http://" + url;
  if (url.endsWith("/")) url.remove(url.length() - 1);
  url += "/api/games";

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println(F("WiFi non connecté"));
    return "";
  }

  // Client HTTP (HTTPS toléré en PoC)
  std::unique_ptr<WiFiClient> baseClient;
  if (url.startsWith("https://")) {
    auto *secure = new BearSSL::WiFiClientSecure();
    secure->setInsecure();              // PoC
    secure->setBufferSizes(4096, 1024);
    baseClient.reset(secure);
  } else {
    baseClient.reset(new WiFiClient());
  }

  HTTPClient http;
  http.setTimeout(8000);
  http.setReuse(false);
  http.useHTTP10(true);

  if (!http.begin(*baseClient, url)) {
    Serial.println(F("Échec http.begin()"));
    return "";
  }

  // Payload SANS status (pour éviter l'erreur d'enum)
  const String payload =
    String(F("{"
      "\"difficulty\":\"")) + difficultyToString(difficulty) + F("\","
      "\"maxPlayer\":") + String(players) + F(","
      "\"startedAt\":null,"
      "\"status\":\"pending\","
      "\"endAt\":null,"
      "\"serverVersion\":0,"
      "\"players\":[],"
      "\"events\":[]"
    "}");

  http.addHeader("Content-Type", "application/ld+json");
  http.addHeader("Connection", "close");
  http.addHeader("User-Agent", "ESP8266-POC");

  int code = http.POST(payload);
  String resp = (code > 0) ? http.getString() : String();

  Serial.print(F("URL: ")); Serial.println(url);
  Serial.print(F("HTTP code: ")); Serial.println(code);
  Serial.print(F("Réponse: ")); Serial.println(resp);
  if (code <= 0) {
    Serial.print(F("Erreur: ")); Serial.println(http.errorToString(code));
    http.end();
    return "";
  }
  if (code != HTTP_CODE_OK && code != HTTP_CODE_CREATED) {
    http.end();
    return "";
  }

  // Parse JSON pour récupérer id / @id
  // Ajuste la taille si ta réponse est grosse
  DynamicJsonDocument doc(2048);
  DeserializationError err = deserializeJson(doc, resp);
  if (err) {
    Serial.print(F("JSON parse error: ")); Serial.println(err.c_str());
    http.end();
    return "";
  }

  String id = "";
  if (doc.containsKey("id")) {
    id = doc["id"].as<String>();
  } else if (doc.containsKey("@id")) {
    // API Platform renvoie souvent "@id": "/api/games/42"
    String atId = doc["@id"].as<String>();
    // Essaie d'extraire la dernière partie comme id "42"
    int lastSlash = atId.lastIndexOf('/');
    if (lastSlash >= 0 && lastSlash < (int)atId.length() - 1) {
      id = atId.substring(lastSlash + 1);
    } else {
      id = atId; // au pire, renvoyer la valeur brute
    }
  }

  http.end();

  if (id.length() > 0) {
    POSTSend = !POSTSend;
  }
  return id; // "" si échec
}

// --- Formatte un temps restant (ms) en "MM:SS" ---
static String formatCountdown(long remainingMs) {
  if (remainingMs < 0) remainingMs = 0; // pas de négatif
  unsigned long totalSec = remainingMs / 1000UL;
  unsigned int minutes = totalSec / 60UL;
  unsigned int seconds = totalSec % 60UL;

  char buf[8];
  snprintf(buf, sizeof(buf), "%02u:%02u", minutes, seconds);
  return String(buf);
}

bool checkEndAt(const String& gameId) {
  String base = String(API_BASE);
  if (!base.startsWith("http://") && !base.startsWith("https://")) base = "http://" + base;
  if (base.endsWith("/")) base.remove(base.length() - 1);
  String url = base + "/api/games/" + gameId;

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println(F("[checkEndAt] WiFi non connecté"));
    return false;
  }

  std::unique_ptr<WiFiClient> baseClient;
  if (url.startsWith("https://")) {
    auto *secure = new BearSSL::WiFiClientSecure();
    secure->setInsecure();
    secure->setBufferSizes(4096, 1024);
    baseClient.reset(secure);
  } else {
    baseClient.reset(new WiFiClient());
  }

  HTTPClient http;
  http.setTimeout(6000);
  http.setReuse(false);
  http.useHTTP10(true);

  if (!http.begin(*baseClient, url)) {
    Serial.println(F("[checkEndAt] Échec http.begin()"));
    return false;
  }

  int code = http.GET();
  String resp = (code > 0) ? http.getString() : String();

  Serial.printf("[checkEndAt] GET %s -> %d\n", url.c_str(), code);
  if (code != HTTP_CODE_OK) { http.end(); return false; }

  DynamicJsonDocument doc(4096);
  auto err = deserializeJson(doc, resp);
  http.end();
  if (err) {
    Serial.printf("[checkEndAt] JSON error: %s\n", err.c_str());
    return false;
  }

  // true si endAt existe et n'est pas null
  return (doc.containsKey("endAt") && !doc["endAt"].isNull());
}

// --- Poll l'API jusqu'à ce que startedAt != null ---
bool pollStartedAt(const String& gameId) {
  String base = String(API_BASE);
  if (!base.startsWith("http://") && !base.startsWith("https://")) base = "http://" + base;
  if (base.endsWith("/")) base.remove(base.length() - 1);
  String url = base + "/api/games/" + gameId;

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println(F("[pollStartedAt] WiFi non connecté"));
    return false;
  }

  std::unique_ptr<WiFiClient> baseClient;
  if (url.startsWith("https://")) {
    auto *secure = new BearSSL::WiFiClientSecure();
    secure->setInsecure();
    secure->setBufferSizes(4096, 1024);
    baseClient.reset(secure);
  } else {
    baseClient.reset(new WiFiClient());
  }

  HTTPClient http;
  http.setTimeout(6000);
  http.setReuse(false);
  http.useHTTP10(true);

  if (!http.begin(*baseClient, url)) {
    Serial.println(F("[pollStartedAt] Échec http.begin()"));
    return false;
  }

  int code = http.GET();
  String resp = (code > 0) ? http.getString() : String();

  bool started = false;

  if (code == HTTP_CODE_OK) {
    DynamicJsonDocument doc(4096);
    auto err = deserializeJson(doc, resp);
    if (!err) {
      if (doc.containsKey("startedAt") && !doc["startedAt"].isNull()) {
        Serial.println(F("[pollStartedAt] startedAt détecté !"));
        started = true;
      } else {
        Serial.println(F("[pollStartedAt] en attente de départ"));
      }
    }
  }

  http.end();
  return started;
}

void errorBlink() {
  for (int i=0;i<6;i++){
    digitalWrite(D0, HIGH); delay(150);
    digitalWrite(D0, LOW);  delay(150);
  }
}

bool wasLow(uint8_t pin) {
  static uint32_t lastMs[20] = {0};
  static uint8_t lastState[20] = {HIGH};
  uint8_t state = digitalRead(pin);
  uint32_t now = millis();
  if (state != lastState[pin] && (now - lastMs[pin]) > 30) { // anti-rebond ~30ms
    lastMs[pin] = now;
    lastState[pin] = state;
    if (state == LOW) return true;
  }
  return false;
}

void setup() {
  // Initialisation des LEDs
  pinMode(LEDV, OUTPUT); // LED ROUGE
  pinMode(LEDJ, OUTPUT); // LED JAUNE
  pinMode(LEDR, OUTPUT); // LED VERTE

  pinMode(BTN1, INPUT_PULLUP);
  pinMode(BTN2, INPUT_PULLUP);
  pinMode(BTN3, INPUT_PULLUP);
  pinMode(BTN4, INPUT_PULLUP);

  for (int i=0;i<2;i++) {
    digitalWrite(LEDV, HIGH);
    digitalWrite(LEDJ, HIGH);
    digitalWrite(LEDR, HIGH);
    delay(250);
    digitalWrite(LEDV, LOW);
    digitalWrite(LEDJ, LOW);
    digitalWrite(LEDR, LOW);
    delay(250);

  }

  Serial.begin(115200);

  // Initialisation de l’écran
  Wire.begin(D2, D1); // SDA=D2, SCL=D1
  lcd.init();
  lcd.backlight();
  delay(100);

  lcdPrintLine(0, "    Cyber Escape");
  lcdPrintLine(1, "Connecting WiFi...");
  lcdPrintLine(2, "");
  lcdPrintLine(3, "");

  // ⚙Connexion Wi-Fi
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  Serial.println("Connexion au Wifi");

  digitalWrite(LEDJ, HIGH);
  int retries = 0;
  while (WiFi.status() != WL_CONNECTED && retries < 30) {
    delay(500);
    lcdPrintLine(2, "Try #" + String(retries + 1));
    retries++;
  }
  digitalWrite(LEDJ, LOW);

  Serial.println("Wifi ok");

  // Affichage résultat
  if (WiFi.status() == WL_CONNECTED) {
    lcdPrintLine(1, "WiFi Connected!");
    lcdPrintLine(2, "IP:");
    lcdPrintLine(3, WiFi.localIP().toString());

    Serial.println(WiFi.localIP().toString());

  } else {
    lcdPrintLine(1, "WiFi Failed :(");
    lcdPrintLine(2, "Check SSID/Pass");
    lcdPrintLine(3, "");
  }

  String status = "pending";
  String difficulty = "easy";

  delay(1200);

  lcdPrintLine(0, "    Cyber Escape");
  lcdPrintLine(1, "");
  lcdPrintLine(2, "    Appuyez pour");
  lcdPrintLine(3, "     commencer");

  Serial.println("Setup ok");
}

void loop() {
  Serial.println("Loop en cours");

  int player = -1;
  int difficulty = -1;

  while (standby) {
    lcdPrintLine(0, "    Cyber Escape");
    lcdPrintLine(1, "");
    lcdPrintLine(2, "    Appuyez pour");
    lcdPrintLine(3, "     commencer");
    if (wasLow(BTN1) || wasLow(BTN2) || wasLow(BTN3) || wasLow(BTN4)) {
      Serial.println("Bouton cliqué");

      standby = !standby;
    }
    delay(50);
  }

  if (!standby) {
    int difficulty_temp = 0;
    int player_temp = 1;

    while (player == -1) {
      lcdPrintLine(1, "     NB Joueurs");
      lcdPrintLine(2, "   joueur(s) : " + String(player_temp));
      lcdPrintLine(3, "BTN1=OK ; 2=- ; 3=+");

      if (wasLow(BTN2)) {
        if (player_temp > 1) {
          Serial.println("player - ok");
          player_temp--;
        } else {
          Serial.println("player - pas ok");

          digitalWrite(LEDR, HIGH);
          delay(500);
          digitalWrite(LEDR, LOW);
        }
      }
      if (wasLow(BTN3)) {
        if (player_temp < 3) {
          Serial.println("player + ok");

          player_temp++;
        } else {
          Serial.println("player + pas ok");

          digitalWrite(LEDR, HIGH);
          delay(500);
          digitalWrite(LEDR, LOW);
        }
      }
      if (wasLow(BTN1)) {
        Serial.println("player validé");

        player = player_temp;
        digitalWrite(LEDV, HIGH);
        delay(500);
        digitalWrite(LEDV, LOW);
      }
      delay(25);
    }

    while (difficulty == -1) {
      lcdPrintLine(1, "     Difficulte");
      lcdPrintLine(2, "Niveau : " + String(difficulties[difficulty_temp]));
      lcdPrintLine(3, "BTN1=OK ; 2=- ; 3=+");

      if (wasLow(BTN2)) {
        if (difficulty_temp > 0) {
          Serial.println("difficulty - ok");

          difficulty_temp--;
        } else {
          Serial.println("difficulty - pas ok");

          digitalWrite(LEDR, HIGH);
          delay(500);
          digitalWrite(LEDR, LOW);
        }
      }
      if (wasLow(BTN3)) {
        if (difficulty_temp < 2) {
          Serial.println("difficulty + ok");

          difficulty_temp++;
        } else {
          Serial.println("difficulty + pas ok");

          digitalWrite(LEDR, HIGH);
          delay(500);
          digitalWrite(LEDR, LOW);
        }
      }
      if (wasLow(BTN1)) {
        Serial.println("difficulty validé");

        difficulty = difficulty_temp;
        digitalWrite(LEDV, HIGH);
        delay(500);
        digitalWrite(LEDV, LOW);
      }

      delay(25);
    }

    while (!POSTSend) {
      lcdPrintLine(1, "Joueurs : " + String(player));
      lcdPrintLine(2, "Niveau : " + String(difficulties[difficulty]));
      lcdPrintLine(3, "  Valider sur BTN1");

      if (wasLow(BTN1)) {
        lcdPrintLine(1, "");
        lcdPrintLine(2, "Envoie de la requete");
        lcdPrintLine(3, "");

        Serial.println("Envoie de la requete");
        String newId = postGameConfig(player, difficulty, API_BASE);
        if (newId.length()) {
          Serial.print("Game créée, id = ");
          Serial.println(newId);
          gameId = newId;
        } else {
          lcdPrintLine(1, "");
          lcdPrintLine(2, "       ERROR");
          lcdPrintLine(3, "");

          Serial.println("Création échouée :(");
          errorBlink();
        }
      }
      delay(50);
    }

    while (gameId.length() >= 1) {
      lcdPrintLine(1, "");
      lcdPrintLine(2, "Id de la game : " + gameId);

      static bool hasStarted = false;
      static unsigned long startMs = 0;
      static unsigned long lastEndPoll = 0;       // pour poll endAt
      const unsigned long pollInterval = 5000UL;  // 5s
      const unsigned long totalDuration = 45UL * 60UL * 1000UL; // 5 minutes

      // PHASE 1 : on attend le départ (poll startedAt)
      if (!hasStarted) {
        bool startedNow = pollStartedAt(gameId);
        if (startedNow) {
          hasStarted = true;
          startMs = millis();
          lastEndPoll = 0; // reset pour la phase 2
          digitalWrite(LEDV, HIGH); delay(150); digitalWrite(LEDV, LOW);
        } else {
          lcdPrintLine(3, "En attente de depart");
          delay(1000);
          continue;
        }
      }

      // PHASE 2 : compte à rebours local
      long elapsed = (long)(millis() - startMs);
      long remaining = (long)totalDuration - elapsed;

      // Poll endAt toutes les 5s (sans bloquer)
      if (millis() - lastEndPoll >= pollInterval) {
        lastEndPoll = millis();
        bool endedRemotely = checkEndAt(gameId);
        if (endedRemotely) {
          // fin immédiate si l'API a marqué la fin
          remaining = 0;
        }
      }

      if (remaining <= 0) {
        // === FIN DE PARTIE ===
        lcdPrintLine(1, "");
        lcdPrintLine(2, "   Partie terminee !");
        lcdPrintLine(3, "       00:00");
        for (int i = 0; i < 6; i++) {
          digitalWrite(LEDR, HIGH); delay(300);
          digitalWrite(LEDR, LOW);  delay(300);
        }
        // reset état et retour standby
        gameId = "";
        standby = true;
        hasStarted = false;

        lcdPrintLine(0, "    Cyber Escape");
        lcdPrintLine(1, "");
        lcdPrintLine(2, "    Appuyez pour");
        lcdPrintLine(3, "     commencer");
        break; // sortie de la boucle de partie
      }

      String timer = formatCountdown(remaining);
      lcdPrintLine(3, "Temps: " + timer);

      delay(1000);
    }
  }

  delay(50);
}
