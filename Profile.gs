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

// --- 4. PROMPT TONE REFERENCE (GOLD STANDARD CV TEMPLATE - 2 FULL PAGES) ---
const TONE_REFERENCE_CV_EXAMPLE = `"# ${CANDIDATE_PROFILE.fullName.toUpperCase()}
${CANDIDATE_PROFILE.location} (Mobilité régionale & Remote) | ${CANDIDATE_PROFILE.phoneInt || CANDIDATE_PROFILE.phone} | ${CANDIDATE_PROFILE.email}
LinkedIn: ${CANDIDATE_PROFILE.linkedinRaw} | GitHub: ${CANDIDATE_PROFILE.githubRaw}

## MANAGER EN TRANSFORMATION DIGITALE | ARCHITECTE SYSTÈMES & IA | LEAD DÉVELOPPEUR

Plus de 25 ans d'expérience combinant le pilotage stratégique de la transformation numérique (AMOA, direction de projets, urbanisation du SI, modernisation de legacy critique) et une expertise d'architecture logicielle distribuée et d'ingénierie augmentée par IA. Capacité démontrée à dialoguer avec les directions générales et métiers pour aligner l'IT sur la création de valeur (+400% de CA client consolidé chez Deloitte/Equitive), tout en conservant une pratique "hands-on" de haut niveau capable de concevoir, auditer et délivrer des architectures microservices, cloud-native et haute performance.

## PILIERS D'EXPERTISE & COMPÉTENCES CLÉS
- **Direction & Transformation :** AMOA & Cadrage Stratégique (alignement SI/Métier, ROI), Modernisation Legacy (audit, refonte, flux ETL, RPA), Gouvernance & Méthodes (Agile/Scrum, Cycle en V), Conformité & Risques (RGPD, cybersécurité, RH).
- **Architecture Systèmes & IA :** Systèmes Distribués (microservices, Kafka, gRPC, REST APIs), IA Agentique & LLMs (multi-agents Google Antigravity, RAG), Cloud & Hybride (GCP, AWS, Kubernetes, Docker, HA), Calcul Intensif (HPC, bas-niveau, GPU CUDA).
- **Ingénierie & Delivery :** Langages (Java 1.0 à 25+, Rust, Python, C#, SQL), Frameworks (Spring Boot 3, Javalin, Next.js 15, FastAPI), Données (PostgreSQL, Oracle 9i-19c, SQL Server), Qualité & DevOps (CI/CD GitHub Actions, TDD JUnit).

## EXPÉRIENCES PROFESSIONNELLES

### Lead Architecte & Développeur Open Source — Mécénat GitHub & Recherche Deep-Tech | Lorient (Remote) | 07/2025 - Présent
- Direction technique et architecture d'un écosystème souverain de 18 frameworks deep-tech (+1M lignes de code en Java 25, Rust, Python, TypeScript) illustrant la transformation digitale des cycles d'ingénierie par IA.
- Ingénierie augmentée par IA (Google Antigravity) : Automatisation de 80% des tests unitaires et de la documentation, division par 5 du cycle moyen de mise en production logicielle.
- HPC & Systèmes distribués massifs : Conception d'Episteme (calcul scientifique Java 25 / Panama FFM hors-heap, benchmarks 15x supérieurs aux standards Apache) et SwarmForge (simulation multi-agents 2M entités, ECS, Kubernetes, gRPC).
- Plateformes Cloud & IA Générative : Architecture d'OpenPrimer (SaaS EdTech multi-agents, inférence hybride WebLLM/Gemini 2.5, Next.js 15, Supabase RLS) et d'Ether (simulation cliodynamique multi-nœuds, Java 21 Loom, Rust FFI, Uber H3, PostGIS).
- **Environnement technique :** Google Antigravity, Java 21-25, Rust, Python, Next.js 15, Spring Boot 3, Kubernetes, Docker, gRPC, Redis, PostgreSQL.

### Spécialiste Support Informatique Senior & Expert SI Industriel — Techteam (Fives Syleps) | Lorient | 06/2024 - 07/2025
- Maintien en condition opérationnelle (MCO) et fiabilisation de plateformes logistiques automatisées et robotisées (WMS, WCS, GPAO, MES) en environnement industriel 24/7 sous flux tendus.
- Gestion d'incidents critiques & MCO : Résolution en temps réel des blocages applicatifs et bases de données (Niveaux 1 à 3), garantissant un taux de disponibilité supérieur à 99,8%.
- Modernisation de l'infrastructure & Sécurité : Audit et rationalisation des accès VPN sécurisés et du parc de virtualisation (VMware, Hyper-V), réduisant de 35% le temps moyen d'intervention de l'équipe support.
- Performance des données : Maintenance, tuning d'index et administration des bases transactionnelles à haute volumétrie (Oracle 19c, MS SQL Server) et fiabilisation des flux d'échanges SFTP industriels.
- **Environnement technique :** Windows Server, Linux/Unix, Oracle 19c, MS SQL Server, VMware, Hyper-V, SFTP, Java, .NET/C#, PL/SQL, Bash.

### Responsable IT & Chef de Projet AMOA — Equitive (Groupe Deloitte) | Lorient | 10/2012 - 11/2023 (11 ans)
- Direction de la transformation digitale et pilotage stratégique AMOA de solutions de dématérialisation RH/paie, facturation électronique et subventions (notamment pour le Ministère de la Culture).
- Impact Business & Croissance : Pilotage stratégique des projets et relation client de haut niveau ayant contribué directement à une croissance de 400% du chiffre d'affaires client consolidé sur 7 ans.
- Direction de Projets & Delivery : Encadrement d'équipes pluridisciplinaires (jusqu'à 8 ingénieurs/développeurs), cadrage des besoins, gestion budgétaire, plannings et conduite du changement en méthodes Agiles/Scrum et Cycle en V.
- Urbanisation du SI & Cloud Hybride : Modernisation globale de l'infrastructure vers un cluster haute disponibilité de plus de 100 machines virtuelles sécurisées (VMware, Hyper-V, Docker, Apache Tomcat, Jenkins, Redmine, Git).
- Automatisation des Processus (RPA & ETL) : Conception d'interfaces de données unifiées (Talend ETL, SOAP/REST, PowerShell) et d'automates RPA (UiPath) réduisant les tâches manuelles récurrentes de 80%.
- Cybersécurité & Gouvernance des Données (RGPD) : Sécurisation de bout en bout des flux (TLS/SSL) et des volumes, mise en place des politiques d'anonymisation, pseudonymisation et purge des données sensibles RH et paie.
- **Environnement technique :** Java, .NET/C#, Webdev, SQL Server, Oracle, Talend ETL, VMware, Hyper-V, Docker, Jenkins, UiPath, Redmine, Git, PowerShell, REST.

### Architecte Base de Données & Tech Leader — Hardis | Grenoble | 03/2011 - 02/2012
- Architecture et modélisation des données pour les plateformes de gestion d'assurance de Groupe Mutuel Assurances.
- Modélisation, optimisation et refonte de la base de données Oracle 11g (tuning SQL/PL-SQL, indexation).
- Architecture des flux de migration de données massives (Talend ETL) et développement des couches de persistance d'une application riche client-serveur (J2EE/RCP).
- Encadrement technique de 5 développeurs seniors : revues de code, bonnes pratiques TDD sous JUnit, intégration continue.
- **Environnement technique :** Java J2EE, Spring, Hibernate, Oracle 11g, PL/SQL, Talend ETL, JUnit, Eclipse RCP/SWT.

### Ingénieur d'Études & de Développement — HR Team (EDF / Atos Worldgrid) | Grenoble | 10/2010 - 03/2011
- Conception et optimisation de services Web transactionnels critiques (SOAP, WSDL, Spring, Hibernate) pour les flux d'énergie d'EDF.
- Rédaction des dossiers d'architecture technique (DAT), plans de tests d'intégration JUnit et maintien en condition opérationnelle (MCO).
- **Environnement technique :** Java, J2EE, Servlets, WSDL, SOAP, Spring, Hibernate, Oracle, JUnit, Eclipse.

### Ingénieur R&D & Consultant Java — Steria | Grenoble / Lille | 04/2006 - 07/2010
- Missions de conseil en architecture et développement logiciel J2EE pour grands comptes industriels.
- STMicroelectronics (Crolles 2) : Développement de services Web J2EE interfaçant en temps réel les lignes de fabrication de semi-conducteurs ; anglais technique au quotidien.
- Camaïeu : Maintenance corrective et évolutive des plateformes logistiques et gestion des stocks en temps réel (Spring, Hibernate, Oracle 10g, C3P0, EHCache).
- France Télécom & Schneider Electric : Refonte de services transactionnels clients et exécution de plans de tests industriels (Quality Center).
- **Environnement technique :** Java, J2EE, Servlets, JSP, Struts, Spring, Hibernate, Oracle 9i/10g, C3P0, EHCache, Quality Center, UML.

### Architecte Logiciel & Co-Fondateur — Projets Pionniers R&D Open Source | Grenoble / Genève | 2002 - 2008
- Initiatives fondatrices en calcul formel, robotique autonome et mondes virtuels distribués.
- jRobotics.org (2007–2008) : Co-fondateur et architecte d'un framework Java open-source (+1 000 classes) dédié au contrôle robotique temps réel et simulation 3D (Java 5 multithreadé, Java3D, TCP/IP).
- Calcul Scientifique & JSR-275 (2004–2007) : Co-fondateur et architecte d'une bibliothèque scientifique Java majeure (+5 000 classes de calcul formel et analyse dimensionnelle) en liaison étroite avec les travaux de standardisation JSR-275 (Units & Measures API).
- Digital Biosphere (2002–2003) : Conception d'un moteur de monde virtuel 3D distribué temps réel (Java, JDO, réseau UDP/TCP Multicast sécurisé SSL, VRML/X3D).
- **Environnement technique :** Java (JDK 1.1 à 5), JCP (JSR-275), JDO, Java3D, VRML/X3D, TCP/IP, UDP Multicast, SSL, Unix/Linux, Oracle, MySQL.

### Assistant R&D, Enseignement & Administrateur Systèmes — TECFA — Université de Genève | Genève (Suisse) | 1994 - 1999
- Recherche pionnière en technologies éducatives, informatique cognitive et administration d'infrastructures.
- R&D en informatique cognitive : conception d'interfaces graphiques interactives, de simulations de vie artificielle et d'environnements virtuels 3D distribués (VRML).
- Enseignement et encadrement des étudiants de 3e cycle / DESS en conception de logiciels interactifs et hypermédias.
- Administration système et réseau d'un parc hétérogène de plus de 80 serveurs et postes (Unix, Linux, SunOS, Novell, Mac, Windows), gestion de la sécurité et des services Internet pionniers.
- **Environnement technique :** Unix, Linux, SunOS, Solaris, C, C++, VRML, HTML, TCP/IP, Novell Netware.

## FORMATION & LANGUES
- **DEA Sciences Cognitives (Option Intelligence Artificielle) :** I.N.P.G Grenoble (1994, Boursier au mérite, Mention Assez Bien).
- **Certificat de Neurosciences Cognitives & DESS de Psychologie Cognitive Expérimentale :** Université de Genève (1997–1998).
- **Maîtrise d'Informatique & DEUG MASS (Mathématiques Appliquées) :** Université Joseph Fourier & UPMF Grenoble (1993).
- **Master d'Histoire (M2 Recherche, Valorisation des Savoirs Historiques & Archéologiques) :** Université de Bretagne Sud, Lorient (2025, Mention Bien).
- **Licences (L3) de Sociologie & d'Histoire de l'Art :** Universités de Toulouse Le Mirail & Grenoble UPMF (2010).
- **Langues :** Anglais (C2 - Bilingue, TOEFL 267/300), Français (C2 - Langue maternelle), Espagnol (B2 - Professionnel), Italien (B1 - Opérationnel)."`;

