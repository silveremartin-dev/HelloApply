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
            *Silvère Martin-Michiellot* — Digital Transformation Manager | Systems & AI Architect | Lead Engineer
          ] else [
            *Silvère Martin-Michiellot* — Technical Background Brief & Project Portfolio
          ]
        ],
        text(size: 7.8pt, fill: rgb("#94a3b8"), font: "Segoe UI")[
          Professional Dossier
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
          *Curriculum Vitæ* — Silvère Martin-Michiellot (Management • Architecture • Engineering)
        ] else [
          *Technical Background Brief* — Project Portfolio & Operational Capabilities
        ]
      ],
      text(size: 7.8pt, fill: rgb("#475569"), font: "Segoe UI")[
        *Page #page_num of 4*
      ]
    )
  }
)

#set text(
  font: ("Segoe UI", "Calibri", "Arial", "Liberation Sans"),
  size: 8.7pt,
  lang: "en",
  fill: rgb("#1e293b")
)

#set par(justify: true, leading: 0.42em)

// Clickable links styling
#show link: set text(fill: rgb("#0284c7"))

// Helpers
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
    #text(size: 7.4pt, fill: rgb("#0369a1"), weight: "medium")[Stack: #tags.join(" • ")]
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
// PAGE 1 : CV - IDENTITY, SUMMARY & MAJOR RECENT EXPERIENCES
// ==========================================

#align(center)[
  #text(size: 16pt, weight: "bold", fill: rgb("#0f172a"))[SILVÈRE MARTIN-MICHIELLOT] \
  #v(0.12em)
  #text(size: 10.2pt, weight: "bold", fill: rgb("#0284c7"))[
    DIGITAL TRANSFORMATION MANAGER | SYSTEMS & AI ARCHITECT | LEAD ENGINEER
  ] \
  #v(0.18em)
  #text(size: 8.4pt, fill: rgb("#475569"))[
    Lorient, France (Regional Mobility & Remote) | #link("tel:+33767815202")[+33 7 67 81 52 02] | #link("mailto:silvere.martin@gmail.com")[silvere.martin\@gmail.com] \
    LinkedIn: #link("https://www.linkedin.com/in/silvere-martin-michiellot")[linkedin.com/in/silvere-martin-michiellot] | GitHub: #link("https://github.com/silveremartin-dev")[github.com/silveremartin-dev]
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
    Over 25 years of cross-functional expertise bridging *strategic digital transformation leadership* (AMOA, IT program management, enterprise urbanisation, mission-critical legacy modernization) and *hands-on distributed systems & AI-augmented software engineering*. Proven executive track record aligning IT investments with core business objectives (*+400% consolidated client turnover* at Deloitte/Equitive), while designing, auditing, and delivering high-concurrency microservices, cloud-native architectures, and resilient distributed platforms.
  ]
]

#section-title("Core Competencies & Strategic Pillars")

#grid(
  columns: (1fr, 1fr, 1fr),
  gutter: 7pt,
  [
    #block(fill: rgb("#f8fafc"), stroke: 0.5pt + rgb("#cbd5e1"), inset: 5pt, radius: 2pt, width: 100%)[
      #text(weight: "bold", size: 8.6pt, fill: rgb("#0f172a"))[Leadership & Transformation]
      #v(0.15em)
      - *Strategic AMOA & C-Level Alignment*: roadmaps, ROI, value.
      - *Legacy Modernization*: audit, decoupling, ETL & RPA.
      - *Governance & Delivery*: Agile/Scrum, Waterfall, budgets.
      - *Compliance & Security*: GDPR, data privacy, cybersecurity.
    ]
  ],
  [
    #block(fill: rgb("#f8fafc"), stroke: 0.5pt + rgb("#cbd5e1"), inset: 5pt, radius: 2pt, width: 100%)[
      #text(weight: "bold", size: 8.6pt, fill: rgb("#0f172a"))[Systems Architecture & AI]
      #v(0.15em)
      - *Distributed Systems*: microservices, Kafka, gRPC, REST.
      - *Agentic AI & LLMs*: multi-agent orchestration, RAG.
      - *Cloud & Hybrid*: GCP, AWS, Kubernetes, Docker, HA.
      - *High-Performance (HPC)*: low-level, GPU (CUDA).
    ]
  ],
  [
    #block(fill: rgb("#f8fafc"), stroke: 0.5pt + rgb("#cbd5e1"), inset: 5pt, radius: 2pt, width: 100%)[
      #text(weight: "bold", size: 8.6pt, fill: rgb("#0f172a"))[Software Engineering]
      #v(0.15em)
      - *Languages*: Java (1.0 to 25+), Rust, Python, C\#, SQL.
      - *Frameworks*: Spring Boot 3, Javalin, Next.js 15, FastAPI.
      - *Databases*: PostgreSQL, Oracle (9i-19c), SQL Server.
      - *Quality & DevOps*: CI/CD (GitHub Actions), TDD.
    ]
  ]
)

