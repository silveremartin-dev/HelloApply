#set page(
  paper: "a4",
  margin: (top: 1.6cm, bottom: 1.3cm, left: 1.25cm, right: 1.25cm),
  header: context {
    let page_num = counter(page).get().first()
    if page_num > 1 {
      grid(
        columns: (4fr, 1fr),
        align: (left, right),
        text(size: 7.8pt, fill: rgb("#64748b"), font: "Segoe UI")[
          #if page_num <= 2 [
            *Silvère Martin-Michiellot* — Manager en Transformation Digitale | Architecte Systèmes & IA | Lead Développeur
          ] else [
            *Silvère Martin-Michiellot* — Note de Réalisation Technique & Portfolio Projets
          ]
        ],
        text(size: 7.8pt, fill: rgb("#94a3b8"), font: "Segoe UI")[
          Dossier Professionnel
        ]
      )
      v(-0.25em)
      line(length: 100%, stroke: 0.4pt + rgb("#cbd5e1"))
    }
  },
  footer: context {
    let page_num = counter(page).get().first()
    line(length: 100%, stroke: 0.4pt + rgb("#cbd5e1"))
    v(-0.25em)
    grid(
      columns: (4fr, 1fr),
      align: (left, right),
      text(size: 7.8pt, fill: rgb("#64748b"), font: "Segoe UI")[
        #if page_num <= 2 [
          *Curriculum Vitæ* — Silvère Martin-Michiellot (Management • Architecture • Ingénierie)
        ] else [
          *Note de Réalisation Technique* — Annexe Projets & Capacités Opérationnelles
        ]
      ],
      text(size: 7.8pt, fill: rgb("#475569"), font: "Segoe UI")[
        *Page #page_num sur 4*
      ]
    )
  }
)

#set text(
  font: ("Segoe UI", "Calibri", "Arial", "Liberation Sans"),
  size: 8.7pt,
  lang: "fr",
  fill: rgb("#1e293b")
)

#set par(justify: true, leading: 0.42em)

// Style des liens cliquables
#show link: set text(fill: rgb("#0284c7"))

// Helpers CV
#let section-title(title) = {
  v(0.35em)
  block(width: 100%)[
    #text(size: 10pt, weight: "bold", fill: rgb("#0f172a"), font: "Segoe UI")[#upper(title)]
    #v(-0.35em)
    #line(length: 100%, stroke: 1.15pt + rgb("#0284c7"))
  ]
  v(0.08em)
}

#let exp-header(role, company, location, dates) = {
  v(0.28em)
  grid(
    columns: (1fr, auto),
    align: (left, right),
    [
      #text(weight: "bold", size: 9.1pt, fill: rgb("#0f172a"))[#role]
      #text(fill: rgb("#334155"))[ — *#company*]
      #if location != "" [ #text(size: 7.8pt, fill: rgb("#64748b"))[(#location)] ]
    ],
    [
      #text(size: 8.4pt, weight: "bold", fill: rgb("#0284c7"))[#dates]
    ]
  )
  v(0.06em)
}

// Helper Projets Note Technique (Pages 3 & 4)
#let project-card(title, tags, summary, bullets) = {
  v(0.35em)
  rect(
    width: 100%,
    fill: rgb("#f8fafc"),
    stroke: (left: 3pt + rgb("#0284c7"), rest: 0.4pt + rgb("#e2e8f0")),
    radius: (right: 2pt),
    inset: (x: 8.5pt, y: 5.5pt)
  )[
    #text(weight: "bold", size: 9.0pt, fill: rgb("#0f172a"))[#title] \
    #v(-0.25em)
    #text(size: 7.4pt, fill: rgb("#0369a1"), weight: "medium")[Stack : #tags.join(" • ")]
    #v(0.12em)
    #text(size: 8.4pt, fill: rgb("#334155"))[#summary]
    #v(0.12em)
    #for b in bullets [
      #grid(
        columns: (8pt, 1fr),
        text(fill: rgb("#0284c7"), size: 8pt)[•],
        text(size: 8.3pt, fill: rgb("#1e293b"))[#b]
      )
      #v(0.08em)
    ]
  ]
}

// ==========================================
// PAGE 1 : CV - IDENTITÉ, PROFIL & EXPÉRIENCES RÉCENTES (EQUITIVE INCLUSE)
// ==========================================

