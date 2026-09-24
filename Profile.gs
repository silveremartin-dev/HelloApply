/**
 * HelloApply: Cloud Edition - Candidate Profile & Personal Configuration
 * VERSION: 6.4.0 (Decoupled Profile Architecture)
 * LAST UPDATED: 24/09/2026 15:15
 * 
 * This file centralizes ALL candidate personal information, profile identity,
 * regional filtering rules, prompt tone references, and technical portfolio notes.
 * 
 * Modify this file to adapt HelloApply to your own identity without changing the core engine.
 */

// --- 1. CANDIDATE PROFILE IDENTITY ---
const CANDIDATE_PROFILE = {
  fullName: "Silvère Martin-Michiellot",
  firstName: "Silvère",
  safeName: "SilvereMartinMichiellot", // Used in generated file names (alphanumeric, no spaces)
  location: "Lorient, France",
  city: "Lorient",
  department: "56", // Morbihan
  phone: "07 67 81 52 02",
  phoneInt: "+33 7 67 81 52 02",
  email: "silvere.martin@gmail.com",
  linkedinUrl: "https://www.linkedin.com/in/silvere-martin-michiellot",
  linkedinRaw: "linkedin.com/in/silvere-martin-michiellot/", // Short version for CV formatting
  githubUrl: "https://github.com/silveremartin-dev/",
  githubRaw: "github.com/silveremartin-dev", // Short version for CV formatting
  
  // Technical Note Configuration (set to true to append the Note de réalisation technique, false for standard CV only)
  includeTechnicalNote: true,
  
  // Google Drive Reference Files (inside input/ folder)
  masterCvName: "mastercv.md",
  templateCvName: "SilvereMartinMichiellot-CV-1pageATS-2026",
  templateLetterName: "Lettre de motivation Silvère Martin-Michiellot 2026b"
};

// --- 2. USER PREFERENCES & GEOGRAPHIC MOBILITY ---
const PREFERENCES = {
  location: CANDIDATE_PROFILE.location,
  city: CANDIDATE_PROFILE.city,
  radiusLocal: 20, 
  radiusRegional: 50,
  allowFullRemote: true,
  preferredRegions: ["Europe", "World"],
  minSalaryAnnual: 50000 // Minimum annual salary in EUR (filters out positions below this threshold)
};

// --- 3. REGIONAL GEOGRAPHIC FILTER ---
/**
 * Checks if a city/location is within the candidate's local target area (Morbihan / 56).
 */
function isCandidateLocalArea(location) {
  if (!location || location === "?") return false;
  const loc = location.toLowerCase();
  if (loc.includes('56') || loc.includes('morbihan')) return true;
  
  const localCities = [
    'lorient', 'vannes', 'lanester', 'ploemeur', 'hennebont', 'pontivy', 'auray', 'guidel', 
    'saint-ave', 'saint-avé', 'ploermel', 'ploërmel', 'sene', 'séné', 'sarzeau', 'larmor-plage', 
    'queven', 'quéven', 'languidic', 'theix', 'ploeren', 'ploëren', 'brech', 'bréch', 'muzillac', 
    'kervignac', 'elven', 'carnac', 'baud', 'locmine', 'locminé', 'pluvigner', 'plouay', 
    'grand-champ', 'questembert', 'caudan', 'nivillac', 'guer', 'ploemel', 'ploëmel', 
    'aradon', 'arradon', 'plouhinec', 'quiberon', 'port-louis', 'riantec', 'belz', 'nino'
  ];
  
  return localCities.some(city => loc.includes(city));
}

// Backward-compatible alias for core engine
function isMorbihan(location) {
  return isCandidateLocalArea(location);
}

