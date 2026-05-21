# HelloApply v6.0.0 (Triple-Document Generation & Dual-Memo Engine Edition) 🤖💼

Système autonome de veille, de diagnostic de dette technique, et de triple-candidature asymétrique via Gmail, Google Apps Script et Gemini 3.1 Flash.

---

## 🚀 Fonctionnalités Clés
- **Triple-Document Generation Engine** : Génère systématiquement trois documents hautement adaptés pour chaque offre d'emploi acceptée :
  1. Un **CV personnalisé** dynamiquement en format Markdown, servant d'index de preuves de travail exécutables.
  2. Une **Lettre de motivation traditionnelle** de style premium respectant la structure narrative "You, Me, Us".
  3. Un **Mémo d'architecture technique** peer-to-peer ciblant les bottlenecks de l'entreprise.
- **Suivi Centralisé sur 12 Colonnes** : Intègre automatiquement une colonne `Lien Mémo (Doc)` à la feuille de suivi `Suivi_Candidatures`. L'auto-updater migre dynamiquement et en-place les feuilles existantes sur 11 colonnes.
- **Extraction de Langues Dynamique** : Extrait automatiquement les compétences linguistiques (ex: Anglais C2, Espagnol B2) depuis le master CV et les injecte proprement sous la section `## FORMATION & LANGUES` à la fin du CV.
- **Programmatic Shield (Strict JScience Ban)** : Bannit toute mention du vieux framework "JScience" dans l'intégralité des documents générés pour le remplacer dynamiquement par le successeur moderne **"Episteme"** (450 000+ lignes de code Java).
- **Intégration Réseaux & Emails Cliquables** : Formate automatiquement les profils LinkedIn (`https://www.linkedin.com/in/silvere-martin-michiellot`) et GitHub (`https://github.com/silveremartin-dev/`) dans les entêtes sous forme de liens hypertexte premium cliquables.
- **ATS Friendly Rendering Engine** : Moteur de rendu optimisé pour maximiser le taux d'acceptation par les robots de recrutement ATS (mise en page mono-colonne stricte, marges calculées, pas de tableaux invisibles, polices et couleurs calibrées).

---

## 🔄 Chaîne Opératoire (Workflow Interne)

La chaîne de traitement automatisée suit un parcours précis pour chaque exécution :

1. **Scan des Alertes** : Recherche ciblée de nouveaux e-mails de job alerts LinkedIn et HelloWork dans votre boîte Gmail.
2. **Résolution & Déduplication** : Résolution sécurisée des liens de redirection cryptés HelloWork (gestion des tracking links et cookie walls) et extraction d'un identifiant de poste unique pour éviter tout doublon de candidature.
3. **Capture et Nettoyage** : Récupération du descriptif complet du poste (limite étendue à **40 000 caractères** pour éviter toute troncature par le cookie wall de HelloWork) et décontamination du DOM (retrait des scripts, styles et balises).
4. **Décision & Scoring LLM** : Évaluation immédiate de la pertinence de l'offre par Gemini 3.1 Flash. Coupe-circuit automatique si la localisation physique du poste sort du rayon défini sans être en "Full Remote".
5. **Génération & Rendu** : Personnalisation automatique des 3 documents en format Google Docs (avec notre moteur de rendu Markdown customisé, gestion fine des marges, tailles de polices dynamiques pour remplir au mieux les pages sans laisser de blanc), conversion instantanée en PDF.
6. **Mise à disposition** : Création automatique d'un brouillon d'e-mail prêt à l'envoi dans votre boîte Gmail contenant la description de l'offre, la note de pertinence, et les 3 pièces jointes associées, parallèlement à la journalisation dans votre Google Sheet de suivi.

> 💡 *Pour une analyse approfondie des composants et des diagrammes de séquence du workflow, consultez notre **[Document d'Architecture Technique complet](architecture.md)**.*

---

## 📁 Structure des Dossiers (Google Drive)

Le script crée et utilise la structure suivante dans votre Drive :
- `Candidature Express/` (Dossier Racine)
  - `input/` : **IMPORTANT** Placez-y vos modèles et bases de travail :
    - `SilvereMartinMichiellot-CV-full` (Le CV complet servant de base de compétences)
    - `SilvereMartinMichiellot-CV-1pageATS-2026` (Le template CV vierge)
    - `Lettre de motivation Silvère Martin-Michiellot 2026b` (Le template de lettre/mémo)
  - `output/` : Contient les PDF personnalisés générés, le Google Sheet de suivi et les versions de travail modifiables.

---

## ⚙️ Installation & Configuration Rapide

1. **Cloner le Projet** sur votre machine de développement.
2. **Configurer clasp** pour vous connecter à votre compte Google Apps Script.
3. **Créer les Secrets** : Ajoutez un fichier local `Secrets.gs` (automatiquement ignoré par Git) contenant votre clé Gemini :
   ```javascript
   const GEMINI_API_KEY = 'VOTRE_CLE_API_GEMINI';
   ```
4. **Déployer le code** :
   ```bash
   clasp push
   ```
5. **Activer l'automatisation** : Dans l'éditeur d'Apps Script en ligne, exécutez la fonction `setupTriggers()` une fois pour programmer le passage automatique régulier.

---

## 🔒 Sécurité & Confidentialité
- Les fichiers sensibles (`Secrets.gs`, `diagnostic.js` et `payload.json`) sont exclus du dépôt public via le fichier `.gitignore`.
- Le script n'archive pas et ne marque pas vos messages comme "lus". Vous gardez le contrôle total sur votre boîte de réception.