#section-title("Professional Experience (1/2)")

#exp-header(
  "Lead Architect & Open Source Developer",
  "GitHub Sponsorship & Deep-Tech R&D",
  "Lorient (Remote)",
  "07/2025 - Present"
)
#text(size: 8.5pt)[
  Technical direction and architecture of a sovereign ecosystem of 18 deep-tech frameworks (+1M lines of code in Java 25, Rust, Python, TypeScript) pioneering AI-augmented software engineering:
]
- *AI-Augmented Engineering (Google Antigravity)*: Automated 80% of unit tests and documentation, reducing the average software release cycle by 5x.
- *HPC & Massive Distributed Systems*: Architected *Episteme* (distributed scientific computing in Java 25, Project Panama FFM off-heap, benchmarks 15x higher than Apache standards) and *SwarmForge* (multi-agent simulation scaling to 2M entities, ECS Artemis-odb, Kubernetes sharding, gRPC/FlatBuffers).
- *Cloud-Native & Generative AI Platforms*: Conceived *OpenPrimer* (autonomous EdTech SaaS, hybrid WebLLM/Gemini 2.5 inference, Next.js 15, Supabase RLS) and *Ether* (cliodynamics simulation engine, Java 21 Loom, Rust FFI, Uber H3, PostGIS).
- *Environment:* Google Antigravity, Java 21-25, Rust, Python, Next.js 15, Spring Boot 3, Kubernetes, Docker, gRPC, Redis, PostgreSQL.

#exp-header(
  "Senior IT Support Specialist & Industrial IS Expert",
  "Techteam (Fives Syleps)",
  "Lorient, France",
  "06/2024 - 07/2025"
)
#text(size: 8.5pt)[
  Mission-critical 24/7 operational support and reliability engineering for automated robotics and logistics platforms (WMS, WCS, ERP, MES) under continuous high throughput:
]
- *Critical Incident Management & MCO*: Real-time root-cause analysis and resolution of production outages across application tiers and databases (L1, L2, L3), ensuring >99.8% availability.
- *Infrastructure Modernization & Security*: Audited and streamlined secure VPN routing and the virtualization farm (VMware, Hyper-V), *reducing support diagnosis and connection times by 35%*.
- *Database Performance*: Administration, query tuning, and index optimization for high-volume transactional databases (Oracle 19c, MS SQL Server) and industrial SFTP data pipelines.
- *Environment:* Windows Server, Linux/Unix, Oracle 19c, MS SQL Server, VMware, Hyper-V, SFTP, Java, .NET/C\#, PL/SQL, Bash.