#align(center)[
  #text(size: 16pt, weight: "bold", fill: rgb("#0f172a"))[SILVÈRE MARTIN-MICHIELLOT] \
  #v(0.12em)
  #text(size: 10.2pt, weight: "bold", fill: rgb("#0284c7"))[
    MANAGER EN TRANSFORMATION DIGITALE | ARCHITECTE SYSTÈMES & IA | LEAD DÉVELOPPEUR
  ] \
  #v(0.18em)
  #text(size: 8.4pt, fill: rgb("#475569"))[
    Lorient, France (Mobilité régionale & Remote) | #link("tel:+33767815202")[07 67 81 52 02] | #link("mailto:silvere.martin@gmail.com")[silvere.martin\@gmail.com] \
    LinkedIn : #link("https://www.linkedin.com/in/silvere-martin-michiellot")[linkedin.com/in/silvere-martin-michiellot] | GitHub : #link("https://github.com/silveremartin-dev")[github.com/silveremartin-dev]
  ]
]

#v(0.15em)

#rect(
  width: 100%,
  fill: rgb("#f1f5f9"),
  stroke: (left: 3pt + rgb("#0284c7")),
  radius: (right: 2pt),
  inset: (x: 8.5pt, y: 5pt)
)[
  #text(size: 8.5pt, fill: rgb("#0f172a"))[
    Plus de 25 ans d'expérience combinant le *pilotage stratégique de la transformation numérique* (AMOA, direction de projets, urbanisation du SI, modernisation de legacy critique) et une *expertise d'architecture logicielle distribuée et d'ingénierie augmentée par IA*. Capacité démontrée à dialoguer avec les directions générales et métiers pour aligner l'IT sur la création de valeur (*+400% de CA client consolidé* chez Deloitte/Equitive), tout en conservant une pratique "hands-on" de haut niveau capable de concevoir, auditer et délivrer des architectures microservices, cloud-native et haute performance.
  ]
]

#section-title("Piliers d'Expertise & Compétences Clés")

#grid(
  columns: (1fr, 1fr, 1fr),
  gutter: 7pt,
  [
    #block(fill: rgb("#f8fafc"), stroke: 0.5pt + rgb("#cbd5e1"), inset: 5pt, radius: 2pt, width: 100%)[
      #text(weight: "bold", size: 8.6pt, fill: rgb("#0f172a"))[Direction & Transformation]
      #v(0.15em)
      - *AMOA & Cadrage Stratégique* : alignement SI/Métier, ROI.
      - *Modernisation Legacy* : audit, refonte, flux ETL, RPA.
      - *Gouvernance & Méthodes* : Agile/Scrum, Cycle en V.
      - *Conformité & Risques* : RGPD, cybersécurité, RH.
    ]
  ],
  [
    #block(fill: rgb("#f8fafc"), stroke: 0.5pt + rgb("#cbd5e1"), inset: 5pt, radius: 2pt, width: 100%)[
      #text(weight: "bold", size: 8.6pt, fill: rgb("#0f172a"))[Architecture Systèmes & IA]
      #v(0.15em)
      - *Systèmes Distribués* : microservices, Kafka, gRPC, REST.
      - *IA Agentique & LLMs* : multi-agents (Antigravity), RAG.
      - *Cloud & Hybride* : GCP, AWS, Kubernetes, Docker, HA.
      - *Calcul Intensif (HPC)* : bas-niveau, GPU (CUDA).
    ]
  ],
  [
    #block(fill: rgb("#f8fafc"), stroke: 0.5pt + rgb("#cbd5e1"), inset: 5pt, radius: 2pt, width: 100%)[
      #text(weight: "bold", size: 8.6pt, fill: rgb("#0f172a"))[Ingénierie & Delivery]
      #v(0.15em)
      - *Langages* : Java (1.0 à 25+), Rust, Python, C\#, SQL.
      - *Frameworks* : Spring Boot 3, Javalin, Next.js 15, FastAPI.
      - *Données* : PostgreSQL, Oracle (9i-19c), SQL Server.
      - *Qualité & DevOps* : CI/CD (GitHub Actions), TDD.
    ]
  ]
)

#section-title("Expériences Professionnelles (1/2)")