// Reference Standard CV Template in English (2 Full Pages)
const TONE_REFERENCE_CV_EXAMPLE_EN = `"# ${CANDIDATE_PROFILE.fullName.toUpperCase()}
${CANDIDATE_PROFILE.location} (Regional Mobility & Remote) | ${CANDIDATE_PROFILE.phoneInt || CANDIDATE_PROFILE.phone} | ${CANDIDATE_PROFILE.email}
LinkedIn: ${CANDIDATE_PROFILE.linkedinRaw} | GitHub: ${CANDIDATE_PROFILE.githubRaw}

## DIGITAL TRANSFORMATION MANAGER | SYSTEMS & AI ARCHITECT | LEAD ENGINEER

Over 25 years of experience combining the strategic steering of digital transformations (functional project management, systems urbanization, critical legacy modernization) with deep expertise in distributed software architectures and AI-augmented engineering. Demonstrated track record collaborating with executive and business leadership to align IT with value creation (+400% consolidated client revenue at Deloitte/Equitive), while maintaining high-level hands-on architectural mastery to design, audit, and ship microservices, cloud-native, and high-performance systems.

## CORE COMPETENCY PILLARS
- **Management & Transformation:** Strategic Advisory & Scoping (IT/business alignment, ROI focus), Legacy Modernization (audit, redesign, ETL pipelines, RPA), Governance & Methodologies (Agile/Scrum, V-Model), Compliance & Risk Management (GDPR, cybersecurity, HR processes).
- **Systems Architecture & AI:** Distributed Systems (microservices, Kafka, gRPC, REST APIs), Agentic AI & LLMs (Google Antigravity multi-agent systems, RAG pipelines), Cloud & Hybrid Infrastructure (GCP, AWS, Kubernetes, Docker, HA clusters), High-Performance Computing (HPC, bare-metal optimization, GPU CUDA).
- **Software Engineering & Delivery:** Languages (Java 1.0 to 25+, Rust, Python, C#, SQL), Frameworks (Spring Boot 3, Javalin, Next.js 15, FastAPI), Data & Persistence (PostgreSQL, Oracle 9i-19c, SQL Server), Quality & DevOps (CI/CD GitHub Actions, TDD with JUnit).

## PROFESSIONAL EXPERIENCE

### Lead Open-Source Architect & Senior Engineer — GitHub Sponsorship & Deep-Tech Research | Lorient (Remote) | 07/2025 - Present
- Technical direction and architecture of a sovereign 18-framework deep-tech ecosystem (+1M lines of code across Java 25, Rust, Python, TypeScript) illustrating AI-driven engineering transformation.
- AI-Augmented Engineering (Google Antigravity): Automated generation of 80% of unit/integration test suites and documentation, accelerating release cadence 5x.
- HPC & Massive Distributed Systems: Architected Episteme (Java 25 off-heap Panama FFM scientific computing, certified 15x faster than Apache Commons) and SwarmForge (massive multi-agent simulation for 2M entities, ECS, Kubernetes, gRPC).
- Cloud Platforms & Generative AI: Architected OpenPrimer (multi-agent EdTech SaaS, hybrid in-browser WebLLM/Gemini 2.5 inference, Next.js 15, Supabase RLS) and Ether (planetary cliodynamics simulation, Java 21 Loom, Rust FFI, Uber H3, PostGIS).
- **Technical Environment:** Google Antigravity, Java 21-25, Rust, Python, Next.js 15, Spring Boot 3, Kubernetes, Docker, gRPC, Redis, PostgreSQL.

### Senior IT Support Specialist & Industrial IS Expert — Techteam (Fives Syleps) | Lorient | 06/2024 - 07/2025
- Operational maintenance (MCO) and reliability engineering for automated and robotic logistics platforms (WMS, WCS, CAPM, MES) in 24/7 continuous industrial environments.
- Critical Incident Resolution: Real-time debugging of mission-critical applications and databases (Tier 1-3), maintaining operational availability above 99.8%.
- Infrastructure Modernization & Security: Audited and streamlined secure VPN access and virtual server clusters (VMware, Hyper-V), reducing mean intervention diagnostic time by 35%.
- High-Volume Data Performance: Tuning, index maintenance, and administration for high-throughput transactional databases (Oracle 19c, MS SQL Server) and industrial SFTP data flows.
- **Technical Environment:** Windows Server, Linux/Unix, Oracle 19c, MS SQL Server, VMware, Hyper-V, SFTP, Java, .NET/C#, PL/SQL, Bash.

### IT Manager & Senior Technical Project Director (AMOA) — Equitive (Deloitte Group) | Lorient | 10/2012 - 11/2023 (11 years)
- Led enterprise digital transformation initiatives and functional project management for digital dematerialization (e-invoicing, payroll, expense accounts, Ministry of Culture grants).
- Business Growth & Executive Partnership: Strategic advisory and high-level client relationship management contributing directly to a +400% consolidated client revenue increase over 7 years.
- Project Governance & Delivery: Supervised multidisciplinary engineering teams (up to 8 developers), budget management, risk governance, and change management using Agile/Scrum and V-Model.
- Enterprise IS Urbanization: Modernized legacy infrastructure into a high-availability cluster of 100+ secure virtual machines (VMware, Hyper-V, Docker, Apache Tomcat, Jenkins, Redmine, Git).
- Process Automation (RPA & ETL): Engineered unified ETL integration flows (Talend ETL, SOAP/REST, PowerShell) and RPA bots (UiPath), eliminating 80% of recurring manual operations.
- Cybersecurity & GDPR Data Governance: End-to-end transport and volume encryption (TLS/SSL), implementing strict anonymization, pseudonymization, and purge protocols for sensitive HR data.
- **Technical Environment:** Java, .NET/C#, Webdev, SQL Server, Oracle, Talend ETL, VMware, Hyper-V, Docker, Jenkins, UiPath, Redmine, Git, PowerShell, REST.

### Database Architect & Technical Team Leader — Hardis | Grenoble | 03/2011 - 02/2012
- Database architecture and relational modeling for Groupe Mutuel Assurances core insurance management platform.
- Modeled, optimized, and tuned Oracle 11g database schemas (complex SQL/PL-SQL stored procedures, execution plan indexing).
- Designed massive ETL migration pipelines (Talend) and developed persistence layers for a large-scale J2EE Eclipse RCP client-server application.
- Provided technical leadership for 5 senior software engineers: code reviews, TDD practices under JUnit, and continuous integration.
- **Technical Environment:** Java, J2EE, Spring, Hibernate, Oracle 11g, PL/SQL, Talend ETL, JUnit, Eclipse RCP/SWT.

### Systems Study & Software Engineer — HR Team (EDF / Atos Worldgrid) | Grenoble | 10/2010 - 03/2011
- Designed and optimized mission-critical transactional J2EE web services (SOAP, WSDL, Spring, Hibernate) for EDF energy distribution streams.
- Authored technical architecture dossiers (DAT), comprehensive JUnit integration test suites, and operational runbooks.
- **Technical Environment:** Java, J2EE, Servlets, WSDL, SOAP, Spring, Hibernate, Oracle, JUnit, Eclipse.

### R&D Software Engineer & Java Consultant — Steria | Grenoble / Lille | 04/2006 - 07/2010
- J2EE architectural consulting and engineering for major industrial and telecom accounts.
- STMicroelectronics (Crolles 2): Developed J2EE web services interfacing live microchip fabrication cleanrooms; bilingual technical delivery.
- Camaïeu: Corrective and evolutionary maintenance for real-time inventory and supply-chain platforms (Spring, Hibernate, Oracle 10g, C3P0, EHCache).
- France Télécom & Schneider Electric: Refactored customer CRM services and executed industrial acceptance testing suites (Quality Center).
- **Technical Environment:** Java, J2EE, Servlets, JSP, Struts, Spring, Hibernate, Oracle 9i/10g, C3P0, EHCache, Quality Center, UML.

### Software Architect & Co-Founder — Pioneer Open-Source R&D Initiatives | Grenoble / Geneva | 2002 - 2008
- Foundational deep-tech initiatives across symbolic computing, autonomous robotics, and distributed virtual worlds.
- jRobotics.org (2007–2008): Co-founded and architected an open-source Java framework (1,000+ classes) for real-time robotics control and 3D physics (Java 5 multithreaded, Java3D, TCP/IP).
- Scientific Computing & JSR-275 (2004–2007): Co-founded a major scientific Java library (+5,000 classes for dimensional analysis and symbolic computing) collaborating with official Java Community Process standards (JSR-275: Units & Measures API).
- Digital Biosphere (2002–2003): Architected a real-time distributed 3D virtual world engine (Java, JDO, asynchronous UDP/TCP SSL Multicast networking, VRML/X3D).
- **Technical Environment:** Java (JDK 1.1 to 5), JCP (JSR-275), JDO, Java3D, VRML/X3D, TCP/IP, UDP Multicast, SSL, Unix/Linux, Oracle, MySQL.

### Research & Teaching Assistant, Systems Administrator — TECFA — University of Geneva | Geneva (Switzerland) | 1994 - 1999
- Pioneer research in educational technologies, cognitive informatics, and systems infrastructure administration.
- Cognitive Informatics R&D: Designed interactive graphical interfaces, artificial life simulations, and 3D distributed virtual collaborative spaces (VRML).
- Teaching and supervising postgraduate master students in interactive hypermedia software engineering.
- Systems and network administration for 80+ heterogeneous Unix, Linux, SunOS, Novell, Mac, and Windows servers and workstations; managed pioneer web/intranet security.
- **Technical Environment:** Unix, Linux, SunOS, Solaris, C, C++, VRML, HTML, TCP/IP, Novell Netware.

## EDUCATION & LANGUAGES
- **M.Sc. (DEA) in Cognitive Sciences & Artificial Intelligence:** I.N.P.G Grenoble (1994, Research Fellowship, Honors).
- **Certificate in Cognitive Neurosciences & DESS (M.Sc.) in Experimental Cognitive Psychology:** University of Geneva (1997–1998).
- **Master of Computer Science (Maîtrise) & DEUG MASS (Applied Mathematics):** Université Joseph Fourier & UPMF Grenoble (1993).
- **Master of History (M2 Research, Historical & Archaeological Data Valorization):** Université de Bretagne Sud, Lorient (2025, Honors).
- **B.Sc. (Licences L3) in Sociology & Art History:** Universities of Toulouse Le Mirail & Grenoble UPMF (2010).
- **Languages:** English (C2 - Bilingual, TOEFL 267/300), French (C2 - Native), Spanish (B2 - Professional), Italian (B1 - Conversational)."`;

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