#exp-header(
  "IT Manager & AMOA Project Director",
  "Equitive (Deloitte Group)",
  "Lorient, France",
  "10/2012 - 11/2023 (11 years)"
)
#text(size: 8.5pt)[
  Led enterprise digital transformation and strategic AMOA project steering for large-scale paperless solutions, automated payroll, e-invoicing, and grant workflows (notably for the French Ministry of Culture):
]
- *Business Growth & Strategic Impact*: C-level advisory and program steering directly driving *400% consolidated client turnover growth* over 7 years.
- *Program Delivery & Leadership*: Managed cross-functional teams (up to 8 engineers and developers), budget allocation, scope definition, and Agile/Scrum and Waterfall roadmaps.
- *Enterprise Architecture & Hybrid Cloud*: Scaled IT infrastructure to an enterprise private cloud exceeding *100 secure virtual machines* (VMware, Hyper-V, Docker, Apache Tomcat, Jenkins, Redmine, Git).
- *Process Automation (RPA & ETL)*: Built unified integration bridges (Talend ETL, SOAP/REST, PowerShell) and RPA bots (UiPath), *eliminating 80% of repetitive manual data entry*.
- *Cybersecurity & Data Governance (GDPR)*: End-to-end data encryption (TLS/SSL), automated purging, pseudonymization, and anonymization pipelines for sensitive HR and payroll records.
- *Environment:* Java, .NET/C\#, Webdev, SQL Server, Oracle, Talend ETL, VMware, Hyper-V, Docker, Jenkins, UiPath, Redmine, Git, PowerShell, REST.

#v(1fr)

#pagebreak()

// ==========================================
// PAGE 2 : CV - PAST ROLES, EDUCATION & LANGUAGES
// ==========================================

#v(0.3em)

#section-title("Professional Experience (2/2 - Continued)")

#exp-header(
  "Database Architect & Tech Leader",
  "Hardis",
  "Grenoble, France",
  "03/2011 - 02/2012"
)
#text(size: 8.6pt)[
  Database architecture and performance engineering for healthcare insurance platforms:
]
- Modeled, optimized, and tuned complex Oracle 11g database schemas (PL/SQL, stored procedures, indexing) for *Groupe Mutuel Assurances*.
- Architected high-throughput ETL data migration pipelines (Talend) and developed persistence layers for large-scale enterprise RCP J2EE applications.
- Supervised and coached *5 senior software engineers* (code reviews, TDD practices under JUnit, automated build pipelines).
- *Environment:* Java J2EE, Spring, Hibernate, Oracle 11g, PL/SQL, Talend ETL, JUnit, Eclipse RCP/SWT.

#exp-header(
  "Software & Systems Engineer",
  "HR Team (EDF / Atos Worldgrid)",
  "Grenoble, France",
  "10/2010 - 03/2011"
)
#text(size: 8.6pt)[
  Design and optimization of critical high-throughput transactional services for the energy sector:
]
- Engineered and tuned critical transactional J2EE web services (SOAP, WSDL, Spring, Hibernate) for energy distribution at *EDF*.
- Authored technical architecture dossiers (DAT), integration test plans (JUnit), and ensured continuous operational support (MCO).
- *Environment:* Java, J2EE, Servlets, WSDL, SOAP, Spring, Hibernate, Oracle, JUnit, Eclipse.

#exp-header(
  "R&D Software Engineer & Java Consultant",
  "Steria",
  "Grenoble / Lille, France",
  "04/2006 - 07/2010"
)
#text(size: 8.6pt)[
  Strategic software architecture and engineering consultancy across tier-1 industrial clients:
]
- *STMicroelectronics (Crolles 2)*: Developed critical J2EE services interfacing directly with semiconductor cleanroom manufacturing lines; technical English daily.
- *Camaïeu*: Modernized and maintained real-time warehouse inventory and supply chain platforms (Spring, Hibernate, Oracle 10g, C3P0, EHCache).
- *France Télécom & Schneider Electric*: Corrective and evolutionary maintenance of customer billing services and execution of industrial acceptance test plans.
- *Environment:* Java, J2EE, Servlets, JSP, Struts, Spring, Hibernate, Oracle 9i/10g, C3P0, EHCache, Quality Center, UML.