// --- 4. PROMPT TONE REFERENCE (GOLD STANDARD CV TEMPLATE) ---
const TONE_REFERENCE_CV_EXAMPLE = `"${CANDIDATE_PROFILE.fullName.toUpperCase()} ${CANDIDATE_PROFILE.location} (Remote) | ${CANDIDATE_PROFILE.phone} | ${CANDIDATE_PROFILE.email} 
LinkedIn: ${CANDIDATE_PROFILE.linkedinRaw} | GitHub: ${CANDIDATE_PROFILE.githubRaw}
ARCHITECTE SENIOR IA AGENTIQUE & SYSTÈMES DISTRIBUÉS (ICOE)
Architecte et Principal Engineer avec plus de 30 ans d'expertise dans le pilotage et la refonte de systèmes d'information complexes. Pionnier de l'ingénierie logicielle augmentée par IA (Expert Google Antigravity), alliant un double cursus scientifique en neurosciences et intelligence artificielle à une capacité d'exécution hors norme : division par 5 des cycles de livraison et automatisation de 80% du cycle de vie des applications (tests, documentation). Expert de la modernisation de legacy critique et de la conception d'architectures distribuées multi-cloud hautes performances.
COMPÉTENCES CLÉS
Architectures IA & Frameworks Agentiques : Orchestration multi-agents, frameworks autonomes et semi-autonomes (Google Antigravity, architectures de type LangChain/AutoGen), LLMs, Prompt Engineering, patterns RAG, et bases de données vectorielles.
Ingénierie Logicielle & Systèmes Distribués : Expertise Java (J2SE 1.0 à 25+), Python, C#, Micro-services, architectures orientées événements, API REST/MCP, calcul scientifique distribué haute performance.
Modernisation de Legacy & Delivery Lifecycle : Audit et refactoring de codes patrimoniaux critiques, automatisation end-to-end des phases d'analyse, build, test (TDD), documentation et déploiement via agents IA.
Environnements Cloud & MLOps/DevOps : Maîtrise multi-cloud (GCP, AWS, architectures hybrides), conteneurisation (Docker, Kubernetes), CI/CD, observabilité, et gouvernance/sécurité des données (RGPD, chiffrement).
Leadership Technique & Advisory : Direction d'équipes d'ingénierie (jusqu'à 8 développeurs en environnement Agile/Scrum), relation client stratégique (AMOA), vulgarisation de concepts IA complexes auprès d'audiences techniques et exécutives. EXPÉRIENCES PROFESSIONNELLES
Lead Architecte & Développeur Open Source | Mécénat GitHub | Lorient (Remote) | 07/2025 – Présent
Création de la bibliothèque de calcul scientifique Episteme (+400 000 lignes de code) avec des performances 10x supérieures aux standards Apache.
Développement d'un client-serveur distribué pour la résolution d'Eternity II et d'une simulation 3D d'insectes sociaux.
Automatisation de 80% des tests unitaires et de la documentation via l'outil Antigravity.
Spécialiste Support Informatique Senior | Techteam (Fives Syleps) | Lorient | 06/2024 – 07/2025
Résolution d'incidents critiques 24/7 (Niveaux 1, 2, 3) sur plateformes logistiques robotisées (WMS/WCS).
Réorganisation de l'accès VPN et de la gestion des machines virtuelles, réduisant le temps de connexion de l'équipe de 35%.
Responsable IT / Chef de Projet AMOA | Equitive (Groupe Deloitte) | Lorient | 10/2012 – 11/2023
Accompagnement technique stratégique ayant généré une hausse de 400% du chiffre d'affaires client en 7 ans.
Déploiement de solutions de dématérialisation (facturation, paie) pour le Ministère de la Culture.
Coordination de 8 développeurs en environnements Agiles et DevOps.
Migration d'infrastructure vers une architecture hybride de plus de 80 machines virtuelles sécurisées.
FORMATION & LANGUES
Certificat de Neurosciences Cognitives & DESS Psychologie Expérimentale : Université de Genève (1998).
DEA Sciences Cognitives (Intelligence Artificielle) : INPG Grenoble (1994).
Maîtrise d'Informatique : Université Joseph Fourier, Grenoble (1993).
Langues : Anglais C2 (TOEFL 267/300), Espagnol B2, Italien B1.
ENVIRONNEMENT TECHNIQUE
Langages : Java (Expert), Python, C#, Javascript, SQL, C++, LISP, PHP, Powershell.
Outils IA : Google Antigravity, TensorFlow, Keras, Gemini 3, ChatGPT, HuggingFace, N8N
Frameworks & Data : SpringBoot, Hibernate, Spark, Kafka, Tornado VM, Three.js, Redis, Oracle, PostgreSQL.
Méthodes : Agile (Scrum/Lean), TDD, Design Patterns, UML."`;

