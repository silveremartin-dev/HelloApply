# HelloApply v6.0.0 (Triple-Document Generation & Dual-Memo Engine Edition) 🤖💼

Système autonome de veille, de diagnostic de debt technique, et de triple-candidature asymétrique via Gmail, Google Apps Script et Gemini 3.1 Flash Lite.

## 🚀 Fonctionnalités
- **Triple-Document Generation Engine** : Génère systématiquement trois documents hautement adaptés pour chaque offre d'emploi acceptée :
  1. Un **CV personnalisé** dynamiquement en format Markdown, servant d'index de preuves de travail exécutables.
  2. Une **Lettre de motivation traditionnelle** de style premium respectant la structure narrative "You, Me, Us" de la version 4.4.x.
  3. Un **Mémo d'architecture technique** peer-to-peer ciblant les bottlenecks de l'entreprise.
- **Suivi Centralisé sur 12 Colonnes** : Intègre automatiquement une colonne `Lien Mémo (Doc)` à la feuille de suivi `Suivi_Candidatures`. L'auto-updater migre dynamiquement et en-place les feuilles existantes sur 11 colonnes en insérant la nouvelle colonne au bon index sans briser vos données historiques.
- **Extraction de Langues Dynamique** : Extrait automatiquement les compétences linguistiques (ex: Anglais C2, Espagnol B2) depuis le master CV et les injecte proprement sous la section `## FORMATION & LANGUES` à la fin du CV.
- **Programmatic Shield (Strict JScience Ban)** : Bannit toute mention du vieux framework "JScience" dans l'intégralité des documents générés pour le remplacer dynamiquement par le successeur moderne **"Episteme"** (450 000+ lignes de code Java).
- **Intégration Réseaux & Emails Cliquables** : Formate automatiquement les profils LinkedIn (`https://www.linkedin.com/in/silvere-martin-michiellot`) et GitHub (`https://github.com/silveremartin-dev/`) dans les entêtes de tous les documents générés sous forme de liens hypertexte premium, bleus et soulignés.

## 📁 Structure des Dossiers (Google Drive)
Le script crée et utilise la structure suivante dans votre Drive :
- `Candidature Express/` (Dossier Racine)
    - `input/` : **IMPORTANT** Placez ici vos modèles :
        - `SilvereMartinMichiellot-CV-full` (Le CV complet servant de base)
        - `SilvereMartinMichiellot-CV-1pageATS-2026` (Le template CV)
        - `Lettre de motivation Silvère Martin-Michiellot 2026b` (Le template Lettre/Mémo)
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