#exp-header(
  "Software Architect & Co-Founder",
  "Pioneer Open Source R&D Projects",
  "Grenoble / Geneva",
  "2002 - 2008"
)
#text(size: 8.6pt)[
  Foundational open-source initiatives in symbolic computation, autonomous robotics, and distributed virtual engines:
]
- *jRobotics.org (2007–2008)*: Co-founded and architected an open-source Java framework (+1,000 classes) for real-time robot control and 3D physics simulation (Java 5 multithreading, Java3D, TCP/IP).
- *Scientific Computing & JSR-275 (2004–2007)*: Co-founded a major scientific Java library (+5,000 classes of computer algebra and dimensional analysis) in close alignment with Java Community Process standardization efforts (JSR-275: Units & Measures API).
- *Digital Biosphere (2002–2003)*: Conceived a real-time distributed 3D virtual world engine (Java, JDO, SSL-encrypted UDP/TCP Multicast, VRML/X3D).
- *Environment:* Java (JDK 1.1 to 5), JDO, Java3D, VRML/X3D, TCP/IP, UDP Multicast, SSL, Unix/Linux, Oracle, MySQL.

#exp-header(
  "R&D Assistant, Lecturer & Systems Administrator",
  "TECFA — University of Geneva",
  "Geneva, Switzerland",
  "1994 - 1999"
)
#text(size: 8.6pt)[
  Pioneering R&D in cognitive science, educational software engineering, and campus-wide infrastructure:
]
- R&D in cognitive computing and educational technologies: visual GUI design, artificial life simulations, and distributed 3D virtual worlds (VRML).
- Taught post-graduate courses (DESS) in interactive multimedia software engineering and hypermedia development.
- Administered a heterogeneous network of *over 80 servers and workstations* (Unix, Linux, SunOS, Novell Netware, Mac, Windows), ensuring security and managing pioneer internet/web services.
- *Environment:* Unix, Linux, SunOS, Solaris, C, C++, VRML, HTML, TCP/IP, Novell Netware.

#section-title("Education & Credentials")

#grid(
  columns: (1fr, 1fr),
  gutter: 14pt,
  [
    #block(fill: rgb("#f8fafc"), stroke: 0.5pt + rgb("#cbd5e1"), inset: 6pt, radius: 2pt, width: 100%)[
      #text(weight: "bold", size: 8.6pt, fill: rgb("#0f172a"))[Science & Computing Degrees]
      #v(0.15em)
      - *DEA (Master) Cognitive Science & AI* \
        #text(size: 7.9pt, fill: rgb("#475569"))[I.N.P.G Grenoble (1994) — Merit Scholar, Honors.]
      - *Cert. Neurosciences & DESS Psychology* \
        #text(size: 7.9pt, fill: rgb("#475569"))[University of Geneva (1997–1998).]
      - *Master's (Maîtrise) Computer Science & Applied Maths* \
        #text(size: 7.9pt, fill: rgb("#475569"))[Univ. Joseph Fourier & UPMF Grenoble (1993).]
    ]
  ],
  [
    #block(fill: rgb("#f8fafc"), stroke: 0.5pt + rgb("#cbd5e1"), inset: 6pt, radius: 2pt, width: 100%)[
      #text(weight: "bold", size: 8.6pt, fill: rgb("#0f172a"))[Humanities, Research & Languages]
      #v(0.15em)
      - *Research Master 2 in History (Enhancement)* \
        #text(size: 7.9pt, fill: rgb("#475569"))[Univ. South Brittany (2025) — High Honors.]
      - *Bachelor's (L3) Sociology & Art History* \
        #text(size: 7.9pt, fill: rgb("#475569"))[Univ. of Toulouse & Grenoble (2010).]
      - *Languages*: *English C2 Bilingual* (TOEFL 267/300) | *French Native* | Spanish B2 | Italian B1
    ]
  ]
)

#v(1fr)

#pagebreak()

// ==========================================
// PAGE 3 : TECHNICAL BACKGROUND BRIEF (PROJECTS 1 TO 4)
// ==========================================

#v(0.2em)