// --- 5. NOTE DE RÉALISATION TECHNIQUE (FR / EN) ---
const TECHNICAL_NOTE_FR = `# ${CANDIDATE_PROFILE.fullName.toUpperCase()}
${CANDIDATE_PROFILE.location} | ${CANDIDATE_PROFILE.phoneInt || CANDIDATE_PROFILE.phone} | ${CANDIDATE_PROFILE.email}
LinkedIn ${CANDIDATE_PROFILE.linkedinUrl}
GitHub ${CANDIDATE_PROFILE.githubUrl}

## NOTE DE RÉALISATION TECHNIQUE : SYSTÈMES COMPLEXES & INGENIÉRIE IA MASSIVE
À l'attention des Recruteurs et Directeurs Techniques
Candidat : ${CANDIDATE_PROFILE.fullName} – Architecte Logiciel Senior & Lead IA
Expertise clé : Industrialisation de pipelines LLM, Calcul Haute Performance (HPC), Architectures scalables et auto-correctives.

### 1. OPENPRIMER : Orchestration de Savoir Autonome & IA Générative (2026)
Conception et déploiement d'une plateforme d'université en ligne générant de manière autonome des cursus universitaires interactifs de niveau académique.

Défis Techniques & Architecture
- Orchestration Multi-Agents : Développement d'un orchestrateur autonome s'appuyant sur l'API Gemini 2.5 pour la génération massive et structurée de milliers de pages de cours universitaires.
- Modélisation Multidimensionnelle : Structuration des données selon une taxonomie stricte de 10 niveaux académiques couvrant 42 disciplines scientifiques et humanités.
- Maturité Multilingue : Pipeline de génération et de localisation dynamique en 5 langues cibles : Anglais (EN), Français (FR), Espagnol (ES), Allemand (DE), et Chinois (ZH).
- Sécurité & Résilience Cloud Native :
  - Isolation stricte des données via des politiques Row-Level Security (RLS) avancées sur Supabase.
  - Implémentation d'un mécanisme de cache auto-correctif réduisant la latence et garantissant l'intégrité des données face aux dérives de génération (hallucinations).

Stack Technique & LLMOps
- Frontend/Backend : Next.js 15 (App Router, Server Components), Vercel (Déploiement Haute Disponibilité).
- BaaS / Database : Supabase (PostgreSQL, RLS, Realtime).
- Moteur d'Inférence : Gemini 2.5 (Google AI Studio / Vertex AI).
- Optimisation des Coûts : Conception de pipelines de traitement sous forme de graphes orientés acycliques (DAG) pour optimiser les appels d'API et réduire drastiquement les coûts d'inférence (LLMOps).

Preuves Techniques & Liens
- Plateforme de Production : https://openprimer.app/ code OP-BETA-2026
- Dépôt Github principal : https://github.com/Open-Primer/

---pagebreak---

### 2. EPISTEME : Calcul Scientifique Haute Performance (HPC) & Industrialisation IA (2025-2026)
Développement d'une bibliothèque souveraine de calcul scientifique distribué et de simulation multi-agents de masse (450 000+ lignes de code).

Innovations & Paradigmes d'Ingénierie
- Vibe Coding & Ingénierie Augmentée : Utilisation avancée de la plateforme d'orchestration multi-agents Google Antigravity pour la génération massive de code critique.
- Cycle de Livraison Optimisé : Automatisation par IA de 80% des tests unitaires et de la documentation technique, entraînant une division par 5 du cycle de release.
- Performances Brutes : Traitements distribués affichant des benchmarks 10x supérieurs aux bibliothèques standards de la Fondation Apache.
- Simulation de Masse : Architecture client-serveur hautement optimisée pour l'exécution de simulations multi-agents complexes et massives (systèmes physiques, sociaux et biologiques).

Stack Technique
- Langage & Runtime : Java (Projet Panama pour l'accès mémoire hors-heap, liaison CUDA).
- Calcul : Architecture massivement distribuée, optimisation des entrées/sorties et de la topologie réseau.

Preuves Techniques & Liens
- Dépôt GitHub Principal : https://github.com/Episteme-HPC/Episteme
- Espace de Démonstration (Hugging Face) : https://huggingface.co/spaces/silveremartin/Episteme
- Données de Benchmark Officielles : https://github.com/Episteme-HPC/Episteme/tree/main/docs/benchmark-results
- Annonce et Synthèse Industrielle (LinkedIn) : [Lien vers la publication LinkedIn](${CANDIDATE_PROFILE.linkedinUrl})

### 3. COMPÉTENCES TRANSVERSALES APPLICABLES À VOTRE ORGANISATION
1. Direction Technique & Vision IA : Capacité à piloter un portefeuille de projets d'IA massive (de la simulation à la plateforme d'apprentissage distribuée).
2. Maîtrise Cloud & Infrastructure : Déploiement d'architectures scalables, résilientes, à haute disponibilité, centrées sur la maîtrise des coûts opérationnels (FinOps/LLMOps).
3. Souveraineté et Qualité Logicielle : Rigueur méthodologique mathématique appliquée au code (tests automatisés, isolation des données, patterns correctifs).`;