// --- 6. FONCTION DE CONSTRUCTION DYNAMIQUE DE LA NOTE TECHNIQUE (MODÈLE 2 PAGES / PROJETS 1-8) ---
/**
 * Assemble à la volée une Note de Réalisation Technique ciblée en Français ou en Anglais (2 pages complètes).
 * Calibrée sur le modèle 4 pages (2 pages CV + 2 pages Note Technique) :
 * - Page 3 (Partie 1) : En-tête, Cadrage Stratégique et Projets 1 à 4 (OpenPrimer, HelloApply, Episteme, SwarmForge)
 * - ---pagebreak---
 * - Page 4 (Partie 2) : Projets 5 à 8 (Ether, NexusLayer, Praxis, Volumen) et Synthèse de Valeur Ajoutée (2 piliers)
 * 
 * @param {string[]} projectKeys Liste des clés de projets à inclure (par défaut les 8 projets majeurs)
 * @param {string} lang "fr" ou "en"
 * @param {string} targetTitle Titre cible personnalisé
 * @param {string} customExpertise Phrase d'expertise clé ciblée
 * @returns {string} Markdown complet de la note technique sur 2 pages
 */
function buildTailoredTechnicalNote(projectKeys, lang = "fr", targetTitle = null, customExpertise = null) {
  const isEn = (lang || "").toLowerCase().startsWith("en");
  
  // Clés par défaut : sélection des 8 projets majeurs calibrés pour 2 pages (4 projets par page)
  const default8Keys = ["openprimer", "helloapply", "episteme", "swarmforge", "ether", "nexuslayer", "praxis", "volumen"];
  const keysToUse = (projectKeys && projectKeys.length > 0) 
    ? projectKeys 
    : default8Keys;
  
  const headerName = CANDIDATE_PROFILE.fullName.toUpperCase();
  const phoneStr = isEn ? (CANDIDATE_PROFILE.phoneInt || CANDIDATE_PROFILE.phone) : (CANDIDATE_PROFILE.phone || CANDIDATE_PROFILE.phoneInt);
  const defaultTitle = isEn 
    ? "Digital Transformation Manager | Systems & AI Architect | Lead Engineer" 
    : "Manager en Transformation Digitale | Architecte Systèmes & IA | Lead Développeur";
  const finalTitle = targetTitle || defaultTitle;
  
  // ==========================================
  // PAGE 3 (PARTIE 1 / PART 1) : PROJETS 1 À 4
  // ==========================================
  let md = `# ${headerName}\n`;
  md += `${CANDIDATE_PROFILE.location} | ${phoneStr} | ${CANDIDATE_PROFILE.email}\n`;
  md += `LinkedIn: ${CANDIDATE_PROFILE.linkedinUrl} | GitHub: ${CANDIDATE_PROFILE.githubUrl}\n\n`;

  if (isEn) {
    md += `## TECHNICAL BACKGROUND BRIEF & PROJECT PORTFOLIO\n`;
    md += `**COMPLEX SYSTEMS, DIGITAL TRANSFORMATION & SOFTWARE ENGINEERING**\n`;
    md += `Technical Dossier for the attention of Executive Boards, Chief Technology Officers (CTO) and Recruiters\n`;
    md += `Candidate: **${CANDIDATE_PROFILE.fullName}** – ${finalTitle}\n\n`;
    md += `> **Strategic & Operational Scope:** This dossier presents a curated portfolio of landmark projects illustrating the ability to *architect enduring software systems, steer high-stakes digital transformations, and industrialize next-generation agentic AI*. These achievements materialize the synergy between executive architectural vision and rigorous hands-on engineering execution.\n\n`;
    md += `## SELECTED LANDMARK ENGINEERING PROJECTS (PART 1)\n\n`;
  } else {
    md += `## NOTE DE RÉALISATION TECHNIQUE & PORTFOLIO PROJETS\n`;
    md += `**SYSTÈMES COMPLEXES, TRANSFORMATION DIGITALE & INGÉNIERIE LOGICIELLE**\n`;
    md += `Dossier technique de référence destiné aux Directions Générales, Directeurs Techniques (CTO) et Recruteurs\n`;
    md += `Candidat : **${CANDIDATE_PROFILE.fullName}** – ${finalTitle}\n\n`;
    md += `> **Cadrage Stratégique & Opérationnel :** Cette note présente une sélection de projets majeurs démontrant la capacité à *concevoir des architectures logicielles pérennes, à piloter la transformation digitale des processus métiers et à industrialiser l'IA de nouvelle génération*. Ces réalisations concrétisent l'alliance entre vision managériale amont et rigueur d'ingénierie logicielle hands-on.\n\n`;
    md += `## SÉLECTION DE RÉALISATIONS TECHNIQUES CLÉS (PARTIE 1)\n\n`;
  }

  // Injecter la première moitié des projets (jusqu'à 4 projets sur la première page de la note)
  const part1Count = Math.min(4, Math.ceil(keysToUse.length / 2));
  const part1Keys = keysToUse.slice(0, part1Count);
  const part2Keys = keysToUse.slice(part1Count);

  let projectIndex = 1;
  part1Keys.forEach(k => {
    const proj = MASTER_TECHNICAL_PROJECTS[k.toLowerCase()];
    if (proj) {
      const pTitle = isEn ? proj.titleEn : proj.titleFr;
      const pSummary = isEn ? proj.summaryEn : proj.summaryFr;
      const pDetails = isEn ? proj.detailsEn : proj.detailsFr;
      const stackLabel = isEn ? "Stack:" : "Stack :";
      const tagsStr = (proj.tags && proj.tags.length > 0) ? `**${stackLabel}** ${proj.tags.join(" • ")}\n` : "";
      
      md += `### ${projectIndex}. ${pTitle}\n`;
      if (tagsStr) md += `${tagsStr}`;
      md += `${pSummary}\n`;
      md += `${pDetails}\n\n`;
      projectIndex++;
    }
  });

  // ==========================================
  // PAGE 4 (PARTIE 2 / PART 2) : PROJETS 5 À 8 + SYNTHÈSE DE VALEUR
  // ==========================================
  md += `---pagebreak---\n\n`;

  if (isEn) {
    md += `## SELECTED LANDMARK ENGINEERING PROJECTS (PART 2)\n\n`;
  } else {
    md += `## SÉLECTION DE RÉALISATIONS TECHNIQUES CLÉS (PARTIE 2)\n\n`;
  }

  part2Keys.forEach(k => {
    const proj = MASTER_TECHNICAL_PROJECTS[k.toLowerCase()];
    if (proj) {
      const pTitle = isEn ? proj.titleEn : proj.titleFr;
      const pSummary = isEn ? proj.summaryEn : proj.summaryFr;
      const pDetails = isEn ? proj.detailsEn : proj.detailsFr;
      const stackLabel = isEn ? "Stack:" : "Stack :";
      const tagsStr = (proj.tags && proj.tags.length > 0) ? `**${stackLabel}** ${proj.tags.join(" • ")}\n` : "";
      
      md += `### ${projectIndex}. ${pTitle}\n`;
      if (tagsStr) md += `${tagsStr}`;
      md += `${pSummary}\n`;
      md += `${pDetails}\n\n`;
      projectIndex++;
    }
  });

  // Synthèse de valeur ajoutée à double pilier (Management & Stratégie + Architecture & Qualité)
  if (isEn) {
    md += `## CROSS-FUNCTIONAL EXPERTISE DELIVERABLE TO YOUR ORGANIZATION\n\n`;
    md += `### Management, Strategy & Transformation\n`;
    md += `- **Technical Leadership & Business Vision**: Proven ability to articulate complex technical challenges to C-level executives and translate business goals into pragmatic, profitable architecture roadmaps.\n`;
    md += `- **Enterprise Urbanization & Legacy De-risking**: Extensive track record in progressively modernizing legacy monoliths, establishing integration mediation layers (APIs, ETL, RPA) with zero operational disruption.\n`;
    md += `- **Operational Excellence & Change Management**: Rigorous ROI culture, pragmatic Agile implementation, and empathetic mentorship elevating software engineering teams.\n\n`;
    md += `### Architecture, AI & Engineering Discipline\n`;
    md += `- **Engineering Rigor & Sovereignty**: Systematic application of modern software quality standards (TDD, >80% test coverage, continuous integration, decoupled clean architecture).\n`;
    md += `- **Industrialization of Generative AI**: Operational mastery of multi-agent workflows, RAG pipelines, and LLM/SLM integration to automate business workflows and multiply developer velocity.\n`;
    md += `- **High-Performance & FinOps**: Strict optimization of cloud infrastructure and inference costs, designing fault-tolerant high-availability architectures with compact memory footprints.\n\n`;
    md += `*Complete portfolio, references, source code repositories, and interactive demos available upon request.*`;
  } else {
    md += `## SYNTHÈSE DE VALEUR AJOUTÉE POUR VOTRE ORGANISATION\n\n`;
    md += `### Management, Stratégie & Transformation\n`;
    md += `- **Leadership Technique & Vision Métier** : Capacité à vulgariser les enjeux techniques auprès des comités exécutifs et à traduire les objectifs business en feuilles de route d'architecture pragmatiques et rentables.\n`;
    md += `- **Urbanisation du SI & Dé-risquage du Legacy** : Expérience confirmée dans la modernisation progressive de systèmes patrimoniaux complexes, la mise en place d'architectures de médiation (APIs, ETL, RPA) sans rupture de service.\n`;
    md += `- **Excellence Opérationnelle & Conduite du Changement** : Culture de la mesure du ROI, mise en œuvre de méthodologies Agiles adaptées, tutorat bienveillant et montée en compétences des équipes.\n\n`;
    md += `### Architecture, IA & Qualité d'Ingénierie\n`;
    md += `- **Rigueur d'Ingénierie & Souveraineté** : Application systématique des standards de qualité logicielle (TDD, couverture de tests >80%, intégration continue, architecture propre sans dépendances superflues).\n`;
    md += `- **Industrialisation de l'IA Générative** : Maîtrise opérationnelle des architectures multi-agents, pipelines RAG et intégration des LLMs/SLMs pour automatiser les processus métiers et décupler la productivité.\n`;
    md += `- **Haute Performance & FinOps** : Optimisation fine des coûts d'infrastructure cloud et d'inférence IA, conception d'architectures résilientes à haute disponibilité et faible empreinte mémoire.\n\n`;
    md += `*Dossier complet, références détaillées, dépôts de code source et démonstrations interactives disponibles sur demande.*`;
  }

  return md;
}

// Master Notes de référence complètes sur 2 pages (8 projets majeurs + Synthèse de valeur)
const TECHNICAL_NOTE_FR = buildTailoredTechnicalNote(["openprimer", "helloapply", "episteme", "swarmforge", "ether", "nexuslayer", "praxis", "volumen"], "fr");
const TECHNICAL_NOTE_EN = buildTailoredTechnicalNote(["openprimer", "helloapply", "episteme", "swarmforge", "ether", "nexuslayer", "praxis", "volumen"], "en");

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