#align(center)[
  #text(size: 14pt, weight: "bold", fill: rgb("#0f172a"))[TECHNICAL BACKGROUND BRIEF & PROJECT PORTFOLIO] \
  #v(0.1em)
  #text(size: 9.8pt, weight: "bold", fill: rgb("#0284c7"))[
    COMPLEX SYSTEMS, DIGITAL TRANSFORMATION & SOFTWARE ENGINEERING
  ] \
  #v(0.15em)
  #text(size: 8.2pt, fill: rgb("#475569"))[
    Technical Dossier for the attention of Executive Boards, Chief Technology Officers (CTO) and Recruiters \
    Candidate: *Silvère Martin-Michiellot* | #link("tel:+33767815202")[+33 7 67 81 52 02] | #link("mailto:silvere.martin@gmail.com")[silvere.martin\@gmail.com] | #link("https://github.com/silveremartin-dev")[github.com/silveremartin-dev]
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
    *Strategic & Operational Scope:* This dossier presents a curated portfolio of landmark projects illustrating the ability to *architect enduring software systems, steer high-stakes digital transformations, and industrialize next-generation agentic AI*. These achievements materialize the synergy between executive architectural vision and rigorous hands-on engineering execution.
  ]
]

#section-title("Selected Landmark Engineering Projects (Part 1)")

#project-card(
  "1. OPENPRIMER: Autonomous Knowledge Orchestration & Generative AI",
  ("GenAI", "LLMOps", "Next.js 15", "Supabase RLS", "Gemini 2.5", "WebLLM", "Docker"),
  "Architected and deployed an autonomous online digital university platform generating academic-grade interactive curricula across 42 disciplines and 10 academic levels.",
  (
    [*Agentic AI Architecture & FinOps*: Autonomous multi-agent pipeline using Gemini 2.5 API with dynamic multilingual generation (EN, FR, ES, DE, ZH), client-side in-browser WebLLM inference to minimize API consumption costs, and automatic cloud fallback.],
    [*Enterprise Security & Resilience*: Strict data isolation through Supabase/PostgreSQL Row-Level Security (RLS), formal Zod schema validation, dynamic rate limiting (20 req/min), and a self-healing anti-hallucination caching mechanism.],
    [*Fullstack & Production*: Next.js 15 (Server Components, App Router), Docker containerization, high-availability Vercel deployment. Live in production: #link("https://openprimer.app")[openprimer.app] (access code OP-BETA-2026) | Repository: #link("https://github.com/Open-Primer")[github.com/Open-Primer].]
  )
)

#project-card(
  "2. HELLOAPPLY: Autonomous AI Sourcing & Asymmetric Application Microservice",
  ("AI Agent", "Google Apps Script", "Gemini Flash", "Clasp CI/CD", "Process Automation"),
  "End-to-end automation of continuous job alert monitoring and programmatic generation of highly tailored PDF dossiers in 24/7 autonomous production.",
  (
    [*Real-Time Alert Sourcing & Cognitive Scoring*: Continuous Gmail listener intercepting LinkedIn and HelloWork notifications, resolving redirects, and executing multicriteria semantic fit evaluations via Gemini Flash.],
    [*Asymmetric Sub-60s Document Generation*: Programmatic generation in under 60 seconds of tailored ATS-compliant CVs, targeted technical realization briefs from an 18-project portfolio, and peer-to-peer cover letters.],
    [*Serverless Cloud Architecture & CI/CD*: Robust Google Apps Script engine, automated Docs-to-vector-PDF pipeline, programmatic Gmail drafting, centralized Google Sheets logging, and clasp CI/CD. Code: #link("https://github.com/silveremartin-dev/HelloApply")[github.com/silveremartin-dev/HelloApply].]
  )
)

#project-card(
  "3. EPISTEME: High-Performance Scientific Computing (HPC) & AI Industrialization",
  ("HPC", "Java 25", "Project Panama FFM", "Rust Rayon", "CUDA", "SIMD", "Google Antigravity"),
  "Sovereign distributed scientific computing and simulation engine (+450,000 lines of Java 25 & Rust code).",
  (
    [*AI-Augmented Engineering*: Industrialized delivery lifecycle using Google Antigravity: automated generation of 80% of unit/integration test suites and documentation, accelerating release cadence 5x.],
    [*Extreme Hardware Acceleration*: Native Java 25 off-heap memory management (Project Panama FFM), SIMD vectorization (Vector API), native Rust Rayon and GPU CUDA bindings; certified benchmarks up to 15x faster than Apache Commons Math.],
    [*Mathematical Rigor & Verification*: Strict test coverage, zero memory leaks under prolonged saturation loads. Open-source repository: #link("https://github.com/Episteme-HPC/Episteme")[github.com/Episteme-HPC/Episteme] | Showcase: #link("https://huggingface.co/spaces/silveremartin/Episteme")[huggingface.co/spaces/silveremartin/Episteme].]
  )
)

