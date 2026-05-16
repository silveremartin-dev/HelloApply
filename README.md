# HelloApply v3.9.0 (2026 Edition) 🤖💼

Système autonome de veille et de personnalisation de candidatures via Gmail, Google Apps Script et Gemini 3.1 Flash Lite.

## 🚀 Fonctionnalités
- **Scan Intelligent** : Analyse les mails LinkedIn et HelloWork reçus depuis le dernier passage (8h, 14h, 18h).
- **IA Critique** : Scoring sévère basé sur vos préférences géographiques (Lorient/Remote) et vos compétences.
- **Génération PDF** : Création automatique de CV et Lettres de motivation ATS-optimized au format PDF.
- **Suivi Centralisé** : Logging de toutes les offres (retenues ou rejetées) dans un Google Sheet avec raisonnement de l'IA.
- **Brouillons Gmail** : Préparation de brouillons complets avec descriptif du poste, analyse IA et pièces jointes.

## 📁 Structure des Dossiers (Google Drive)
Le script crée et utilise la structure suivante dans votre Drive :
- `Candidature Express/` (Dossier Racine)
    - `input/` : **IMPORTANT** Placez ici vos modèles :
        - `SilvereMartinMichiellot-CV-full` (Le CV complet servant de base)
        - `SilvereMartinMichiellot-CV-1pageATS-2026` (Le template CV)
        - `Lettre de motivation Silvère Martin-Michiellot 2026b` (Le template Lettre)
    - `output/` : Contient les PDF générés, le Google Sheet de suivi et les versions éditables.

## ⚙️ Installation
1. Clonez le projet.
2. Assurez-vous d'avoir `clasp` installé et configuré.
3. Créez un fichier `Secrets.gs` (ignoré par Git) avec votre clé : `const GEMINI_API_KEY = 'VOTRE_CLE';`.
4. Lancez `clasp push`.
5. Dans l'éditeur Apps Script, lancez une fois la fonction `setupTriggers()` pour activer les passages automatiques.

## 🔒 Sécurité
- Les fichiers `Secrets.gs`, `diagnostic.js` et `payload.json` sont exclus du dépôt via `.gitignore`.
- Le script ne marque plus vos mails comme "lus", vous gardez le contrôle total sur votre boîte de réception.
