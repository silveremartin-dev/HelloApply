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
Conception d'un écosystème de 18 architectures deep-tech open-source (Java 25, Rust, Python) cumulant plus de 1M de lignes de code.
Création d'Episteme (calcul scientifique 450k LOC, 15x plus rapide qu'Apache), de SwarmForge (simulation multi-agents 2M entités, ECS, Rust SIMD) et de Praxis (jumeaux numériques 3D et retargeting pour robots humanoïdes).
Développement du moteur de déroulement virtuel Volumen (Vesuvius Challenge, streaming out-of-core OME-Zarr 10 To) et de la plateforme SaaS EdTech OpenPrimer.
Automatisation de 80% des tests unitaires et de la documentation via l'ingénierie augmentée par agents IA (Google Antigravity).
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
Langages : Java (Expert), Rust, Python, C#, Javascript, SQL, C++, LISP, PHP, Powershell.
Outils IA : Google Antigravity, TensorFlow, Keras, Gemini 3, ChatGPT, HuggingFace, LeRobot, MuJoCo, N8N
Frameworks & Data : SpringBoot, DuckDB, Apache Parquet, OME-Zarr, Hibernate, Spark, Kafka, Tornado VM, Three.js, Redis, Oracle, PostgreSQL.
Méthodes : Agile (Scrum/Lean), TDD, Design Patterns, UML."`;