#project-card(
  "4. SWARMFORGE: Distributed Massive Multi-Agent Simulation Platform",
  ("Distributed Systems", "Artemis-odb ECS", "Rust SIMD", "Kubernetes", "gRPC", "TornadoVM GPU"),
  "Massive distributed multi-agent simulation engine modeling up to 2,000,000 autonomous entities across complex ecological networks.",
  (
    [*Data-Oriented Design (DOD)*: Compact memory layout (~32 MB RAM for 1 million agents), Artemis-odb ECS, and native Rust SIMD acceleration delivering a +25x speedup over standard object graphs.],
    [*Distributed Cluster Orchestration*: Synchronized multi-node Megaterrarium sharding on Kubernetes/Helm, low-latency inter-node communication via gRPC/FlatBuffers, Redis queue broker, and PostgreSQL/H2 persistence.],
    [*GPU Diffusion & Telemetry*: GPU-accelerated field diffusion (TornadoVM/OpenCL), real-time 3D engine (jMonkeyEngine 3.6), and a reactive observability web console (React/Vite). Repository: #link("https://github.com/silveremartin-dev/")[github.com/silveremartin-dev].]
  )
)

#v(1fr)

#pagebreak()

// ==========================================
// PAGE 4 : TECHNICAL BACKGROUND BRIEF (PROJECTS 5 TO 8 + EXECUTIVE SYNTHESIS)
// ==========================================

#v(0.2em)

#section-title("Selected Landmark Engineering Projects (Part 2)")

#project-card(
  "5. ETHER: Distributed Cliodynamics & Macro-Historical Simulation Engine",
  ("Distributed Systems", "Java 21 Virtual Threads", "Rust FFI", "Uber H3", "PostGIS", "Cluster"),
  "Planetary-scale macro-historical simulation engine coupling strict biophysical constraints (N-P-K cycles, non-equilibrium thermodynamics) with non-linear societal dynamics.",
  (
    [*Multi-Node Domain Decomposition*: Spatial domain partitioning over a worldwide Uber H3 hexagonal grid (millions of cells), deterministic ClusterClockBarrier synchronization, Docker/PostGIS clustering.],
    [*High-Concurrency Hybrid Engine*: Massive Java 21 Virtual Threads concurrency (Project Loom), SIMD vector arithmetic, and zero-cost native Rust bindings delivering non-blocking simulation throughput.],
    [*Automated Empirical Validation*: Real-time regression benchmark against leading international historical datasets (Seshat Global History Databank, Maddison Project, HYDE); 162 passing tests. Repo: #link("https://github.com/silveremartin-dev/")[github.com/silveremartin-dev].]
  )
)

#project-card(
  "6. NEXUSLAYER: Visual Schema Designer & Client-Server Architecture",
  ("Java 21", "Spring Boot 3", "JavaFX 21", "PostgreSQL", "Docker Compose", "OpenAPI", "JWT"),
  "Modern client-server enterprise application for visual database modeling, relational schema reverse-engineering, and interactive data governance.",
  (
    [*Decoupled Enterprise Architecture*: Strict 3-tier modular separation (nexus-common, nexus-server, nexus-client) ensuring lifecycle independence and horizontal scalability.],
    [*Enterprise Security & API First*: JWT token authentication with BCrypt hashing, TLS/SSL transport encryption, HikariCP connection pooling, and OpenAPI 3.0 (Swagger UI) documentation.],
    [*Responsive Rich Desktop Client*: Cross-platform JavaFX 21 interface, real-time graph navigation, and continuous integration pipeline via GitHub Actions. Repository: #link("https://github.com/silveremartin-dev/")[github.com/silveremartin-dev].]
  )
)