#exp-header(
  "Lead Architecte & Développeur Open Source",
  "Mécénat GitHub & Recherche Deep-Tech",
  "Lorient (Remote)",
  "07/2025 - Présent"
)
#text(size: 8.5pt)[
  Direction technique et architecture d'un écosystème souverain de 18 frameworks deep-tech (+1M lignes de code en Java 25, Rust, Python, TypeScript) illustrant la transformation digitale des cycles d'ingénierie par IA :
]
- *Ingénierie augmentée par IA (Google Antigravity)* : Automatisation de 80% des tests unitaires et de la documentation, division par 5 du cycle moyen de mise en production logicielle.
- *HPC & Systèmes distribués massifs* : Conception d'*Episteme* (calcul scientifique Java 25 / Panama FFM hors-heap, benchmarks 15x supérieurs aux standards Apache) et *SwarmForge* (simulation multi-agents 2M entités, ECS, Kubernetes, gRPC).
- *Plateformes Cloud & IA Générative* : Architecture d'*OpenPrimer* (SaaS EdTech multi-agents, inférence hybride WebLLM/Gemini 2.5, Next.js 15, Supabase RLS) et d'*Ether* (simulation cliodynamique multi-nœuds, Java 21 Loom, Rust FFI, Uber H3, PostGIS).
- *Environnement :* Google Antigravity, Java 21-25, Rust, Python, Next.js 15, Spring Boot 3, Kubernetes, Docker, gRPC, Redis, PostgreSQL.

#exp-header(
  "Spécialiste Support Informatique Senior & Expert SI Industriel",
  "Techteam (Fives Syleps)",
  "Lorient",
  "06/2024 - 07/2025"
)
#text(size: 8.5pt)[
  Maintien en condition opérationnelle (MCO) et fiabilisation de plateformes logistiques automatisées et robotisées (WMS, WCS, GPAO, MES) en environnement industriel 24/7 sous flux tendus :
]
- *Gestion d'incidents critiques & MCO* : Résolution en temps réel des blocages applicatifs et bases de données (Niveaux 1 à 3), garantissant un taux de disponibilité supérieur à 99,8%.
- *Modernisation de l'infrastructure & Sécurité* : Audit et rationalisation des accès VPN sécurisés et du parc de virtualisation (VMware, Hyper-V), réduisant de *35% le temps moyen d'intervention* de l'équipe support.
- *Performance des données* : Maintenance, tuning d'index et administration des bases transactionnelles à haute volumétrie (Oracle 19c, MS SQL Server) et fiabilisation des flux d'échanges SFTP industriels.
- *Environnement :* Windows Server, Linux/Unix, Oracle 19c, MS SQL Server, VMware, Hyper-V, SFTP, Java, .NET/C\#, PL/SQL, Bash.

#exp-header(
  "Responsable IT & Chef de Projet AMOA",
  "Equitive (Groupe Deloitte)",
  "Lorient",
  "10/2012 - 11/2023 (11 ans)"
)
#text(size: 8.5pt)[
  Direction de la transformation digitale et pilotage stratégique AMOA de solutions de dématérialisation RH/paie, facturation électronique et subventions (notamment pour le Ministère de la Culture) :
]
- *Impact Business & Croissance* : Pilotage stratégique des projets et relation client de haut niveau ayant contribué directement à une *croissance de 400% du chiffre d'affaires client consolidé* sur 7 ans.
- *Direction de Projets & Delivery* : Encadrement d'équipes pluridisciplinaires (jusqu'à 8 ingénieurs/développeurs), cadrage des besoins, gestion budgétaire, plannings et conduite du changement en méthodes Agiles/Scrum et Cycle en V.
- *Urbanisation du SI & Cloud Hybride* : Modernisation globale de l'infrastructure vers un cluster haute disponibilité de plus de *100 machines virtuelles sécurisées* (VMware, Hyper-V, Docker, Apache Tomcat, Jenkins, Redmine, Git).
- *Automatisation des Processus (RPA & ETL)* : Conception d'interfaces de données unifiées (Talend ETL, SOAP/REST, PowerShell) et d'automates RPA (UiPath) *réduisant les tâches manuelles récurrentes de 80%*.
- *Cybersécurité & Gouvernance des Données (RGPD)* : Sécurisation de bout en bout des flux (TLS/SSL) et des volumes, mise en place des politiques d'anonymisation, pseudonymisation et purge des données sensibles RH et paie.
- *Environnement :* Java, .NET/C\#, Webdev, SQL Server, Oracle, Talend ETL, VMware, Hyper-V, Docker, Jenkins, UiPath, Redmine, Git, PowerShell, REST.