// --- 5. CATALOGUE MAÎTRE DES PROJETS TECHNIQUES (PORTFOLIO MAÎTRE - 18 PROJETS) ---
const MASTER_TECHNICAL_PROJECTS = {
  episteme: {
    key: "episteme",
    tags: ["HPC", "Calcul Scientifique", "Java 25", "Project Panama", "CUDA", "GPU", "Antigravity", "Performance"],
    titleFr: "EPISTEME : Calcul Scientifique Haute Performance (HPC) & Industrialisation IA (2025-2026)",
    titleEn: "EPISTEME: High-Performance Scientific Computing (HPC) & AI Industrialization (2025-2026)",
    summaryFr: "Développement d'une bibliothèque souveraine de calcul scientifique distribué et de simulation multi-agents de masse (450 000+ lignes de code Java).",
    summaryEn: "Development of a sovereign distributed scientific computing and massive multi-agent simulation library (450,000+ lines of Java code).",
    detailsFr: `- **Innovations & Paradigmes** : Vibe Coding & Ingénierie augmentée via Google Antigravity, automatisation de 80% des tests et de la documentation (cycle de release divisé par 5), benchmarks jusqu'à 15x supérieurs aux standards Apache.
- **Simulation de Masse & HPC** : Architecture client-serveur ultra-performante pour simulations complexes, Java 25 (Project Panama FFM pour accès mémoire hors-heap, Vector API SIMD, binding natif Rust Rayon et CUDA), optimisation réseau et E/S.
- **Preuves & Liens** : Dépôt GitHub : https://github.com/Episteme-HPC/Episteme | Démo Hugging Face : https://huggingface.co/spaces/silveremartin/Episteme | Benchmarks : https://github.com/Episteme-HPC/Episteme/tree/main/docs/benchmark-results | Publication LinkedIn : ${CANDIDATE_PROFILE.linkedinUrl}`,
    detailsEn: `- **Innovations & Engineering Paradigms**: Vibe Coding & Augmented Engineering via Google Antigravity, AI-driven automation of 80% of unit tests and documentation (5x release acceleration), benchmarks up to 15x higher than Apache Foundation libraries.
- **Massive Simulation & HPC Stack**: Client-server architecture built for complex simulations, Java 25 (Project Panama FFM for off-heap memory, Vector API SIMD, native Rust Rayon and CUDA bindings), I/O and network topology optimization.
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
- **Preuves & Liens** : Dépôt GitHub : https://github.com/silveremartin-dev/ | Distribution autonome 100% hors-ligne (~44 Mo) et 162 tests validés.`,
    detailsEn: `- **Distributed Architecture & Large-Scale Domain Partitioning**: Distributed client-server architecture and multi-node cluster computing (spatial domain decomposition, deterministic ClusterClockBarrier synchronization barrier, PostGIS, Docker) simulating millions of hexagonal cells indexed via Uber H3 spatial indexing.
- **Intensive Computing & Biophysical Modeling**: High-performance hybrid simulation engine (Java 21 Virtual Threads / Project Loom, Vector API SIMD, zero-cost native Rust FFI binding) coupling strict physical laws (non-equilibrium thermodynamics, EROEI energy return on investment, soil N-P-K biogeochemical cycles) with non-linear demographic and societal dynamics.
- **Orchestration Studio & Advanced Telemetry**: Modular JavaFX desktop client suite (7 real-time analytics panels, "Archon" runtime historical event/bifurcation injection engine, AES-256 encrypted dataset export) backed by automated empirical validation benchmarks against international historical datasets (Seshat Global History Databank, Maddison Project, HYDE).
- **Technical Proofs & Links**: GitHub Repositories: https://github.com/silveremartin-dev/ | 100% offline standalone distribution (~44 MB) and 162 automated tests passing.`
  },

  swarmforge: {
    key: "swarmforge",
    tags: ["Multi-Agents", "Systèmes Complexes", "Kubernetes", "gRPC", "FlatBuffers", "Redis", "jMonkeyEngine", "3D", "React"],
    titleFr: "SWARMFORGE : Plateforme Distribuée de Simulation Multi-Agents Massive & Écosystèmes 3D (2025-2026)",
    titleEn: "SWARMFORGE: Distributed Massive Multi-Agent Simulation Platform & 3D Ecosystems (2025-2026)",
    summaryFr: "Moteur distribué de simulation multi-agents à très grande échelle (jusqu'à 2 000 000 d'agents) modélisant des colonies eusociales et des réseaux trophiques complexes.",
    summaryEn: "Large-scale distributed multi-agent simulation engine (scaling up to 2,000,000 agents) modeling eusocial colonies and complex trophic food webs.",
    detailsFr: `- **Simulation massive (2M agents) & écologie poussée** : Moteur multi-agents avec architecture mémoire DOD compacte (~32 Mo RAM pour 1M agents), ECS Artemis-odb, Panama FFM et moteur natif Rust SIMD (+25x speedup), modélisant colonies eusociales et réseaux trophiques via architectures décisionnelles riches (BDI, ONNX DRL, logique floue, bitmask éthologique 256 bits).
- **Architecture distribuée, multijoueur & Cloud** : Écosystème client-serveur distribué (nœuds swarmforge-compute, gRPC/Protobuf/FlatBuffers, cluster Kubernetes/Helm, broker Redis, persistance PostgreSQL/H2) avec sharding Megaterrarium multi-nœuds synchronisé et sessions multijoueurs (PvP et coopératif).
- **Physique environnementale & interfaces immersives** : Simulation thermodynamique des nids (effet cheminée, CO2), diffusion de phéromones sur GPU TornadoVM/OpenCL, visualiseur 3D temps réel (jMonkeyEngine 3.6), suite d'éditeurs visuels et client web d'observabilité (React / Vite).
- **Preuves & Liens** : Dépôt GitHub : https://github.com/silveremartin-dev/`,
    detailsEn: `- **Massive Simulation (2M Agents) & Advanced Ecological Modeling**: Multi-agent simulation engine featuring compact DOD memory buffers (~32 MB RAM for 1M agents), Artemis-odb ECS, Panama FFM and native Rust SIMD engine (+25x speedup), modeling eusocial colonies and trophic webs via rich cognitive architectures (BDI, ONNX DRL, fuzzy logic, 256-bit ethology bitmasks).
- **Distributed Architecture, Multiplayer & Cloud Infrastructure**: Distributed client-server ecosystem (swarmforge-compute nodes, ultra-fast serialization via gRPC/Protobuf/FlatBuffers, Kubernetes/Helm cluster orchestration, Redis, PostgreSQL/H2) supporting synchronized multi-node Megaterrarium sharding and real-time multiplayer sessions (competitive PvP and cooperative modes).
- **Environmental Physics & Immersive UIs**: Subsurface nest thermodynamics (chimney effect, CO2), TornadoVM/OpenCL GPU pheromone diffusion, real-time 3D visualization engine (jMonkeyEngine 3.6), comprehensive visual rule editor suite, and modern observability web client (React / Vite).
- **Technical Proofs & Links**: GitHub Repositories: https://github.com/silveremartin-dev/`
  },

  praxis: {
    key: "praxis",
    tags: ["Computer Vision", "V2PDT", "Robotique Humanoïde", "MuJoCo", "Three.js", "HuggingFace", "LeRobot", "FastAPI"],
    titleFr: "PRAXIS : Ingénierie Vidéo-vers-Jumeau-Numérique (V2PDT) & Manipulation Robotique Humanoïde (2026)",
    titleEn: "PRAXIS: Video-to-Physical-Digital-Twin (V2PDT) & Humanoid Robot Manipulation (2026)",
    summaryFr: "Moteur de data-engineering transformant des vidéos monoculaires YouTube en jumeaux numériques physiques 3D certifiés contact pour robots humanoïdes.",
    summaryEn: "Data-engineering engine converting monocular in-the-wild YouTube videos into contact-certified 3D physical digital twins for humanoid robotics.",
    detailsFr: `- **Retargeting bimanuel autonome & Détection de collisions** : Conversion de vidéos monoculaires en démonstrations 3D manipulatoires avec retargeting direct vers mains robotiques (Unitree H1, Tesla Optimus Gen-2, ALOHA, Franka Panda) et respect strict des variétés de contact SDF sans collision (L_SDF >= 0).
- **Studio d'inspection 3D & Physique MuJoCo 3.x** : Studio web interactif (FastAPI, Three.js) avec lecteur vidéo synchronisé image par image (-1f/+1f), flux optique dense Farneback, décomposition en graphes de tâches et simulation physique directe sous MuJoCo 3.x.
- **Audit de qualité automatisé & Export LeRobot** : Porte de validation avec notation rigoureuse (0-100, Grade A+), découpage multi-plans et export certifié au format Hugging Face LeRobot (tables Apache Parquet et modèles Wavefront OBJ).
- **Preuves & Liens** : Dépôt GitHub : https://github.com/silveremartin-dev/ | Studio Web opérationnel 1-clic.`,
    detailsEn: `- **Autonomous Bimanual Retargeting & Collision-Free Manifolds**: Conversion of monocular demonstration videos into 3D manipulation digital twins retargeted directly to robot hands (Unitree H1, Tesla Optimus Gen-2, ALOHA, Franka Panda) under strict zero-penetration SDF collision constraints (L_SDF >= 0).
- **Interactive 3D Studio & Live MuJoCo 3.x Physics**: Browser inspection studio (FastAPI, Three.js) featuring synchronized frame-by-frame scrubbing (-1f/+1f), dense Farneback optical flow velocity tracking, task graph extraction, and forward physics simulation in MuJoCo 3.x.
- **Automated Demonstration Audit & LeRobot Export**: Ingestion quality gate with objective scoring (0-100, Grade A+), multi-shot continuous slicing, and certified export to Hugging Face LeRobot format (Apache Parquet tables and Wavefront OBJ meshes).
- **Technical Proofs & Links**: GitHub Repository: https://github.com/silveremartin-dev/ | 1-Click Operational Web Studio.`
  },

  volumen: {
    key: "volumen",
    tags: ["Rust", "HPC", "Tomographie", "Vesuvius Challenge", "OME-Zarr", "Rayon", "SIMD", "PyTorch"],
    titleFr: "VOLUMEN : Moteur HPC Rust de Déroulement Virtuel & Streaming Volumétrique (2026)",
    titleEn: "VOLUMEN: High-Performance Rust Virtual Unwrapping & Volumetric Streaming Engine (2026)",
    summaryFr: "Moteur haute performance en Rust de déroulement virtuel 3D et streaming volumétrique out-of-core (OME-Zarr) pour les papyrus carbonisés d'Herculanum (Vesuvius Challenge).",
    summaryEn: "High-performance Rust virtual unwrapping engine and out-of-core volumetric streaming reader (OME-Zarr) for carbonized Herculaneum papyri (Vesuvius Challenge).",
    detailsFr: `- **Calcul intensif & Streaming out-of-core (5-10 To)** : Architecture Rust moderne exploitant le parallélisme multithread Rayon, la vectorisation SIMD et un cache LRU thread-safe pour streamer à la volée les volumes massifs de tomographie synchrotron XPCT (ESRF) sans saturation mémoire.
- **Déroulement continu par spirale d'Archimède** : Algorithme analytique de déroulement par variétés en spirale éliminant les distorsions de cordes polygonales et résolvant le goulot d'étranglement historique du saut de feuillet (sheet-switching).
- **Interopérabilité villa & Streaming PyTorch** : Remplacement direct des ray-casters C++ historiques (vc_render), support des formats Wavefront OBJ et réseaux réguliers VC3D tifxyz, avec API de streaming mémoire zero-copy vers PyTorch.
- **Preuves & Liens** : Dépôt GitHub : https://github.com/silveremartin-dev/ | Compatible monorepo officiel ScrollPrize/villa et 27 tests unitaires passants à 100%.`,
    detailsEn: `- **Intensive Computing & Out-of-Core Streaming (5-10 TB)**: Modern Rust architecture leveraging Rayon multithreading, SIMD vectorization, and thread-safe LRU caching to stream massive synchrotron XPCT tomographic volumes (ESRF) on-demand with bounded RAM footprint.
- **Continuous Archimedean Spiral Unrolling**: Analytical manifold unrolling eliminating polygonal chordal distortion and solving the persistent pyrolyzed sheet-switching bottleneck of traditional segmenters.
- **villa Ecosystem Alignment & PyTorch Streaming**: Drop-in replacement for legacy C++ ray-casters (vc_render), full support for Wavefront OBJ and VC3D tifxyz lattices, with zero-copy in-memory streaming API into PyTorch.
- **Technical Proofs & Links**: GitHub Repository: https://github.com/silveremartin-dev/ | Fully compatible with ScrollPrize/villa monorepo and 27 passing automated tests.`
  },

  openprimer: {
    key: "openprimer",
    tags: ["GenAI", "LLMOps", "Fullstack", "Next.js", "Supabase", "Cloud-Native", "EdTech", "Multi-Agents"],
    titleFr: "OPENPRIMER : Orchestration de Savoir Autonome & IA Générative (2026)",
    titleEn: "OPENPRIMER: Autonomous Knowledge Orchestration & Generative AI (2026)",
    summaryFr: "Conception et déploiement d'une plateforme d'université en ligne générant de manière autonome des cursus universitaires interactifs de niveau académique.",
    summaryEn: "Design and deployment of an online university platform autonomously generating academic-grade interactive university curricula.",
    detailsFr: `- **Défis Techniques & Architecture** : Orchestrateur autonome multi-agents (Gemini 2.5 API), modélisation sur taxonomie académique de 10 niveaux (42 disciplines), pipeline de génération multilingue dynamique (EN, FR, ES, DE, ZH), inférence WebLLM locale dans le navigateur avec bascule cloud.
- **Sécurité & Résilience Cloud-Native** : Isolation stricte des données via Row-Level Security (RLS) sur Supabase, cache auto-correctif anti-hallucination réduisant la latence et garantissant l'intégrité des contenus, gardes Zod et rate limiting (20 req/min).
- **Stack Technique & LLMOps** : Next.js 15 (App Router, Server Components), Vercel (HA), Supabase (PostgreSQL, Realtime), Gemini 2.5, application mobile React Native / Expo et optimisation DAG des coûts d'inférence.
- **Preuves & Liens** : Plateforme en production : https://openprimer.app/ (code OP-BETA-2026) | Dépôt GitHub : https://github.com/Open-Primer/`,
    detailsEn: `- **Technical Challenges & Architecture**: Autonomous multi-agent orchestrator leveraging Gemini 2.5 API for mass generation, 10-level academic taxonomy (42 disciplines), dynamic multilingual pipeline (EN, FR, ES, DE, ZH), client-side in-browser WebLLM inference with cloud fallback.
- **Cloud-Native Security & Resilience**: Strict data isolation via Row-Level Security (RLS) on Supabase, self-healing cache mechanism reducing latency and preventing hallucination drift, Zod guards, and rate limiting (20 req/min).
- **Technical Stack & LLMOps**: Next.js 15 (App Router, Server Components), Vercel (High-Availability), Supabase (PostgreSQL, Realtime), Gemini 2.5, React Native / Expo mobile app, and DAG-based pipeline inference cost optimization.
- **Technical Proofs & Links**: Production Platform: https://openprimer.app/ (code OP-BETA-2026) | Primary GitHub Repository: https://github.com/Open-Primer/`
  },

  voynichductus: {
    key: "voynichductus",
    tags: ["Computer Vision", "Paléographie", "DINOv2", "HDBSCAN", "Python", "Théorie de l'Information", "Kinematics"],
    titleFr: "VOYNICHDUCTUS : Paléographie Computationnelle & Cinématique de Scribe (2026)",
    titleEn: "VOYNICHDUCTUS: Computational Paleography & Scribal Kinematics Pipeline (2026)",
    summaryFr: "Pipeline computationnel de vision et paléographie émancipant l'analyse de manuscrits anciens des biais de translittération humaine via l'extraction vectorielle du ductus.",
    summaryEn: "Computational vision and paleography pipeline decoupling ancient manuscript analysis from human transliteration bias through objective vector ductus extraction.",
    detailsFr: `- **Cinématique de plume médiévale & Vectorisation** : Modélisation physique du biseau de plume à 40° sur crêtes EDT (Euclidean Distance Transform) et loi du minimum jerk de Flash & Hogan pour reconstituer les trajectoires spatio-temporelles continues (offline-to-online derendering).
- **Suite multi-paradigme de vision** : Comparaison de 5 méthodes indépendantes (plume physique, squelette Euler-Bernoulli, U-Net Scribal Flow, Meta DINOv2 ViT et Google InkSight) pour une analyse robuste des tracés et ligatures.
- **Découverte d'alphabets émergents & Diagnostics formels** : Regroupement non supervisé des allographes par clustering HDBSCAN sur descripteurs géométriques et embeddings DINOv2, validé par un banc de tests théoriques (entropie de Shannon H1/H2, exposant de Hurst DFA, compression LZMA, automates finis de Markov).
- **Preuves & Liens** : Dépôt GitHub : https://github.com/silveremartin-dev/ | Première translittération émergente complète du Codex Seraphinianus.`,
    detailsEn: `- **Medieval Quill Mechanics & Vectorization**: Physical broad-nib modeling (40° bevel) on Euclidean Distance Transform (EDT) ridges and Flash & Hogan minimum jerk optimization to reconstruct continuous spat-temporal trajectories (offline-to-online derendering).
- **Multi-Paradigm Vision Suite**: Systematic comparison of 5 independent methods (Physical Quill, Euler-Bernoulli skeleton, U-Net Scribal Flow, Meta DINOv2 ViT, and Google InkSight) to analyze complex ligatures and glyph geometries.
- **Unsupervised Alphabet Discovery & Formal Diagnostics**: Unsupervised allograph clustering via HDBSCAN on geometric descriptors and DINOv2 embeddings, benchmarked against rigorous information-theoretic criteria (Shannon entropy H1/H2, Hurst DFA, LZMA, Markov finite state automata).
- **Technical Proofs & Links**: GitHub Repository: https://github.com/silveremartin-dev/ | First complete emergent transliteration of the Codex Seraphinianus.`
  },

  artstylometry: {
    key: "artstylometry",
    tags: ["Computer Vision", "Stylométrie", "PyTorch", "DINOv2", "HDBSCAN", "IIIF", "Parquet", "Digital Humanities"],
    titleFr: "ARTSTYLOMETRY : Moteur de Stylométrie Computationnelle & Attribution d'Art (2026)",
    titleEn: "ARTSTYLOMETRY: Computational Stylometry & Quantitative Connoisseurship Engine (2026)",
    summaryFr: "Moteur d'expertise quantitative et de stylométrie computationnelle analysant plus de 12 300 toiles gigapixels issues des grands musées mondiaux.",
    summaryEn: "Quantitative connoisseurship and computational stylometry engine analyzing 12,300+ gigapixel paintings from premier international museum collections.",
    detailsFr: `- **Ingestion massive IIIF & Traitement gigapixel** : Moissonnage automatisé de 12 300+ œuvres en ultra-haute résolution via les API IIIF de 14 institutions majeures (Louvre, Met, Rijksmuseum, National Gallery) et pipeline de données Parquet/Arrow.
- **Extraction stylistique profonde & Cartographies intra-toile** : Encodage d'empreintes par vision transformer (Meta DINOv2) et matrices de Gram, réductions de variétés UMAP et cartographie d'attribution spatiale par distances de Mahalanobis isolant les mains d'assistants d'atelier.
- **Portail d'audit visuel & Variété 3D** : Dashboard web interactif avec manifold 3D de 9 300+ toiles, analyse comparative de 12 ateliers historiques (Léonard, Rembrandt, Rubens) et détection de 108 divergences d'attribution documentées.
- **Preuves & Liens** : Dépôt GitHub : https://github.com/silveremartin-dev/ | 37 tests unitaires passants et portail d'audit interactif.`,
    detailsEn: `- **Massive IIIF Ingestion & Gigapixel Processing**: Automated harvesting of 12,300+ ultra-high-resolution paintings via IIIF APIs from 14 leading museums (Louvre, Met, Rijksmuseum, National Gallery) backed by a Parquet/Arrow data pipeline.
- **Deep Stylistic Encoding & Spatial Heatmaps**: Feature extraction leveraging Meta DINOv2 vision transformers and Gram matrices, coupled with UMAP manifold reduction and Mahalanobis spatial distance heatmaps isolating workshop pupil interventions.
- **Visual Audit Portal & 3D Manifold**: Interactive web portal showcasing a 3D manifold of 9,300+ artworks, comparative auditing across 12 historical ateliers (Leonardo, Rembrandt, Rubens), and tracking 108 documented connoisseurship divergences.
- **Technical Proofs & Links**: GitHub Repository: https://github.com/silveremartin-dev/ | 37 passing unit tests and interactive audit studio.`
  },

  nisaba: {
    key: "nisaba",
    tags: ["DuckDB", "Apache Parquet", "Python", "Data Engineering", "Graphes", "Épigraphie", "FastAPI"],
    titleFr: "NISABA : Compilateur & Moteur Analytique pour l'Épigraphie Cunéiforme (2026)",
    titleEn: "NISABA: High-Performance Computational Engine for Sumerian Cuneiform Epigraphy (2026)",
    summaryFr: "Moteur d'ingénierie de données haute performance transformant le corpus mondial de 135 253 tablettes cunéiformes CDLI en bases relationnelles colonnaires.",
    summaryEn: "High-performance data engineering engine compiling the global CDLI corpus of 135,253 cuneiform tablets into columnar relational databases.",
    detailsFr: `- **Compilation tabulaire & Big Data historique** : Ingestion et structuration des 135 253 tablettes du corpus CDLI dans un moteur colonnaire ultra-rapide (DuckDB, Apache Parquet), avec conversion métrologique sumérienne automatisée (capacités gur/sila, poids gú/ma-na).
- **Graphes prosopographiques & Datation de tablettes brisées** : Moteur chronologique résolvant les dates manquantes des tablettes endommagées par recoupement de réseaux d'administrateurs royaux sur 398 000 transactions administratives de la période Ur III.
- **Détection de fragments & Comptabilité en partie double** : Algorithmes de réconciliation découvrant les jointures physiques et virtuelles de fragments dispersés entre musées mondiaux et audit automatisé des bilans comptables d'empire.
- **Preuves & Liens** : Dépôt GitHub : https://github.com/silveremartin-dev/ | Explorateur web interactif, visualiseur de graphe réseau et 76 tests validés.`,
    detailsEn: `- **Columnar Compilation & Historical Big Data**: Parsing and transformation of 135,253 CDLI tablets into high-throughput columnar storage (DuckDB, Apache Parquet) with automated ancient Sumerian metrology conversions (capacity, mass).
- **Prosopography Graphs & Damaged Tablet Dating**: Chronological solver recovering missing dates on fractured tablets through administrative network intersections across 398,000 Ur III economic transactions.
- **Fragment Join Discovery & Double-Entry Accounting**: Reconciliation algorithms identifying physical and virtual joins of fragments split across global museums and automated balance sheet auditing for imperial bureaus.
- **Technical Proofs & Links**: GitHub Repository: https://github.com/silveremartin-dev/ | Interactive web dossier explorer, network graph visualizer, and 76 passing tests.`
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

  nexuslayer: {
    key: "nexuslayer",
    tags: ["Java 21", "Spring Boot", "JavaFX", "PostgreSQL", "Docker", "REST", "OpenAPI", "JWT"],
    titleFr: "NEXUSLAYER : Éditeur Visuel de Schémas & Architecture Client-Serveur (2026)",
    titleEn: "NEXUSLAYER: Visual Schema Editor & Client-Server Architecture (2026)",
    summaryFr: "Application client-serveur moderne de modélisation visuelle, conception relationnelle et navigation interactive de bases de données.",
    summaryEn: "Modern client-server application for visual database modeling, relational schema design, and interactive data navigation.",
    detailsFr: `- **Éditeur visuel de schémas & Navigation interactive** : Conception intuitive en glisser-déposer de tables, colonnes et relations PK/FK couplée à un navigateur de données avec filtrage en temps réel et support multilingue (5 langues).
- **Architecture modulaire & Client lourd JavaFX 21** : Découplage complet en 3 modules (nexus-common, nexus-server, nexus-client), desktop JavaFX ergonomique et API REST Spring Boot 3.2 avec pool de connexions HikariCP.
- **Sécurité d'entreprise & Infrastructure conteneurisée** : Chiffrement TLS/SSL, authentification par tokens JWT et hachage BCrypt, documentation OpenAPI 3.0 (Swagger UI) et orchestration Docker Compose avec PostgreSQL 16.
- **Preuves & Liens** : Dépôt GitHub : https://github.com/silveremartin-dev/ | Pipeline CI/CD GitHub Actions opérationnel.`,
    detailsEn: `- **Visual Schema Designer & Interactive Navigator**: Drag-and-drop table, column, and PK/FK relationship mapping paired with a real-time filtered data browser and multi-language support (5 languages).
- **Modular Multi-Module & JavaFX 21 Client**: Strict 3-module separation (nexus-common, nexus-server, nexus-client), responsive JavaFX desktop interface, and Spring Boot 3.2 REST API with HikariCP connection pooling.
- **Enterprise Security & Containerized Infrastructure**: TLS/SSL encryption, JWT authentication, BCrypt password hashing, OpenAPI 3.0 documentation (Swagger UI), and Docker Compose environment with PostgreSQL 16.
- **Technical Proofs & Links**: GitHub Repository: https://github.com/silveremartin-dev/ | Automated GitHub Actions CI pipeline operational.`
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
  },

  autoinsta: {
    key: "autoinsta",
    tags: ["GenAI", "Multimodal", "Gemini", "FastAPI", "Sensor Fusion", "Mobile", "Python", "Automation"],
    titleFr: "AUTOINSTA : Agent Autonome Multimodal de Lifelogging & Publication Instagram (2026)",
    titleEn: "AUTOINSTA: Autonomous Multimodal Lifelogging & Instagram Ingestion Agent (2026)",
    summaryFr: "Agent d'ingénierie multimodale capturant les flux POV mobiles et générant automatiquement des publications Instagram contextuelles via Gemini 1.5 Flash.",
    summaryEn: "Multimodal engineering agent capturing mobile POV streams and autonomously publishing contextual Instagram updates via Gemini 1.5 Flash.",
    detailsFr: `- **Fusion multi-capteurs & Capture passive** : Acquisition continue sur smartphone Android et webcam PC (flux caméra POV, coordonnées GPS, vitesse, accéléromètre, capteur de luminosité anti-poche et fréquence cardiaque BLE).
- **Curation VLM multimodale & Bouclier de confidentialité** : Évaluation esthétique (0-10) et rédaction de légendes contextuelles par Gemini 1.5 Flash, couplées à un filtre de confidentialité strict rejetant immédiatement écrans, documents financiers et intimité.
- **Architecture FastAPI & Modes de publication** : Serveur backend asynchrone avec console d'approbation humaine (Human-in-the-Loop) et publication automatique sécurisée via Instagrapi et l'API officielle Meta Graph.
- **Preuves & Liens** : Dépôt GitHub : https://github.com/silveremartin-dev/ | Intégration complète Android & FastAPI.`,
    detailsEn: `- **Multi-Sensor Fusion & Passive Ingestion**: Opportunistic capture across Android smartphones and PC webcams (POV image buffers, GPS location, velocity, accelerometer, ambient light dark filter, and BLE heart rate).
- **Multimodal VLM Curation & Zero-Tolerance Privacy**: Aesthetic scoring (0-10) and narrative caption synthesis via Gemini 1.5 Flash, backed by an automated privacy shield discarding private screens, financial documents, and nudity.
- **FastAPI Architecture & Publishing Gateways**: Asynchronous backend server featuring a human-in-the-loop review queue and automated multi-gateway publishing via Instagrapi and official Meta Graph API.
- **Technical Proofs & Links**: GitHub Repository: https://github.com/silveremartin-dev/ | End-to-end Android & FastAPI operational pipeline.`
  },

  helloapply: {
    key: "helloapply",
    tags: ["Agent IA", "Google Apps Script", "Gemini", "LLMOps", "Automatisation", "Drive", "Gmail"],
    titleFr: "HELLOAPPLY : Micro-Service & Agent IA Autonome de Recrutement Asymétrique (2026)",
    titleEn: "HELLOAPPLY: Autonomous AI Sourcing & Asymmetric Application Microservice (2026)",
    summaryFr: "Agent IA autonome sur Google Apps Script assurant une veille continue des offres de recrutement et compilant des dossiers complets de candidature en PDF.",
    summaryEn: "Autonomous AI sourcing microservice on Google Apps Script monitoring job alerts and generating complete tailored PDF application dossiers.",
    detailsFr: `- **Interception d'alertes & Analyse cognitive temps réel** : Surveillance continue de Gmail interceptant les offres LinkedIn et HelloWork, résolvant les redirections et évaluant l'adéquation sémantique (seuil 75%) via Gemini Flash.
- **Production documentaire asymétrique sur-mesure** : Génération automatisée sous 60s d'un CV ATS enrichi, d'une note de réalisation technique ciblée (parmi 18 projets), d'une lettre de motivation (« You, Me, Us ») et d'un mémo flash d'architecture peer-to-peer CTO.
- **Pipeline Cloud Google Apps Script & Clasp** : Conversion automatique Google Docs vers PDF, création de brouillons Gmail avec pièces jointes prêtes à l'envoi, journalisation Google Sheets et déploiement CI/CD via clasp.
- **Preuves & Liens** : Dépôt GitHub : https://github.com/silveremartin-dev/HelloApply | Solution déployée et active en production continue.`,
    detailsEn: `- **Alert Interception & Real-Time Cognitive Scoring**: Continuous Gmail listener capturing LinkedIn and HelloWork job alerts, resolving redirection URLs, and evaluating suitability (75% threshold) via Gemini Flash.
- **Asymmetric Tailored Document Generation**: Automated under-60-second generation of ATS-compliant CVs, targeted technical realization notes (from 18 projects), "You, Me, Us" cover letters, and peer CTO architecture memos.
- **Google Apps Script & Clasp Cloud Pipeline**: Programmatic Google Docs to PDF conversion, automated Gmail draft generation with attachments, centralized Google Sheets logging, and clasp CI/CD deployment.
- **Technical Proofs & Links**: GitHub Repository: https://github.com/silveremartin-dev/HelloApply | Deployed and running live in continuous production.`
  },

  univerlan: {
    key: "univerlan",
    tags: ["Conlang", "Linguistique", "Python", "Web Studio", "STT/TTS", "John Wilkins", "Interstellaire"],
    titleFr: "UNIVERLAN : Moteur de Langue Construite Interstellaire & Studio Bilingue (2026)",
    titleEn: "UNIVERLAN: Rationalized Interstellar Conlang Engine & Bilingual Studio (2026)",
    summaryFr: "Langue auxiliaire construite et moteur de traduction bidirectionnelle pour la communication interstellaire basée sur l'ontologie conceptuelle de John Wilkins.",
    summaryEn: "Auxiliary constructed language and bidirectional translation engine designed for interstellar communication, based on John Wilkins' ontology.",
    detailsFr: `- **Phonologie bijective & Régularité absolue** : Orthographe phonétique 1:1 rigoureuse (29 phonèmes sans aucune lettre muette), syntaxe SVO strictement régulière (zéro verbe irrégulier) et composition sémantique par vecteurs cinétiques et causatifs.
- **Moteur de traduction symétrique & Pivot canonique** : Moteur de traduction 4 modes (Français <-> Univerlan, Anglais <-> Univerlan) passant par un pivot anglais canonique assurant l'invariance sémantique, couplé à un dictionnaire trilingue de 3 959 entrées.
- **Studio web interactif bilingue (FR/EN)** : Interface responsive avec bascule dynamique de langue, dictée vocale (STT), synthèse vocale (TTS), modules d'apprentissage progressifs et lecteur bilingue synchronisé (Le Petit Prince).
- **Preuves & Liens** : Dépôt GitHub : https://github.com/silveremartin-dev/Univerlan | Lanceur 1-clic et suite de tests automatisés.`,
    detailsEn: `- **Bijective Phonology & Absolute Regularity**: Rigorous 1:1 phonetic orthography (29 phonemes, zero silent letters), strictly regular SVO syntax (zero irregular verbs), and semantic composition through kinetic causative vectors.
- **Symmetric Translation Engine & Canonical Pivot**: 4-mode translation engine (French <-> Univerlan, English <-> Univerlan) using a canonical English pivot guaranteeing semantic invariance, backed by a 3,959-entry trilingual lexicon.
- **Bilingual Interactive Web Studio (FR/EN)**: Responsive web application featuring live language switching, voice dictation (STT), text-to-speech (TTS), progressive lessons, and synchronized bilingual reader (The Little Prince).
- **Technical Proofs & Links**: GitHub Repository: https://github.com/silveremartin-dev/Univerlan | 1-Click launcher and automated test suite.`
  },

  lumina: {
    key: "lumina",
    tags: ["Linguistique Logique", "Python", "TTS", "Speech", "Matrice Sémantique", "Web Studio"],
    titleFr: "LUMINA : Langue Logique Universelle, Matrice C1V1C2V2 & Synthèse Vocale (2026)",
    titleEn: "LUMINA: Universal Logical Language, C1V1C2V2 Semantic Matrix & Speech Engine (2026)",
    summaryFr: "Projet d'ingénierie linguistique, formalisation sémantique prédicative et synthèse vocale pour la langue construite logique Lumina.",
    summaryEn: "Linguistic engineering project, formal predicative semantic matrix, and speech synthesis for the constructed logical language Lumina.",
    detailsFr: `- **Matrice sémantique C1V1C2V2 & Syntaxe SVO** : Système linguistique logique basé sur une matrice prédicative à 4 phonèmes réguliers sans exception et grammaire SVO formelle avec aspects et modaux univoques.
- **Moteur d'analyse & Synthétiseur vocal autonome** : Modules Python d'analyse morphologique, transcription phonétique IPA, traduction bidirectionnelle (FR/EN/Lumina) et synthétiseur vocal TTS autonome générant des fichiers WAV à résonance formantique.
- **Lumina Web Studio interactif bilingue** : Application web complète (FR/EN) avec forge sémantique interactive, validation phonotactique en temps réel, dictée vocale, prononciation audio et lecteur synchronisé.
- **Preuves & Liens** : Dépôt GitHub : https://github.com/silveremartin-dev/ | 23 tests de validation passants et lanceur 1-clic.`,
    detailsEn: `- **C1V1C2V2 Semantic Matrix & SVO Syntax**: Logical linguistic framework founded on a 4-phoneme predicative root matrix with zero exceptions and formal SVO grammar with unambiguous modal particles.
- **Morphological Parsing & Standalone Voice Synthesizer**: Python engines for morphological parsing, IPA phonetic transcription, bidirectional FR/EN/Lumina translation, and a standalone formant-resonance WAV speech synthesizer (TTS).
- **Bilingual Interactive Lumina Web Studio**: Complete web application (FR/EN) featuring an interactive semantic matrix forge, real-time phonotactic validation, voice dictation, speech playback, and synchronized reader.
- **Technical Proofs & Links**: GitHub Repository: https://github.com/silveremartin-dev/ | 23 passing validation tests and 1-click launcher.`
  },

  lembas: {
    key: "lembas",
    tags: ["EdTech", "Linguistique", "Gamification", "Tolkien", "Tengwar", "JavaScript", "Web Speech"],
    titleFr: "LEMBAS : Plateforme d'Apprentissage des Langues Elfiques & Calligraphie Tengwar (2026)",
    titleEn: "LEMBAS: Elvish Language Learning Platform & Tengwar Calligraphy Engine (2026)",
    summaryFr: "Plateforme éducative web immersive et gamifiée dédiée à l'apprentissage du Quenya, du Sindarin et de l'écriture calligraphique Tengwar.",
    summaryEn: "Immersive gamified web learning platform dedicated to mastering Quenya, Sindarin, and Tengwar calligraphic scripts.",
    detailsFr: `- **Traducteur & Transcription calligraphique automatique** : « Miroir de Galadriel » assurant la traduction Français <-> Elfe avec rendu calligraphique instantané en écriture runique Tengwar Annatar.
- **Parcours pédagogique gamifié Duolingo-like** : « Chemin des Eldar » structurant l'apprentissage en leçons interactives progressives avec système de points d'expérience (XP) et séries quotidiennes (streaks).
- **Moteur phonétique & Interface Glassmorphic** : Synthèse vocale intégrée (Web Speech API) respectant les règles phonologiques tolkieniennes, servie dans une interface web soignée en Glassmorphism.
- **Preuves & Liens** : Dépôt GitHub : https://github.com/silveremartin-dev/ | Application web autonome sans dépendance serveur.`,
    detailsEn: `- **Translator & Automated Calligraphic Transcription**: "Mirror of Galadriel" delivering French <-> Elvish translation with real-time calligraphic rendering in Tengwar Annatar runic script.
- **Gamified Duolingo-Style Curriculum**: "Path of the Eldar" organizing progressive interactive lessons reinforced with experience points (XP) and daily streaks.
- **Phonetic Speech Engine & Glassmorphic UI**: Integrated speech synthesis (Web Speech API) implementing Tolkienian phonological rules within a refined modern Glassmorphism web design system.
- **Technical Proofs & Links**: GitHub Repository: https://github.com/silveremartin-dev/ | Fully standalone client-side web application.`
  }
};

// --- 6. FONCTION DE CONSTRUCTION DYNAMIQUE DE LA NOTE TECHNIQUE ---
/**
 * Assemble à la volée une Note de Réalisation Technique ciblée en Français ou en Anglais.
 * Sélectionne les projets demandés (par défaut 2 à 3 projets majeurs) et injecte l'en-tête et les compétences transversales.
 * 
 * @param {string[]} projectKeys Liste des clés de projets à inclure (18 projets disponibles dans MASTER_TECHNICAL_PROJECTS : episteme, ether, swarmforge, praxis, volumen, openprimer, voynichductus, artstylometry, nisaba, eternity, nexuslayer, jrobotics, jgame, autoinsta, helloapply, univerlan, lumina, lembas)
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
const TECHNICAL_NOTE_FR = buildTailoredTechnicalNote(["openprimer", "episteme", "ether", "swarmforge", "praxis", "volumen"], "fr");
const TECHNICAL_NOTE_EN = buildTailoredTechnicalNote(["openprimer", "episteme", "ether", "swarmforge", "praxis", "volumen"], "en");

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

