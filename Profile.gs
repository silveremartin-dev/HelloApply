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
  
  // Technical Note Configuration
  includeTechnicalNote: true, // true to generate the Technical Realization Note, false to disable
  technicalNoteMode: "appended", // Generation mode: "appended" (joined to CV), "standalone" (separate PDF/Doc), or "both"
  
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

// --- 5. CATALOGUE MAÎTRE DES PROJETS TECHNIQUES (PORTFOLIO MAÎTRE) ---
const MASTER_TECHNICAL_PROJECTS = {
  openprimer: {
    key: "openprimer",
    tags: ["GenAI", "LLMOps", "Fullstack", "Next.js", "Supabase", "Cloud-Native", "EdTech", "Multi-Agents"],
    titleFr: "OPENPRIMER : Orchestration de Savoir Autonome & IA Générative (2026)",
    titleEn: "OPENPRIMER: Autonomous Knowledge Orchestration & Generative AI (2026)",
    summaryFr: "Conception et déploiement d'une plateforme d'université en ligne générant de manière autonome des cursus universitaires interactifs de niveau académique.",
    summaryEn: "Design and deployment of an online university platform autonomously generating academic-grade interactive university curricula.",
    detailsFr: `- **Défis Techniques & Architecture** : Orchestrateur autonome multi-agents (Gemini 2.5 API), modélisation sur taxonomie académique de 10 niveaux (42 disciplines), pipeline de génération multilingue dynamique (EN, FR, ES, DE, ZH).
- **Sécurité & Résilience Cloud-Native** : Isolation stricte des données via Row-Level Security (RLS) sur Supabase, cache auto-correctif anti-hallucination réduisant la latence et garantissant l'intégrité des contenus.
- **Stack Technique & LLMOps** : Next.js 15 (App Router, Server Components), Vercel (HA), Supabase (PostgreSQL, Realtime), Gemini 2.5, optimisation DAG des coûts d'inférence.
- **Preuves & Liens** : Plateforme en production : https://openprimer.app/ (code OP-BETA-2026) | Dépôt GitHub : https://github.com/Open-Primer/`,
    detailsEn: `- **Technical Challenges & Architecture**: Autonomous multi-agent orchestrator leveraging Gemini 2.5 API for mass generation, 10-level academic taxonomy (42 disciplines), dynamic multilingual pipeline (EN, FR, ES, DE, ZH).
- **Cloud-Native Security & Resilience**: Strict data isolation via Row-Level Security (RLS) on Supabase, self-healing cache mechanism reducing latency and preventing hallucination drift.
- **Technical Stack & LLMOps**: Next.js 15 (App Router, Server Components), Vercel (High-Availability), Supabase (PostgreSQL, Realtime), Gemini 2.5, DAG-based pipeline inference cost optimization.
- **Technical Proofs & Links**: Production Platform: https://openprimer.app/ (code OP-BETA-2026) | Primary GitHub Repository: https://github.com/Open-Primer/`
  },

  episteme: {
    key: "episteme",
    tags: ["HPC", "Calcul Scientifique", "Java 25", "Project Panama", "CUDA", "GPU", "Antigravity", "Performance"],
    titleFr: "EPISTEME : Calcul Scientifique Haute Performance (HPC) & Industrialisation IA (2025-2026)",
    titleEn: "EPISTEME: High-Performance Scientific Computing (HPC) & AI Industrialization (2025-2026)",
    summaryFr: "Développement d'une bibliothèque souveraine de calcul scientifique distribué et de simulation multi-agents de masse (450 000+ lignes de code Java).",
    summaryEn: "Development of a sovereign distributed scientific computing and massive multi-agent simulation library (450,000+ lines of Java code).",
    detailsFr: `- **Innovations & Paradigmes** : Vibe Coding & Ingénierie augmentée via Google Antigravity, automatisation de 80% des tests et de la documentation (cycle de release divisé par 5), benchmarks 10x supérieurs aux standards Apache.
- **Simulation de Masse & HPC** : Architecture client-serveur ultra-performante pour simulations multi-agents complexes, Java 25 (Project Panama pour accès mémoire hors-heap, binding CUDA), optimisation réseau et E/S.
- **Preuves & Liens** : Dépôt GitHub : https://github.com/Episteme-HPC/Episteme | Démo Hugging Face : https://huggingface.co/spaces/silveremartin/Episteme | Benchmarks : https://github.com/Episteme-HPC/Episteme/tree/main/docs/benchmark-results | Publication LinkedIn : ${CANDIDATE_PROFILE.linkedinUrl}`,
    detailsEn: `- **Innovations & Engineering Paradigms**: Vibe Coding & Augmented Engineering via Google Antigravity, AI-driven automation of 80% of unit tests and documentation (5x release acceleration), benchmarks 10x higher than Apache Foundation libraries.
- **Massive Simulation & HPC Stack**: Client-server architecture built for complex multi-agent simulations, Java 25 (Project Panama for off-heap memory, CUDA binding), I/O and network topology optimization.
- **Technical Proofs & Links**: Primary GitHub Repository: https://github.com/Episteme-HPC/Episteme | Showcase Space (Hugging Face): https://huggingface.co/spaces/silveremartin/Episteme | Official Benchmark Data: https://github.com/Episteme-HPC/Episteme/tree/main/docs/benchmark-results | LinkedIn Publication: ${CANDIDATE_PROFILE.linkedinUrl}`
  },

  ether: {
    key: "ether",
    tags: ["Cliodynamique", "Systèmes Distribués", "Java 21", "Virtual Threads", "Rust FFI", "SIMD", "Uber H3", "PostGIS", "Biophysique"],
    titleFr: "ETHER : Moteur de Simulation Cliodynamique & Macro-Historique Distribué (2025-2026)",
    titleEn: "ETHER: Distributed Cliodynamics & Macro-Historical Simulation Engine (2025-2026)",
    summaryFr: "Moteur distribué de simulation cliodynamique à l'échelle planétaire couplant lois biophysiques, dynamiques sociologiques et passage à l'échelle spatial.",
    summaryEn: "Distributed planetary-scale cliodynamics simulation engine coupling biophysical laws, sociological dynamics, and spatial domain scaling.",
    detailsFr: `- **Architecture distribuée & passage à l'échelle** : Architecture client-serveur et calcul en cluster multi-nœuds (décomposition spatiale de domaine, barrière de synchronisation déterministe ClusterClockBarrier, PostGIS/Docker) simulant des millions de cellules hexagonales Uber H3.
- **Calcul intensif & modélisation biophysique** : Moteur hybride haute performance (Java 21 Virtual Threads / Vector API SIMD, binding natif Rust zero-cost) couplant lois physiques strictes (thermodynamique hors-équilibre, EROEI, cycles biogéochimiques N-P-K) et dynamiques sociologiques/démographiques non-linéaires.
- **Studio d'orchestration & télémétrie** : Interface client modulaire en JavaFX (7 panneaux analytiques, injection d'événements temps réel "Archon", export sécurisé AES-256) avec benchmarking empirique automatisé contre les bases historiques (Seshat Global History Databank, Maddison Project, HYDE).
- **Preuves & Liens** : Dépôt GitHub : https://github.com/silveremartin-dev/`,
    detailsEn: `- **Distributed Architecture & Large-Scale Domain Partitioning**: Distributed client-server architecture and multi-node cluster computing (spatial domain decomposition, deterministic ClusterClockBarrier synchronization barrier, PostGIS, Docker) simulating millions of hexagonal cells indexed via Uber H3 spatial indexing.
- **Intensive Computing & Biophysical Modeling**: High-performance hybrid simulation engine (Java 21 Virtual Threads / Project Loom, Vector API SIMD, zero-cost native Rust FFI binding) coupling strict physical laws (non-equilibrium thermodynamics, EROEI energy return on investment, soil N-P-K biogeochemical cycles) with non-linear demographic and societal dynamics.
- **Orchestration Studio & Advanced Telemetry**: Modular JavaFX desktop client suite (7 real-time analytics panels, "Archon" runtime historical event/bifurcation injection engine, AES-256 encrypted dataset export) backed by automated empirical validation benchmarks against international historical datasets (Seshat Global History Databank, Maddison Project, HYDE).
- **Technical Proofs & Links**: GitHub Repositories: https://github.com/silveremartin-dev/`
  },

  swarmforge: {
    key: "swarmforge",
    tags: ["Multi-Agents", "Systèmes Complexes", "Kubernetes", "gRPC", "FlatBuffers", "Redis", "jMonkeyEngine", "3D", "React"],
    titleFr: "SWARMFORGE : Plateforme Distribuée de Simulation Multi-Agents Massive & Écosystèmes 3D (2025-2026)",
    titleEn: "SWARMFORGE: Distributed Massive Multi-Agent Simulation Platform & 3D Ecosystems (2025-2026)",
    summaryFr: "Moteur distribué de simulation multi-agents à très grande échelle (10⁵+ agents) modélisant des colonies eusociales et des réseaux trophiques complexes.",
    summaryEn: "Large-scale distributed multi-agent simulation engine (10⁵+ agents) modeling eusocial colonies and complex trophic food webs.",
    detailsFr: `- **Simulation massive (10⁵+ agents) & écologie poussée** : Moteur de simulation multi-agents à très grande échelle modélisant des colonies eusociales et des réseaux trophiques complets (fourmis, abeilles, prédateurs à styles de chasse avancés, proies, pathogènes R₀) via des architectures décisionnelles riches (agents BDI, réseaux de neurones, logique floue).
- **Architecture distribuée, multijoueur & Cloud** : Écosystème client-serveur distribué (nœuds de calcul swarmforge-compute, gRPC/Protobuf/FlatBuffers, cluster Kubernetes/Helm, broker Redis, persistance PostgreSQL) supportant le calcul distribué en cluster, des méga-terrariums multi-nœuds synchronisés et des sessions multijoueurs (PvP et coopératif).
- **Physique environnementale & interfaces immersives** : Simulation physique des galeries souterraines (thermodynamique par effet cheminée, diffusion de phéromones), visualiseur 3D temps réel (jMonkeyEngine), suite d'éditeurs visuels de règles et client web d'observabilité (React / Vite).
- **Preuves & Liens** : Dépôt GitHub : https://github.com/silveremartin-dev/`,
    detailsEn: `- **Massive Simulation (10⁵+ Agents) & Advanced Ecological Modeling**: Large-scale multi-agent simulation engine modeling eusocial colonies and comprehensive trophic networks (ants, bees, multi-strategy apex predators, prey, epidemiological pathogen propagation R₀) driven by rich cognitive decision architectures (BDI agents, neural networks, fuzzy logic).
- **Distributed Architecture, Multiplayer & Cloud Infrastructure**: Distributed client-server ecosystem (swarmforge-compute compute nodes, ultra-fast serialization via gRPC/Protobuf/FlatBuffers, Kubernetes/Helm cluster orchestration, Redis, PostgreSQL) supporting multi-node cluster computing, multi-node mega-terrariums, and real-time multiplayer sessions (competitive PvP and cooperative modes).
- **Environmental Physics & Immersive UIs**: Advanced subsurface physical modeling (draft / chimney-effect thermodynamics, active pheromone field diffusion), real-time 3D visualization engine (jMonkeyEngine), comprehensive visual rule editor suite, and modern observability web client (React / Vite).
- **Technical Proofs & Links**: GitHub Repositories: https://github.com/silveremartin-dev/`
  },

  eternity: {
    key: "eternity",
    tags: ["Optimisation Combinatoire", "Java 25", "TornadoVM", "GPU", "OpenCL", "MCTS", "FlatBuffers", "gRPC", "Redis"],
    titleFr: "ETERNITY II : Moteur Combinatoire Distribué Massif & Accélération GPU (2025-2026)",
    titleEn: "ETERNITY II: Massive Distributed Combinatorial Solver & GPU Acceleration (2025-2026)",
    summaryFr: "Moteur distribué haute performance résolvant le casse-tête NP-complet Eternity II (10⁶⁰⁰ états) via compilation noyau GPU et recherche arborescente MCTS.",
    summaryEn: "High-performance distributed engine solving the NP-complete Eternity II puzzle (10⁶⁰⁰ states) through dynamic GPU kernel compilation and MCTS.",
    detailsFr: `- **Moteur primitif ultra-bas niveau & Zero-Heap** : Représentation scalaire compacte 64 bits (PiecePrimitive & BoardPrimitive) avec rotations et tests d'adjacence en O(1) sans aucune allocation mémoire dans la boucle de recherche critique.
- **Accélération matérielle GPU (TornadoVM)** : Compilation à la volée de batchs d'évaluation vers des noyaux GPU OpenCL/PTX, couplée à un solveur hybride (Backtracking MCV, Monte Carlo Tree Search / UCT, Recuit Simulé).
- **Architecture distribuée & Débit record** : Serveur maître de distribution des partitions de recherche via TCP hardened (anti-RCE ObjectInputFilter), gRPC/FlatBuffers zéro-copie, file de tâches Redis asynchrone, et débit de plus de 21 millions d'évaluations/seconde par cœur CPU.
- **Preuves & Liens** : Dépôt GitHub : https://github.com/silveremartin-dev/ | Suite de tests automatisés : 85 tests unitaires et d'intégration à 100% de succès.`,
    detailsEn: `- **Ultra Low-Level Primitive Engine & Zero-Heap**: Compact 64-bit scalar tile representation (PiecePrimitive & BoardPrimitive) enabling O(1) rotations and edge checks with zero memory allocation in the critical search hot loop.
- **Hardware GPU Acceleration (TornadoVM)**: JIT compilation of evaluation candidate batches into OpenCL/PTX GPU kernels, coupled with a hybrid solver engine (MCV Backtracking, Monte Carlo Tree Search / UCT, Simulated Annealing).
- **Distributed Topology & Throughput**: Central cluster coordinator distributing puzzle sub-spaces via hardened TCP sockets (ObjectInputFilter anti-RCE), zero-copy gRPC/FlatBuffers, asynchronous Redis queue, achieving over 21 Million candidate evaluations per second per CPU core.
- **Technical Proofs & Links**: GitHub Repositories: https://github.com/silveremartin-dev/ | Automated Test Suite: 85 unit and integration tests passing at 100%.`
  },

  jrobotics: {
    key: "jrobotics",
    tags: ["Robotique", "Java 21", "SLAM", "EKF", "Deep Learning", "YOLO", "DQN", "ROS 2", "Swarm", "jMonkeyEngine"],
    titleFr: "JROBOTICS : Framework Robotique Universel & API Modulaire pour Java 21+ (2025-2026)",
    titleEn: "JROBOTICS: Modular Universal Robotics Framework & API for Java 21+ (2025-2026)",
    summaryFr: "Plateforme robotique modulaire de niveau industriel couvrant la couche HAL, la fusion de capteurs EKF, le SLAM, la vision IA et l'essaim multi-robots.",
    summaryEn: "Industrial-grade modular robotics platform spanning hardware abstraction (HAL), EKF sensor fusion, SLAM, AI vision, and swarm orchestration.",
    detailsFr: `- **Architecture modulaire & Haute robustesse** : Architecture en 14 modules Maven (~25 000 LOC, 214+ classes), cycle de vie déterministe thread-safe, bus d'événements asynchrone et abstraction matérielle GPIO/I2C/SPI/UART (Raspberry Pi, JSerialComm).
- **Navigation autonome, SLAM & IA embarquée** : Filtre de Kalman étendu (EKF), FastSLAM 2.0 par filtres particulaires, planification de trajectoire A* / DWA / RRT, inférence Deep Learning DJL (YOLO) et apprentissage par renforcement (DQN / PPO).
- **Orchestration d'essaims & Connectivité Cloud/ROS** : Flocking Reynolds (Boids), apprentissage fédéré distribué (FedAvg), passerelle native ROS 2, pont MQTT IoT et moteur physique 2D/3D (jMonkeyEngine) avec pools zero-allocation.
- **Preuves & Liens** : Dépôt GitHub : https://github.com/silvere-martin/jrobotics | Pipeline CI/CD automatisé 100% vert.`,
    detailsEn: `- **Modular Architecture & High Robustness**: 14-module Maven architecture (~25,000 LOC, 214+ classes), deterministic thread-safe component lifecycle, asynchronous event bus, and hardware abstraction layer for GPIO/I2C/SPI/UART (Raspberry Pi, JSerialComm).
- **Autonomous Navigation, SLAM & Embedded AI**: Extended Kalman Filter (EKF), FastSLAM 2.0 particle filter, path planning via A* / DWA / RRT, Deep Java Library (DJL) vision inference (YOLO), and Reinforcement Learning agents (DQN / PPO).
- **Swarm Robotics & Cloud/ROS Interoperability**: Reynolds Boids flocking, decentralized Federated Learning (FedAvg), native ROS 2 bridge, MQTT IoT adapter, and 2D/3D physics simulation (jMonkeyEngine) utilizing zero-allocation object pools.
- **Technical Proofs & Links**: GitHub Repository: https://github.com/silvere-martin/jrobotics | Automated CI/CD pipeline 100% green.`
  },

  jgame: {
    key: "jgame",
    tags: ["Jeux Distribués", "Java 25", "Javalin REST", "WebSockets", "JavaFX", "Minimax", "Sécurité", "JWT"],
    titleFr: "JGAME : Plateforme Modulaire de Jeux Multi-Joueurs Distribués & IA (2025-2026)",
    titleEn: "JGAME: Distributed Modular Multiplayer Gaming Platform & AI (2025-2026)",
    summaryFr: "Écosystème client-serveur de jeux au tour par tour multi-modules combinant moteurs de règles, IA Minimax, serveurs REST/WebSocket et double client JavaFX/Web.",
    summaryEn: "Multi-module client-server turn-based gaming platform combining game rule engines, Minimax AI, REST/WebSocket servers, and dual JavaFX/Web clients.",
    detailsFr: `- **Architecture multi-module propre & Java 25** : Découplage strict en 9 modules (core, server Javalin 6, desktop JavaFX 21, web client Vanilla JS/CSS, plugins d'échecs, dames, jeu de l'oie, solitaire).
- **Moteurs d'IA & Lobbies haute concurrence** : Moteur d'échecs et de dames avec IA Minimax et élagage Alpha-Bêta, gestion concurrente thread-safe des salons multi-joueurs (opérations atomiques compute()) et classements ELO persistants.
- **Sécurité entreprise & Résilience** : Hachage BCrypt (coût 12), authentification JWT avec révocation en mémoire (TokenBlacklist), protection anti-brute-force rate limiting, et sanitisation HTML contre les failles XSS.
- **Preuves & Liens** : Dépôt GitHub : https://github.com/silvere-martin/JGame | Pipeline CI/CD GitHub Actions 100% opérationnel.`,
    detailsEn: `- **Clean Multi-Module Architecture & Java 25**: Decoupled 9-module architecture (domain core, Javalin 6 REST server, JavaFX 21 desktop client, Vanilla JS web client, engines for Chess, Checkers, Solitaire, etc.).
- **Pluggable AI Engines & High-Concurrency Lobbies**: Chess and Checkers rule engines powered by Minimax AI with Alpha-Beta pruning, thread-safe concurrent lobby management (atomic compute() transitions), and persistent ELO ranking systems.
- **Enterprise-Grade Security & Resilience**: BCrypt password hashing (cost 12), HMAC-SHA256 JWT authentication with TokenBlacklist revocation, rate limiting (HTTP 429), and strict HTML sanitization against XSS.
- **Technical Proofs & Links**: GitHub Repository: https://github.com/silvere-martin/JGame | GitHub Actions CI/CD pipeline 100% operational.`
  }
};