#v(1fr)

#pagebreak()

// ==========================================
// PAGE 2 : CV - EXPÉRIENCES ANTERIEURES, FORMATION & LANGUES
// ==========================================

#v(0.3em)

#section-title("Expériences Professionnelles (2/2 - Suite)")

#exp-header(
  "Architecte Base de Données & Tech Leader",
  "Hardis",
  "Grenoble",
  "03/2011 - 02/2012"
)
#text(size: 8.6pt)[
  Architecture et modélisation des données pour les plateformes de gestion d'assurance :
]
- Modélisation, optimisation et refonte de la base de données Oracle 11g (tuning SQL/PL-SQL, indexation) pour le compte de *Groupe Mutuel Assurances*.
- Architecture des flux de migration de données massives (Talend ETL) et développement des couches de persistance d'une application riche client-serveur (J2EE/RCP).
- Encadrement technique de *5 développeurs seniors* : revues de code, bonnes pratiques TDD sous JUnit, intégration continue.
- *Environnement :* Java J2EE, Spring, Hibernate, Oracle 11g, PL/SQL, Talend ETL, JUnit, Eclipse RCP/SWT.

#exp-header(
  "Ingénieur d'Études & de Développement",
  "HR Team (EDF / Atos Worldgrid)",
  "Grenoble",
  "10/2010 - 03/2011"
)
#text(size: 8.6pt)[
  Conception et optimisation de services Web transactionnels critiques pour le secteur de l'énergie :
]
- Conception et optimisation de services Web J2EE transactionnels critiques (SOAP, WSDL, Spring, Hibernate) pour les flux d'énergie d'*EDF*.
- Rédaction des dossiers d'architecture technique (DAT), plans de tests d'intégration JUnit et maintien en condition opérationnelle (MCO).
- *Environnement :* Java, J2EE, Servlets, WSDL, SOAP, Spring, Hibernate, Oracle, JUnit, Eclipse.

#exp-header(
  "Ingénieur R&D & Consultant Java",
  "Steria",
  "Grenoble / Lille",
  "04/2006 - 07/2010"
)
#text(size: 8.6pt)[
  Missions de conseil en architecture et développement logiciel J2EE pour grands comptes industriels :
]
- *STMicroelectronics (Crolles 2)* : Développement de services Web J2EE interfaçant en temps réel les lignes de fabrication de semi-conducteurs ; anglais technique au quotidien.
- *Camaïeu* : Maintenance corrective et évolutive des plateformes logistiques et gestion des stocks en temps réel (Spring, Hibernate, Oracle 10g, C3P0, EHCache).
- *France Télécom & Schneider Electric* : Refonte de services transactionnels clients et exécution de plans de tests industriels (Quality Center).
- *Environnement :* Java, J2EE, Servlets, JSP, Struts, Spring, Hibernate, Oracle 9i/10g, C3P0, EHCache, Quality Center, UML.

#exp-header(
  "Architecte Logiciel & Co-Fondateur",
  "Projets Pionniers R&D Open Source",
  "Grenoble / Genève",
  "2002 - 2008"
)
#text(size: 8.6pt)[
  Initiatives fondatrices en calcul formel, robotique autonome et mondes virtuels distribués :
]
- *jRobotics.org (2007–2008)* : Co-fondateur et architecte d'un framework Java open-source (+1 000 classes) dédié au contrôle robotique temps réel et simulation 3D (Java 5 multithreadé, Java3D, TCP/IP).
- *Calcul Scientifique & JSR-275 (2004–2007)* : Co-fondateur et architecte d'une bibliothèque scientifique Java majeure (+5 000 classes de calcul formel et analyse dimensionnelle) en liaison étroite avec les travaux de standardisation JSR-275 (Units & Measures API).
- *Digital Biosphere (2002–2003)* : Conception d'un moteur de monde virtuel 3D distribué temps réel (Java, JDO, réseau UDP/TCP Multicast sécurisé SSL, VRML/X3D).
- *Environnement :* Java (JDK 1.1 à 5), JDO, Java3D, VRML/X3D, TCP/IP, UDP Multicast, SSL, Unix/Linux, Oracle, MySQL.