#project-card(
  "7. PRAXIS: Video-to-Physical-Digital-Twin (V2PDT) & Humanoid Manipulation",
  ("Computer Vision", "MuJoCo 3.x", "Three.js", "FastAPI", "Apache Parquet", "Hugging Face LeRobot"),
  "Automated extraction of manipulation demonstrations from monocular video feeds into contact-certified 3D physical digital twins for humanoid robotics.",
  (
    [*Vision Pipeline & Retargeting*: Bimanual tracking via dense Farneback optical flow, task graph decomposition, and kinematic retargeting to robot hands (Unitree H1, Tesla Optimus, Franka).],
    [*Physics Simulation & Standards*: Forward dynamics under MuJoCo 3.x, frame-by-frame 3D web inspection studio (Three.js/FastAPI), and certified export to Apache Parquet / Hugging Face LeRobot format. Repo: #link("https://github.com/silveremartin-dev/")[github.com/silveremartin-dev].]
  )
)

#project-card(
  "8. VOLUMEN: High-Performance Rust Virtual Unwrapping & Volumetric Streaming",
  ("Rust", "HPC", "OME-Zarr", "Rayon", "SIMD", "Vesuvius Challenge", "Synchrotron XPCT"),
  "Intensive 3D volumetric processing of synchrotron tomographies (5-10 TB) for non-invasive reading of carbonized Herculaneum papyri.",
  (
    [*Out-of-Core Streaming with Bounded RAM*: Modern Rust architecture leveraging Rayon multithreading, SIMD vectorization, and thread-safe LRU caching to stream multi-terabyte volumes without memory exhaustion.],
    [*Analytical Manifold Unrolling*: Continuous Archimedean spiral algorithms resolving sheet-switching ambiguities; direct C++ pipeline compatibility and zero-copy streaming into PyTorch. Repo: #link("https://github.com/silveremartin-dev/")[github.com/silveremartin-dev].]
  )
)

#section-title("Cross-Functional Expertise Deliverable to Your Organization")

#block(fill: rgb("#f8fafc"), stroke: 0.8pt + rgb("#0284c7"), inset: 7.5pt, radius: 3pt, width: 100%)[
  #grid(
    columns: (1fr, 1fr),
    gutter: 12pt,
    [
      #text(weight: "bold", size: 8.5pt, fill: rgb("#0f172a"))[Management, Strategy & Transformation]
      #v(0.15em)
      - *Technical Leadership & Business Vision*: Proven ability to articulate complex technical challenges to C-level executives and translate business goals into pragmatic, profitable architecture roadmaps.
      - *Enterprise Urbanization & Legacy De-risking*: Extensive track record in progressively modernizing legacy monoliths, establishing integration mediation layers (APIs, ETL, RPA) with zero operational disruption.
      - *Operational Excellence & Change Management*: Rigorous ROI culture, pragmatic Agile implementation, and empathetic mentorship elevating software engineering teams.
    ],
    [
      #text(weight: "bold", size: 8.5pt, fill: rgb("#0f172a"))[Architecture, AI & Engineering Discipline]
      #v(0.15em)
      - *Engineering Rigor & Sovereignty*: Systematic application of modern software quality standards (TDD, >80% test coverage, continuous integration, decoupled clean architecture).
      - *Industrialization of Generative AI*: Operational mastery of multi-agent workflows, RAG pipelines, and LLM/SLM integration to automate business workflows and multiply developer velocity.
      - *High-Performance & FinOps*: Strict optimization of cloud infrastructure and inference costs, designing fault-tolerant high-availability architectures with compact memory footprints.
    ]
  )
]

#v(0.25em)
#align(center)[
  #text(size: 7.6pt, fill: rgb("#64748b"), style: "italic")[
    Complete portfolio, references, source code repositories, and interactive demos available upon request.
  ]
]