// --- 6. FONCTION DE CONSTRUCTION DYNAMIQUE DE LA NOTE TECHNIQUE ---
/**
 * Assemble à la volée une Note de Réalisation Technique ciblée en Français ou en Anglais.
 * Sélectionne les projets demandés (par défaut 2 à 3 projets majeurs) et injecte l'en-tête et les compétences transversales.
 * 
 * @param {string[]} projectKeys Liste des clés de projets à inclure (ex: ['openprimer', 'episteme', 'ether', 'swarmforge', 'eternity', 'jrobotics', 'jgame'])
 * @param {string} lang "fr" ou "en"
 * @param {string} targetTitle Titre cible personnalisé
 * @param {string} customExpertise Phrase d'expertise clé ciblée
 * @returns {string} Markdown complet de la note technique
 */
function buildTailoredTechnicalNote(projectKeys, lang = "fr", targetTitle = null, customExpertise = null) {
  const isEn = (lang || "").toLowerCase().startsWith("en");
  
  // Clés par défaut si non spécifiées : sélection équilibrée de 3 projets majeurs
  const keysToUse = (projectKeys && projectKeys.length > 0) 
    ? projectKeys 
    : ["openprimer", "episteme", "swarmforge"];
  
  const headerName = CANDIDATE_PROFILE.fullName.toUpperCase();
  const phoneStr = CANDIDATE_PROFILE.phoneInt || CANDIDATE_PROFILE.phone;
  const defaultTitle = isEn 
    ? "Senior Software Architect & Distributed Systems Lead" 
    : "Architecte Logiciel Senior & Lead Systèmes Distribués / IA";
  const finalTitle = targetTitle || defaultTitle;
  
  const defaultExpertise = isEn
    ? "Complex Distributed Architectures, HPC & Massive Multi-Agent Simulations, Production LLMOps Pipelines."
    : "Architectures Distribuées Complexes, HPC & Simulations Multi-Agents Massives, Industrialisation LLMOps.";
  const finalExpertise = customExpertise || defaultExpertise;

  let md = `# ${headerName}\n`;
  md += `${CANDIDATE_PROFILE.location} | ${phoneStr} | ${CANDIDATE_PROFILE.email}\n`;
  md += `LinkedIn: ${CANDIDATE_PROFILE.linkedinUrl} | GitHub: ${CANDIDATE_PROFILE.githubUrl}\n\n`;

  if (isEn) {
    md += `## TECHNICAL BACKGROUND BRIEF: COMPLEX SYSTEMS & LARGE-SCALE SOFTWARE ENGINEERING\n`;
    md += `For the attention of Recruiters and Technical Directors\n`;
    md += `Candidate: ${CANDIDATE_PROFILE.fullName} – ${finalTitle}\n`;
    md += `Core Expertise: ${finalExpertise}\n\n`;
  } else {
    md += `## NOTE DE RÉALISATION TECHNIQUE : SYSTÈMES COMPLEXES & INGÉNIERIE LOGICIELLE\n`;
    md += `À l'attention des Recruteurs et Directeurs Techniques\n`;
    md += `Candidat : ${CANDIDATE_PROFILE.fullName} – ${finalTitle}\n`;
    md += `Expertise clé : ${finalExpertise}\n\n`;
  }

  // Injecter chaque projet sélectionné
  let projectIndex = 1;
  keysToUse.forEach(k => {
    const proj = MASTER_TECHNICAL_PROJECTS[k.toLowerCase()];
    if (proj) {
      const pTitle = isEn ? proj.titleEn : proj.titleFr;
      const pSummary = isEn ? proj.summaryEn : proj.summaryFr;
      const pDetails = isEn ? proj.detailsEn : proj.detailsFr;
      
      md += `### ${projectIndex}. ${pTitle}\n`;
      md += `${pSummary}\n`;
      md += `${pDetails}\n\n`;
      projectIndex++;
    }
  });

  // Compétences transversales
  if (isEn) {
    md += `### ${projectIndex}. CROSS-FUNCTIONAL EXPERTISE DELIVERABLE TO YOUR ORGANIZATION\n`;
    md += `- **Technical Leadership & Architecture Vision**: Steering high-stakes software initiatives, translating ambitious scientific/business challenges into resilient, modular distributed architectures.\n`;
    md += `- **Extreme Performance & Resource Efficiency**: Mastery of low-level concurrency, zero-copy serialization, hardware offloading (GPU/CUDA/SIMD), and strict inference/infrastructure cost governance (FinOps/LLMOps).\n`;
    md += `- **Sovereignty, Security & Quality Discipline**: Mathematical rigor applied to codebases (TDD, automated regression suites, hardened transport protocols, zero-heap primitives, and self-healing patterns).`;
  } else {
    md += `### ${projectIndex}. COMPÉTENCES TRANSVERSALES APPLICABLES À VOTRE ORGANISATION\n`;
    md += `- **Direction Technique & Vision d'Architecture** : Pilotage stratégique de projets logiciels à forts enjeux, transformation d'objectifs métiers et scientifiques complexes en architectures distribuées résilientes et modulaires.\n`;
    md += `- **Haute Performance & Efficience des Ressources** : Maîtrise de la concurrence de bas niveau, sérialisation zéro-copie, accélération matérielle (GPU/CUDA/SIMD) et gouvernance rigoureuse des coûts d'infrastructure et d'inférence (FinOps/LLMOps).\n`;
    md += `- **Souveraineté, Sécurité & Rigueur d'Ingénierie** : Rigueur méthodologique et mathématique appliquée au code (TDD, suites de tests automatisées, protocoles durcis anti-vulnérabilités, primitives zero-heap et patterns auto-correctifs).`;
  }

  return md;
}

// Master Notes de référence complètes (incorporant l'ensemble des projets majeurs)
const TECHNICAL_NOTE_FR = buildTailoredTechnicalNote(["openprimer", "episteme", "ether", "swarmforge"], "fr");
const TECHNICAL_NOTE_EN = buildTailoredTechnicalNote(["openprimer", "episteme", "ether", "swarmforge"], "en");

/**
 * Retourne la note technique appropriée selon la langue et éventuellement une sélection de projets.
 */
function getTechnicalNote(language, projectKeys = null, targetTitle = null) {
  if (projectKeys && projectKeys.length > 0) {
    return buildTailoredTechnicalNote(projectKeys, language, targetTitle);
  }
  if (language && language.toLowerCase().startsWith('en')) {
    return TECHNICAL_NOTE_EN;
  }
  return TECHNICAL_NOTE_FR;
}