#exp-header(
  "Assistant R&D, Enseignement & Administrateur Systèmes",
  "TECFA — Université de Genève",
  "Genève (Suisse)",
  "1994 - 1999"
)
#text(size: 8.6pt)[
  Recherche pionnière en technologies éducatives, informatique cognitive et administration d'infrastructures :
]
- R&D en informatique cognitive et technologies éducatives : conception d'interfaces graphiques interactives, de simulations de vie artificielle et d'environnements virtuels 3D distribués (VRML).
- Enseignement et encadrement des étudiants de 3e cycle / DESS en conception de logiciels interactifs et hypermédias.
- Administration système et réseau d'un parc hétérogène de *plus de 80 serveurs et postes* (Unix, Linux, SunOS, Novell, Mac, Windows), gestion de la sécurité et des services Internet/Intranet pionniers du web.
- *Environnement :* Unix, Linux, SunOS, Solaris, C, C++, VRML, HTML, TCP/IP, Novell Netware.

#section-title("Formation Académique & Diplômes")

#grid(
  columns: (1fr, 1fr),
  gutter: 14pt,
  [
    #block(fill: rgb("#f8fafc"), stroke: 0.5pt + rgb("#cbd5e1"), inset: 6pt, radius: 2pt, width: 100%)[
      #text(weight: "bold", size: 8.6pt, fill: rgb("#0f172a"))[Diplômes Scientifiques & Informatique]
      #v(0.15em)
      - *DEA Sciences Cognitives (Option IA)* \
        #text(size: 7.9pt, fill: rgb("#475569"))[I.N.P.G Grenoble (1994) — Boursier au mérite, Mention Assez Bien.]
      - *Certificat Neurosciences & DESS Psychologie* \
        #text(size: 7.9pt, fill: rgb("#475569"))[Université de Genève (1997–1998).]
      - *Maîtrise Informatique & DEUG MASS (Maths)* \
        #text(size: 7.9pt, fill: rgb("#475569"))[Université Joseph Fourier & UPMF Grenoble (1993).]
    ]
  ],
  [
    #block(fill: rgb("#f8fafc"), stroke: 0.5pt + rgb("#cbd5e1"), inset: 6pt, radius: 2pt, width: 100%)[
      #text(weight: "bold", size: 8.6pt, fill: rgb("#0f172a"))[Humanités, Recherche & Langues]
      #v(0.15em)
      - *Master 2 Recherche Histoire (Valorisation)* \
        #text(size: 7.9pt, fill: rgb("#475569"))[Université Bretagne Sud (2025) — Mention Bien.]
      - *Licences (L3) Sociologie & Histoire Art* \
        #text(size: 7.9pt, fill: rgb("#475569"))[Universités de Toulouse & Grenoble (2010).]
      - *Langues* : *Anglais C2 Bilingue* (TOEFL 267/300) | *Français Langue maternelle* | Espagnol B2 | Italien B1
    ]
  ]
)

#v(1fr)

#pagebreak()

// ==========================================
// PAGE 3 : NOTE TECHNIQUE (PROJETS 1 À 4)
// ==========================================

#v(0.2em)

#align(center)[
  #text(size: 14pt, weight: "bold", fill: rgb("#0f172a"))[NOTE DE RÉALISATION TECHNIQUE & PORTFOLIO PROJETS] \
  #v(0.1em)
  #text(size: 9.8pt, weight: "bold", fill: rgb("#0284c7"))[
    SYSTÈMES COMPLEXES, TRANSFORMATION DIGITALE & INGÉNIERIE LOGICIELLE
  ] \
  #v(0.15em)
  #text(size: 8.2pt, fill: rgb("#475569"))[
    Dossier technique de référence destiné aux Directions Générales, Directeurs Techniques (CTO) et Recruteurs \
    Candidat : *Silvère Martin-Michiellot* | #link("tel:+33767815202")[07 67 81 52 02] | #link("mailto:silvere.martin@gmail.com")[silvere.martin\@gmail.com] | #link("https://github.com/silveremartin-dev")[github.com/silveremartin-dev]
  ]
]

#v(0.15em)