const TECHNICAL_NOTE_EN = `# ${CANDIDATE_PROFILE.fullName.toUpperCase()}
${CANDIDATE_PROFILE.location} | ${CANDIDATE_PROFILE.phoneInt || CANDIDATE_PROFILE.phone} | ${CANDIDATE_PROFILE.email}
LinkedIn ${CANDIDATE_PROFILE.linkedinUrl}
GitHub ${CANDIDATE_PROFILE.githubUrl}

## TECHNICAL BACKGROUND BRIEF: COMPLEX SYSTEMS & LARGE-SCALE AI ENGINEERING
For the attention of Recruiters and Technical Directors
Candidate: ${CANDIDATE_PROFILE.fullName} – Senior Software Architect & AI Lead
Core Expertise: LLM Production Pipeline Industrialization, High-Performance Computing (HPC), Scalable & Self-Healing Architectures.

### 1. OPENPRIMER: Autonomous Knowledge Orchestration & Generative AI (2026)
Design and deployment of an online university platform that autonomously generates interactive, academic-grade university curricula.

Technical Challenges & Architecture
- Multi-Agent Orchestration: Development of an autonomous orchestrator leveraging the Gemini 2.5 API for the massive, structured generation of thousands of academic course pages.
- Multidimensional Modeling: Data structuring based on a strict 10-level academic taxonomy spanning 42 scientific disciplines and humanities.
- Multilingual Maturity: Dynamic generation and localization pipeline serving 5 target languages: English (EN), French (FR), Spanish (ES), German (DE), and Chinese (ZH).
- Cloud-Native Security & Resilience:
  - Strict data isolation enforced via advanced Row-Level Security (RLS) policies on Supabase.
  - Implementation of a self-healing cache mechanism to reduce latency and guarantee data integrity against generation drift (hallucinations).

Technical Stack & LLMOps
- Frontend/Backend: Next.js 15 (App Router, Server Components), Vercel (High-Availability Deployment).
- BaaS / Database: Supabase (PostgreSQL, RLS, Realtime).
- Inference Engine: Gemini 2.5 (Google AI Studio / Vertex AI).
- Cost Optimization: Engineering of processing pipelines structured as Directed Acyclic Graphs (DAG) to optimize API calls and drastically reduce inference overhead (LLMOps).

Technical Proofs & Links
- Production Platform: https://openprimer.app/ code OP-BETA-2026
- Primary GitHub Repository: https://github.com/Open-Primer/

---pagebreak---

### 2. EPISTEME: High-Performance Scientific Computing (HPC) & AI Industrialization (2025-2026)
Development of a sovereign distributed scientific computing and massive multi-agent simulation library (450,000+ lines of code).

Innovations & Engineering Paradigms
- Vibe Coding & Augmented Engineering: Advanced utilization of the Google Antigravity multi-agent orchestration platform for the mass production of critical code.
- Optimized Release Cycle: AI-driven automation of 80% of unit tests and technical documentation, resulting in a 5x reduction in the release cycle.
- Raw Performance: Distributed processing benchmarks delivering throughput 10x higher than standard Apache Foundation libraries.
- Massive Simulation: Highly optimized client-server architecture built to execute complex, large-scale multi-agent simulations (physical, social, and biological systems).

Technical Stack
- Language & Runtime: Java (Project Panama for off-heap memory access, CUDA binding).
- Computing: Massively distributed architecture, rigorous I/O and network topology optimization.

Technical Proofs & Links
- Primary GitHub Repository: https://github.com/Episteme-HPC/Episteme
- Showcase Space (Hugging Face): https://huggingface.co/spaces/silveremartin/Episteme
- Official Benchmark Data: https://github.com/Episteme-HPC/Episteme/tree/main/docs/benchmark-results
- Industry Announcement & Synthesis (LinkedIn): [Link to LinkedIn Publication](${CANDIDATE_PROFILE.linkedinUrl})

### 3. CROSS-FUNCTIONAL EXPERTISE DELIVERABLE TO YOUR ORGANIZATION
1. Technical Direction & AI Vision: Proven ability to steer a portfolio of massive AI initiatives (ranging from complex simulations to distributed learning platforms).
2. Cloud & Infrastructure Mastery: Deployment of scalable, resilient, high-availability architectures with a strong focus on operational cost management (FinOps/LLMOps).
3. Sovereignty & Software Quality: Mathematical methodological rigor applied to codebase engineering (automated testing, strict data isolation, self-correcting design patterns).`;

/**
 * Returns the appropriate Technical Realization Note based on the language.
 */
function getTechnicalNote(language) {
  if (language && language.toLowerCase().startsWith('en')) {
    return TECHNICAL_NOTE_EN;
  }
  return TECHNICAL_NOTE_FR;
}