#rect(
  width: 100%,
  fill: rgb("#f1f5f9"),
  stroke: (left: 3pt + rgb("#0f172a")),
  radius: (right: 2pt),
  inset: (x: 8.5pt, y: 5pt)
)[
  #text(size: 8.3pt, fill: rgb("#0f172a"))[
    *Cadrage Stratégique & Opérationnel :* Cette note présente une sélection de projets majeurs démontrant la capacité à *concevoir des architectures logicielles pérennes, à piloter la transformation digitale des processus métiers et à industrialiser l'IA de nouvelle génération*. Ces réalisations concrétisent l'alliance entre vision managériale amont et rigueur d'ingénierie logicielle hands-on.
  ]
]

#section-title("Sélection de Réalisations Techniques Clés (Partie 1)")

#project-card(
  "1. OPENPRIMER : Plateforme SaaS EdTech & Orchestration Multi-Agents",
  ("GenAI", "LLMOps", "Next.js 15", "Supabase RLS", "Gemini 2.5", "WebLLM", "Docker"),
  "Conception et déploiement d'une plateforme d'université numérique autonome générant des cursus interactifs complets (42 disciplines, 10 niveaux).",
  (
    [*Architecture IA Agentique & FinOps* : Orchestrateur multi-agents sous API Gemini 2.5 avec pipeline multilingue dynamique (FR, EN, ES, DE, ZH), inférence locale WebLLM dans le navigateur pour minimiser les coûts d'appel cloud, et bascule transparente.],
    [*Sécurité d'Entreprise & Résilience* : Isolation stricte des données par Row-Level Security (RLS) PostgreSQL/Supabase, validation formelle Zod, rate limiting dynamique (20 req/min) et cache auto-correctif anti-hallucination.],
    [*Fullstack & Production* : Application Next.js 15 (Server Components, App Router), conteneurisation Docker, hébergement haute disponibilité Vercel. Plateforme en ligne : #link("https://openprimer.app")[openprimer.app] (code OP-BETA-2026) | Dépôt : #link("https://github.com/Open-Primer")[github.com/Open-Primer].]
  )
)

#project-card(
  "2. HELLOAPPLY : Micro-Service & Agent Autonome d'Automatisation de Recrutement",
  ("Agent IA", "Google Apps Script", "Gemini Flash", "Clasp CI/CD", "Automatisation Process"),
  "Automatisation end-to-end de la veille d'offres et de la production documentaire de candidatures personnalisées en production continue 24/7.",
  (
    [*Interception & Traitement Cognitif Temps Réel* : Surveillance asynchrone des flux d'offres (LinkedIn, HelloWork), déréférencement d'URL et évaluation multicritères de pertinence sémantique par LLM (Gemini Flash).],
    [*Génération Asymétrique en Moins de 60s* : Production automatisée d'un dossier complet sur-mesure (CV ATS enrichi, note technique ciblée parmi 18 projets, lettre de motivation personnalisée « You, Me, Us »).],
    [*Architecture Cloud Serverless & CI/CD* : Moteur robuste sous Google Apps Script, conversion Docs vers PDF vectoriels, drafts Gmail automatisés, traçabilité Google Sheets et déploiement CI/CD via Clasp. Code source : #link("https://github.com/silveremartin-dev/HelloApply")[github.com/silveremartin-dev/HelloApply].]
  )
)

#project-card(
  "3. EPISTEME : Calcul Scientifique Haute Performance (HPC) & Industrialisation IA",
  ("HPC", "Java 25", "Project Panama FFM", "Rust Rayon", "CUDA", "SIMD", "Google Antigravity"),
  "Bibliothèque souveraine de calcul scientifique distribué et simulation massive (+450 000 lignes de code Java 25 / Rust).",
  (
    [*Ingénierie Augmentée par IA* : Industrialisation du delivery via Google Antigravity : génération automatisée de 80% des suites de tests unitaires/intégration et documentation, divisant par 5 les délais de livraison logicielle.],
    [*Performances Extrêmes & Bas-Niveau* : Exploitation de Java 25 hors-heap (Project Panama FFM), vectorisation SIMD (Vector API), bindings natifs Rust Rayon et GPU CUDA ; benchmarks certifiés jusqu'à 15x plus rapides qu'Apache Commons Math.],
    [*Rigueur Mathématique & Validation* : Couverture de tests rigoureuse, zéro fuite mémoire en environnement intensif. Code source public : #link("https://github.com/Episteme-HPC/Episteme")[github.com/Episteme-HPC/Episteme] | Démo : #link("https://huggingface.co/spaces/silveremartin/Episteme")[huggingface.co/spaces/silveremartin/Episteme].]
  )
)

#project-card(
  "4. SWARMFORGE : Plateforme Distribuée de Simulation Multi-Agents Massive",
  ("Systèmes Distribués", "Artemis-odb ECS", "Rust SIMD", "Kubernetes", "gRPC", "TornadoVM GPU"),
  "Moteur distribué à très grande échelle simulant jusqu'à 2 000 000 d'agents autonomes en interaction sur des écosystèmes et colonies complexes.",
  (
    [*Architecture Données Orientée (DOD)* : Mémoire compacte (~32 Mo RAM pour 1 million d'agents), ECS Artemis-odb et binding Rust SIMD natif (+25x d'accélération face aux structures objets classiques).],
    [*Cluster Distribué & Passage à l'Échelle* : Sharding Megaterrarium synchronisé sur cluster Kubernetes/Helm, échanges inter-nœuds ultra-rapides en gRPC/FlatBuffers, broker Redis et persistance PostgreSQL/H2.],
    [*Diffusion GPU & Observabilité* : Calcul de diffusion de flux sur GPU (TornadoVM/OpenCL), visualiseur 3D temps réel (jMonkeyEngine 3.6) et dashboard web réactif (React/Vite). Dépôt : #link("https://github.com/silveremartin-dev/")[github.com/silveremartin-dev].]
  )
)

#v(1fr)

#pagebreak()

// ==========================================
// PAGE 4 : NOTE TECHNIQUE (PROJETS 5 À 8 + SYNTHÈSE VALEUR)
// ==========================================

#v(0.2em)

#section-title("Sélection de Réalisations Techniques Clés (Partie 2)")

#project-card(
  "5. ETHER : Moteur Distribué de Simulation Cliodynamique & Biophysique",
  ("Systèmes Distribués", "Java 21 Virtual Threads", "Rust FFI", "Uber H3", "PostGIS", "Cluster"),
  "Simulation macro-historique planétaire couplant dynamiques biophysiques strictes (cycles N-P-K, thermodynamique) et modèles démographiques non-linéaires.",
  (
    [*Calcul Distribué Multi-Nœuds* : Partitionnement spatial de domaine sur maillage hexagonal mondial Uber H3 (millions de cellules), barrière de synchronisation déterministe (ClusterClockBarrier), conteneurisation Docker/PostGIS.],
    [*Moteur Hybride Haute Concurrence* : Exploitation massive des Virtual Threads de Java 21 (Project Loom), vectorisation SIMD et binding Rust sans surcoût (zero-cost abstraction) pour un débit continu.],
    [*Validation Empirique Automatisée* : Confrontation continue des trajectoires de simulation aux bases de données historiques mondiales (Seshat, Maddison Project, HYDE) ; 162 tests validés. Dépôt : #link("https://github.com/silveremartin-dev/")[github.com/silveremartin-dev].]
  )
)

#project-card(
  "6. NEXUSLAYER : Éditeur Visuel de Schémas & Architecture Client-Serveur",
  ("Java 21", "Spring Boot 3", "JavaFX 21", "PostgreSQL", "Docker Compose", "OpenAPI", "JWT"),
  "Application d'entreprise client-serveur de modélisation visuelle, rétro-ingénierie relationnelle et gouvernance de bases de données.",
  (
    [*Architecture Découplée d'Entreprise* : Découpage modulaire strict en 3 tiers (nexus-common, nexus-server, nexus-client) assurant l'indépendance de maintenance et la scalabilité applicative.],
    [*Sécurité & API First* : Authentification par tokens JWT avec hachage BCrypt, chiffrement TLS/SSL, pool optimisé HikariCP, API REST documentée sous Swagger UI/OpenAPI 3.0.],
    [*Client Lourd Ergonomique* : Interface JavaFX 21 réactive, navigation interactive dans les graphes de données, pipeline CI/CD automatisé sous GitHub Actions. Dépôt : #link("https://github.com/silveremartin-dev/")[github.com/silveremartin-dev].]
  )
)

#project-card(
  "7. PRAXIS : Ingénierie Vidéo-vers-Jumeau-Numérique & Manipulation Robotique",
  ("Computer Vision", "MuJoCo 3.x", "Three.js", "FastAPI", "Apache Parquet", "Hugging Face LeRobot"),
  "Extraction de démonstrations manipulatoires depuis des vidéos brutes et génération automatisée de jumeaux numériques 3D certifiés contact sans pénétration.",
  (
    [*Pipeline Vision & Retargeting* : Tracking bimanuel par flux optique dense Farneback, décomposition en graphes de tâches et retargeting cinématique vers mains robotiques (Unitree H1, Tesla Optimus, Franka).],
    [*Physique Réaliste & Export Standard* : Simulation dynamique sous MuJoCo 3.x, studio web interactif d'inspection image par image (Three.js/FastAPI) et export direct au format Apache Parquet / Hugging Face LeRobot. Dépôt : #link("https://github.com/silveremartin-dev/")[github.com/silveremartin-dev].]
  )
)

#project-card(
  "8. VOLUMEN : Moteur HPC Rust de Déroulement Virtuel & Streaming Volumétrique",
  ("Rust", "HPC", "OME-Zarr", "Rayon", "SIMD", "Vesuvius Challenge", "Synchrotron XPCT"),
  "Traitement intensif de tomographies synchrotron (5 à 10 To) pour la lecture non-invasive des papyrus carbonisés d'Herculanum.",
  (
    [*Streaming Out-of-Core sans Débordement* : Architecture Rust moderne avec multithreading Rayon, vectorisation SIMD et cache LRU thread-safe permettant de streamer des volumes massifs dans une empreinte RAM bornée.],
    [*Algorithmique Avancée* : Déroulement continu par variété en spirale d'Archimède éliminant les sauts de feuillets ; interopérabilité complète avec l'écosystème C++ officiel et streaming direct vers PyTorch. Dépôt : #link("https://github.com/silveremartin-dev/")[github.com/silveremartin-dev].]
  )
)

#section-title("Synthèse de Valeur Ajoutée pour Votre Organisation")

#block(fill: rgb("#f8fafc"), stroke: 0.8pt + rgb("#0284c7"), inset: 7.5pt, radius: 3pt, width: 100%)[
  #grid(
    columns: (1fr, 1fr),
    gutter: 12pt,
    [
      #text(weight: "bold", size: 8.5pt, fill: rgb("#0f172a"))[Management, Stratégie & Transformation]
      #v(0.15em)
      - *Leadership Technique & Vision Métier* : Capacité à vulgariser les enjeux techniques auprès des comités exécutifs et à traduire les objectifs business en feuilles de route d'architecture pragmatiques et rentables.
      - *Urbanisation & Dé-risquage du Legacy* : Expérience confirmée dans la modernisation progressive de systèmes patrimoniaux complexes, la mise en place d'architectures de médiation (APIs, ETL, RPA) sans rupture de service.
      - *Excellence Opérationnelle & Conduite du Changement* : Culture de la mesure du ROI, mise en œuvre de méthodologies Agiles adaptées, tutorat bienveillant et montée en compétences des équipes.
    ],
    [
      #text(weight: "bold", size: 8.5pt, fill: rgb("#0f172a"))[Architecture, IA & Qualité d'Ingénierie]
      #v(0.15em)
      - *Rigueur d'Ingénierie & Souveraineté* : Application systématique des standards de qualité logicielle (TDD, couverture de tests >80%, intégration continue, architecture propre sans dépendances superflues).
      - *Industrialisation de l'IA Générative* : Maîtrise opérationnelle des architectures multi-agents, pipelines RAG et intégration des LLMs/SLMs pour automatiser les processus métiers et décupler la productivité.
      - *Haute Performance & FinOps* : Optimisation fine des coûts d'infrastructure cloud et d'inférence IA, conception d'architectures résilientes à haute disponibilité et faible empreinte mémoire.
    ]
  )
]

#v(0.25em)
#align(center)[
  #text(size: 7.6pt, fill: rgb("#64748b"), style: "italic")[
    Dossier complet, références détaillées, dépôts de code source et démonstrations interactives disponibles sur demande.
  ]
]
