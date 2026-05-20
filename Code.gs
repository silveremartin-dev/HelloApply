/**
 * HelloApply: Cloud Edition
 * VERSION: 6.0.0 (Triple-Document Generation Engine Edition)
 * LAST UPDATED: 20/05/2026 16:45
 * 
 * New in v6.0.0:
 * - Triple-Document Sourcing Engine: Systematically generates CV, traditional Cover Letter, and peer-to-peer Technical Architecture Memo as 3 separate custom PDFs.
 * - Auto-Updating 12-Column Spreadsheet: Automatically upgrades tracking layout in-place to log all three document URLs.
 * - Dynamic Languages Extraction: Extracts languages and levels (e.g. Anglais C2, Espagnol B2) from masterCV to dynamically form a clean "## FORMATION & LANGUES" section.
 * - Strict Banning of "JScience": Ban JScience in all generated documents and replace it exclusively with "Episteme".
 * 
 * New in v5.1.0:
 * - Strict Banning of "JScience": Completely ban JScience and dynamically translate it to "Episteme" to preserve state-of-the-art software architecture.
 * - Mandatory Architecture Memo Header: Enforces the contact header at the absolute top of the letter.
 * - Safe CV Page-Break Engine: Prevents false positives by only triggering the page break on exact "FORMATION/EDUCATION" section headings.
 * - Max CV Density: Strictly mandates the preserving of complete responsibilities and technologies without truncation.
 * 
 * New in v5.0.0:
 * - Asymmetric Sourcing Engine: Mutation from traditional cover letters to peer-to-peer "Technical Architecture Memo / Audit Flash" targeting critical company bottlenecks.
 * - CV as Index of Executable Proofs of Work: Positions the CV as a display of absolute authority showcasing tangible, production-ready assets.
 * - Dynamic Proofs of Work matching: Automatically scans target roles to link them directly to Episteme, Eternity, Swarm Forge, Open Primer, or Antigravity.
 * - Dynamic 11-Column Spreadsheet Headers: Dynamically updates the column layout of existing sheets in-place by verifying against the maximum current column index.
 * - Accurate Status Validation: Correctly marks ignored or low-scoring jobs in Test Mode as 'Rejetée' in the tracking sheet based on whether drafts were actually generated.
 * - Robust Link Auto-Format: Automatically detects and formats plain LinkedIn/GitHub URLs inside paragraph/list text into premium, blue, underlined, clickable hyperlinked anchors.
 * - Reset Character-Level Style Inheritance: Overrides text-level style inheritance from preceding headings by explicitly applying Roboto 9.5 and normal weights to both paragraphs and list items.
 */

// --- CONFIGURATION ---
const TEST_MODE = true; // Set to true to run infinite tests on the latest emails

const ROOT_FOLDER_NAME = "Candidature Express";
const INPUT_FOLDER_NAME = "input";
const OUTPUT_FOLDER_NAME = "output";

const MASTER_CV_NAME = 'SilvereMartinMichiellot-CV-full'; 
const TEMPLATE_CV_NAME = 'SilvereMartinMichiellot-CV-1pageATS-2026';
const TEMPLATE_LETTER_NAME = 'Lettre de motivation Silvère Martin-Michiellot 2026b';

const TRACKING_SHEET_NAME = 'Suivi_Candidatures';
const MIN_MATCH_SCORE = 85; 

// --- USER PREFERENCES ---
const PREFERENCES = {
  location: "Lorient, France",
  radiusLocal: 20, 
  radiusRegional: 50,
  allowFullRemote: true,
  preferredRegions: ["Europe", "World"]
};

/**
 * Main Entry Point
 * TEST_MODE: processes at most 1 LinkedIn job + 1 HelloWork job, then stops.
 */
function main() {
  const startTime = new Date().getTime();
  const MAX_EXECUTION_TIME_MS = 260000; // 4.3 minutes, extremely safe threshold to avoid the Google 6 min timeout

  const props = PropertiesService.getScriptProperties();
  const lastRunStr = props.getProperty('LAST_RUN_TIMESTAMP');
  const lastRun = TEST_MODE ? new Date(Date.now() - 48 * 60 * 60 * 1000) : (lastRunStr ? new Date(lastRunStr) : new Date(Date.now() - 12 * 60 * 60 * 1000));

  console.log(`[START] Scanning since ${lastRun.toLocaleString()}...`);
  if (TEST_MODE) console.warn('⚠️ [MODE TEST] Limité à 1 offre LinkedIn + 1 offre HelloWork maximum.');

  let threads = [];
  const queries = [
    'subject:"nouvelles offres" "HelloWork"',
    'subject:"alerte" "LinkedIn"',
    'from:jobalerts-noreply@linkedin.com',
    'from:notification@emails.hellowork.com'
  ];
  
  queries.forEach(q => {
    const result = GmailApp.search(q, 0, TEST_MODE ? 5 : 10);
    threads = threads.concat(result);
  });
  
  threads = threads.filter((t, index, self) => index === self.findIndex((th) => t.getId() === th.getId()));

  const root = getOrCreateFolder(ROOT_FOLDER_NAME);
  const inputFolder = getOrCreateFolderIn(root, INPUT_FOLDER_NAME);
  const outputFolder = getOrCreateFolderIn(root, OUTPUT_FOLDER_NAME);
  
  const masterCV = readAnyFileIn(inputFolder, MASTER_CV_NAME);
  const cvTemplateText = readAnyFileIn(inputFolder, TEMPLATE_CV_NAME);
  const letterTemplateText = readAnyFileIn(inputFolder, TEMPLATE_LETTER_NAME);

  if (!masterCV) {
    console.error("[ERROR] Master CV not found. Aborting.");
    return;
  }

  // TEST_MODE quota: process up to 2 high-matching jobs (score >= 95%)
  let testProcessedCount = 0;
  const TEST_MATCH_THRESHOLD = 95;

  for (const thread of threads) {
    if (TEST_MODE && testProcessedCount >= 2) break;
    
    // Safety check: close to Google execution limit (6 min)
    if (new Date().getTime() - startTime > MAX_EXECUTION_TIME_MS) {
      console.log(`[TIMEOUT] Proche de la limite Apps Script (6 min). Arrêt gracieux, la suite au prochain passage.`);
      break;
    }

    if (!TEST_MODE && thread.getLastMessageDate() <= lastRun) continue;

    const messages = thread.getMessages();
    for (const message of messages) {
      if (TEST_MODE && testProcessedCount >= 2) break;
      if (new Date().getTime() - startTime > MAX_EXECUTION_TIME_MS) break;
      
      if (!TEST_MODE && message.getDate() <= lastRun) continue;

      const subject = message.getSubject();
      const body = message.getPlainBody();
      const jobUrls = extractJobUrls(body);
      
      console.log(`[MAIL] Analysing email: "${subject}"`);

      for (let rawUrl of jobUrls) {
        if (TEST_MODE && testProcessedCount >= 2) break;
        if (new Date().getTime() - startTime > MAX_EXECUTION_TIME_MS) break;

        let url = cleanUrl(rawUrl);
        const isLinkedIn = url.includes('linkedin.com');
        const isHelloWork = url.includes('hellowork.com');

        // TEST_MODE: skip if we already processed 2 matching jobs
        if (TEST_MODE && testProcessedCount >= 2) continue;
        
        // Resolve click-tracking redirections for HelloWork to get the clean final page link
        if (url.includes('emails.hellowork.com/clic') || url.includes('hellowork.com/redirect')) {
          console.log(`[RESOLVING] Resolving redirect for: ${url}`);
          url = resolveRedirects(url);
          url = cleanUrl(url);
          console.log(`[RESOLVED] Final URL: ${url}`);
        }
        
        const jobId = getJobId(url);
        
        if (isJobProcessed(jobId)) {
          console.log(`[SKIP] Job already processed: ${jobId}`);
          continue;
        }

        try {
          let description = fetchJobDescription(url);
          let context = description;
          
          if (!description || description.includes("authWall") || description.includes("login")) {
            console.warn(`[WARN] Login wall detected for ${url}. Using email content as fallback.`);
            context = `[URL: ${url}]\n[EMAIL SUBJECT: ${subject}]\n[EMAIL BODY: ${body}]`;
          }

          const analysis = analyzeAndTailor(context, masterCV, cvTemplateText, letterTemplateText, url);
          if (analysis) {
            analysis.url = url;
            analysis.originalUrl = rawUrl; // Save original URL from email for reporting
            analysis.source = url.includes('linkedin.com') ? 'LinkedIn' : 'HelloWork';
            analysis.raw_description = context; // Save full context for the draft copy
            
            const requiredScore = TEST_MODE ? TEST_MATCH_THRESHOLD : MIN_MATCH_SCORE;
            if (analysis.decision === "Postuler" && analysis.score >= requiredScore) {
              processJob(inputFolder, outputFolder, analysis);
              if (TEST_MODE) {
                testProcessedCount++;
                console.log(`[TEST] High-matching job processed (${testProcessedCount}/2) with score ${analysis.score}%`);
              }
            } else {
              console.log(`[IGNORED] ${analysis.position} at ${analysis.company} (Score: ${analysis.score}%, Decision: ${analysis.decision}, Required: ${requiredScore}%)`);
              logToSheet(outputFolder, analysis, "", "", ""); // Always log rejected/ignored jobs
            }
            
            // Mark job as processed to prevent duplicates
            markJobProcessed(jobId);
          }
        } catch (e) { console.error(`[ERROR] ${url}: ${e.message}`); }
      }
    }
  }
  if (!TEST_MODE) props.setProperty('LAST_RUN_TIMESTAMP', new Date().toISOString());
}

function analyzeAndTailor(context, masterCV, cvTemplateText, letterTemplateText, originalUrl) {
  const prompt = `
    TASK: You are an expert AI sourcing agent and technical ghostwriter. Your objective is to perform an asymmetric application for a highly senior profile.
    You will systematically generate THREE distinct documents in the returned JSON object:
    1. A tailored dynamic CV ('cv_markdown') positioned as an "Index of Executable Proofs of Work".
    2. A traditional, premium Cover Letter ('letter_markdown') following the "You, Me, Us" narrative structure and formal styling.
    3. A peer-to-peer Technical Architecture Memo ('memo_markdown') targeting the company's core bottlenecks.

    JOB DESCRIPTION:
    \${context}
    
    MASTER CV / SOURCE KNOWLEDGE (THE ONLY SOURCE OF TRUTH):
    \${masterCV}
    
    CRITICAL INSTRUCTIONS FOR TRIPLE-DOCUMENT WRITING:
    0. INPUT VALIDATION & RESTRICTIVENESS (STRICT SHIELD):
       - CRITICAL: If the specific Company Name or Job Title cannot be found in the description (e.g. if it's an auth wall, empty, or generic boilerplate), you MUST set Score = 0 and Decision = "Ignorer". DO NOT invent a job title like "Not specified". DO NOT generate documents.
       - LOCATION FILTER: The candidate is based in Lorient, France. If the job is geographically far from Lorient (e.g. Paris, Lyon, Villeurbanne) and is NOT explicitly marked as "Full Remote" (100% télétravail), Decision = "Ignorer".
       - This profile has 30+ years of experience in complex systems. If the role is junior, purely executant, or unrelated to IT Management, Systems Architecture, or Senior AI Engineering, Score strictly < 80%, Decision = "Ignorer".
       
    1. LANGUAGE DETECTION & CONSISTENCY (CRITICAL):
       - Detect the native language of the job description.
       - IMPORTANT: Even though this prompt is in English, if the job offer is in French, YOU MUST WRITE EVERY SINGLE DOCUMENT ENTIRELY IN FRENCH. Do not output English for a French job.
       - If it is in English, ALL documents MUST be completely in English. You must translate any French terms, headings, dates, and locations from the templates/master CV into perfect natural English.
         * The date block MUST be in English (e.g., "Lorient, May 18, 2026"). Never write "Lorient, le...".
         * The greetings and Recipient MUST be in English (e.g., "Attention: Hiring Manager", "Dear Hiring Manager,").
         * The closing salutation MUST be in English (e.g., "Sincerely,"). Never mix French closings!
       - If it is in French, ALL documents MUST be entirely in French.
         * The date block MUST be in French (e.g., "Lorient, le 18 mai 2026").
         * The greeting MUST be "Madame, Monsieur,".
         * The closing salutation MUST be "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.".
       
    1.5. EXECUTIVE WRITING STYLE (Emulate the Gold Standard tone):
       - Emulate the high-impact, prestigious tone of the Gemini 3.1 Pro reference CV below.
       - Write extremely rich, strategic, and metric-heavy bullet points and summaries from the Master CV details. Do not write short or generic bullet points.
       
    <tone_reference_only_do_not_copy>
    [GOLD STANDARD CV EXAMPLE]:
    "Silvère MARTIN-MICHIELLOT Lorient, France (Remote) | 07 67 81 52 02 | silvere.martin@gmail.com 
    LinkedIn: linkedin.com/in/silvere-martin-michiellot/ | GitHub: github.com/silveremartin-dev
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
    Méthodes : Agile (Scrum/Lean), TDD, Design Patterns, UML."
    </tone_reference_only_do_not_copy>
    
    WARNING: The above is ONLY A TONE REFERENCE. DO NOT COPY THE JOB TITLES, COMPANY NAMES, OR EXACT BULLET POINTS FROM IT. ALWAYS EXTRACT THE TARGET TITLE FROM THE JOB DESCRIPTION, AND YOUR ACTUAL EXPERIENCE FROM THE MASTER CV.
    ========================================================================
       
    2. THE TRADITIONAL COVER LETTER ('letter_markdown'):
       - Follow the premium cover letter formatting guidelines from version 4.4.x:
         - Sender block at the absolute top of the letter:
           Silvère Martin-Michiellot
           [Target Position Title matching the CV]
           Lorient | 07 67 81 52 02 | silvere.martin@gmail.com
           LinkedIn: https://www.linkedin.com/in/silvere-martin-michiellot
           GitHub: https://github.com/silveremartin-dev/
         - A blank line, then the Lorient date line, matched to the current date.
         - Recipient: "À l'attention du Responsable du Recrutement - [Company Name]" (or English equivalent).
         - Subject line: "## **Objet : Candidature au poste de [Exact Target Position]**" (or English equivalent) (must be standard black text, no horizontal rules below it).
         - Formal greeting: "Madame, Monsieur," (or English equivalent).
         - Narrative: Clean "You, Me, Us" narrative structure (written entirely in the target language):
           - You: Show deep understanding of their business context, technical environment, and structural challenges.
           - Me: Showcase authority by linking directly to candidate's elite projects (Episteme, Eternity, Open Primer, Swarm Forge, Ether, or Google Antigravity).
           - Us: Propose high-value synergy and immediate technical collaboration.
         - Formal closing salutation: "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées." (or English equivalent).
         - Sign-off: "Silvère Martin-Michiellot."
         
    3. THE PEER-TO-PEER TECHNICAL ARCHITECTURE MEMO ('memo_markdown'):
       - Replaces traditional cover letter subordination with an elite, peer-to-peer technical architecture memo / flash audit addressed directly to the CTO/CEO.
       - **ABSOLUTE HEADER REQUIREMENT**: The very first block of text in "memo_markdown" must be the raw header block below, with absolutely no greetings, and no subordination formulas ("À l'attention de..."). It must be at the absolute top of the document:
           Silvère Martin-Michiellot
           [Target Position Title matching the CV]
           Lorient | 07 67 81 52 02 | silvere.martin@gmail.com
           LinkedIn: https://www.linkedin.com/in/silvere-martin-michiellot
           GitHub: https://github.com/silveremartin-dev/
       - A blank line, then the Lorient date line, positioned right after the header block and before the subject line.
       - Immediately following the date line, write the Subject Line: "## **Mémo d'Architecture : [Identify the core technical challenge or bottleneck implicitly described in the job offer]**" (or English equivalent).
       - Under no circumstances should you prepend any subordination formulas like "À l'attention de la Direction Technique," or traditional greetings like "Madame, Monsieur,". Keep it strictly peer-to-peer, professional, and authoritative.
       - The core content of the Memo must feature:
         - **The Hook (Le Diagnostic):** Start by dissecting their technical environment based on the offer. Point out the likely friction points (e.g., legacy debt, scaling LLMs in production, CI/CD bottlenecks).
         - **The Proposition:** Propose a high-level architectural posture to solve it.
         - **The Proof of Work (CRITICAL):** Explicitly link their bottleneck to the candidate's tangible, production-ready assets (Episteme, Eternity, Open Primer, Swarm Forge, Ether, or Google Antigravity).
         - **The Call to Action (CTA):** Close assertively. E.g., "Je vous propose d'auditer cette architecture lors d'un premier échange technique." (or English equivalent).
         - **Sign-off:** "Silvère Martin-Michiellot."

    4. THE CV AS AN INDEX ('cv_markdown'):
       - Use "### " for job titles/companies or sub-sections (e.g. "### Lead Architecte & Développeur Open Source — Mécénat GitHub | Lorient | 07/2025 - Présent").
       - Maintain strict Markdown formatting: "# " for name, normal paragraphs for contact info, "## [TARGET POSITION]" for the dynamic title.
       - Contact info must include exactly these lines without any bullet points:
         Lorient | 07 67 81 52 02 | silvere.martin@gmail.com
         LinkedIn: https://www.linkedin.com/in/silvere-martin-michiellot
         GitHub: https://github.com/silveremartin-dev/
       - **MANDATORY SECTIONS**: You MUST include a "## COMPÉTENCES CLÉS" (in French) or "## KEY COMPETENCIES" (in English) section right after the profile summary. Never skip it.
       - **NO HALLUCINATION OF DATES OR ROLES**: You MUST strictly use the exact dates, company names, and official job titles from the masterCV. Do not alter dates (e.g., Hardis Group is 2011-2012) and do not invent roles (e.g., do not say you were Freelance in 2023 if it's not in the masterCV).
       - **NO META-COMMENTS**: Never include AI notes or comments like "Additional historical experience maintained...". Output only the final CV text.
       - **MAXIMUM DENSITY AND DETAIL (DO NOT TRUNCATE OR SUMMARIZE)**: Do not ever summarize, shorten, or truncate the professional experiences. You must retrieve and strictly preserve the complete, exhaustive list of responsibilities, tasks, detailed technologies used, methodologies (Agile, TDD, Design Patterns, UML), and quantified metrics from the "masterCV" source for each experience (e.g., Deloitte, Hardis, Fives Syleps, etc.). Every single experience must be highly informative, fully detailed, and dense with concrete achievements.
       - Highlight the capability to govern AI and structure complex logic (not just write code).
       - Ensure all metrics (budgets, team sizes, time saved) and the mandatory "**Environnement technique :**" (in French) or "**Technical Environment:**" (in English) line at the end of every experience are strictly preserved.
       - Do not use numbered lists (1. 2. 3.). Use standard bullet points (- or *).
       - **DYNAMIC LANGUAGES EXTRACTION**: Format a clean "## FORMATION & LANGUES" (in French) or "## EDUCATION & LANGUAGES" (in English) section at the end of the CV. You MUST systematically list all 4 languages from the masterCV (English, French, Italian, Spanish) and their levels, translated to the target language (e.g. Anglais, Français, Italien, Espagnol).
       
    5. STRICT BANNING OF "JScience" (OR "Jscience"):
       - Do not ever mention JScience or any legacy projects in the CV, Cover Letter, or Memo.
       - If the job involves scientific or distributed computing, exclusively reference the modern successor **"Episteme"** (developed 2025-2026, 450,000+ lines of scientific/distributed Java framework) or **"Eternity"** (massively parallel combinatorial optimization solver leveraging TornadoVM/OpenCL for GPU acceleration).
       - If JScience is found in the "masterCV" source, dynamically translate/rename it to **"Episteme"**.

    6. JSON STRUCTURE:
    Return JSON only:
    {
      "company": "Real Company Name",
      "position": "Exact Job Title",
      "score": 0-100,
      "reasoning": "Technical justification of why the candidate's specific PoW (Episteme, Eternity, Antigravity, etc.) solves their architectural problem.",
      "decision": "Postuler" or "Ignorer",
      "job_description_clean": "Cleaned job description in plain text...",
      "language": "en" or "fr",
      "cv_markdown": "Full CV tailored as an authoritative index of technical assets...",
      "letter_markdown": "The traditional Cover Letter following the premium You-Me-Us structure...",
      "memo_markdown": "The peer-to-peer Technical Architecture Memo..."
    }
  `;
  
  let result = callGemini(prompt);
  if (result) {
    const fields = ['cv_markdown', 'letter_markdown', 'memo_markdown'];
    fields.forEach(field => {
      if (result[field]) {
        // Robust programmatic shield to replace JScience with Episteme (case-insensitive)
        result[field] = result[field].replace(/jscience/gi, "Episteme");
      }
    });
  }
  return result;
}

/**
 * URL Transformation & Fetching
 */
function fetchJobDescription(url) {
  try {
    const options = {
      'muteHttpExceptions': true,
      'headers': {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    };
    const response = UrlFetchApp.fetch(url, options);
    const html = response.getContentText();
    
    if (html.includes("authWall") || html.includes("login") || html.includes("Sign in")) return "authWall";
    
    return html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gmi, "").replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gmi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().substring(0, 40000);
  } catch (e) { return null; }
}

/**
 * Process Job
 */
function processJob(inputFolder, outputFolder, job) {
  let cvDocUrl = ""; let lmDocUrl = ""; let memoDocUrl = ""; let attachments = [];
  try {
    const rand = Math.floor(Math.random() * 900000) + 10000;
    const cvName = `SilvereMartinMichiellot-CV-2026-${rand}`;
    const lmName = `SilvereMartinMichiellot-LM-2026-${rand}`;
    const memoName = `SilvereMartinMichiellot-Memo-2026-${rand}`;
    
    // Process complete generation from Markdown
    const cvResult = generateFilesFromTemplate(inputFolder, outputFolder, TEMPLATE_CV_NAME, job.cv_markdown || "", cvName);
    cvDocUrl = cvResult.docUrl;
    
    const lmResult = generateFilesFromTemplate(inputFolder, outputFolder, TEMPLATE_LETTER_NAME, job.letter_markdown || "", lmName);
    lmDocUrl = lmResult.docUrl;
    
    const memoResult = generateFilesFromTemplate(inputFolder, outputFolder, TEMPLATE_LETTER_NAME, job.memo_markdown || "", memoName);
    memoDocUrl = memoResult.docUrl;
    
    attachments = [cvResult.pdfBlob, lmResult.pdfBlob, memoResult.pdfBlob];
    
    createDraft(job, attachments);
    console.log(`[SUCCESS] 3 PDFs created & draft sent for ${job.company} (${job.score}%)`);
  } catch (e) {
    console.error(`[ERROR] Processing ${job.company}: ${e.message}\nStack: ${e.stack || 'N/A'}`);
  }
  logToSheet(outputFolder, job, cvDocUrl, lmDocUrl, memoDocUrl);
}

/**
 * Create Gmail Draft (Embeds a beautifully cleaned & structured job description copy)
 */
function createDraft(job, attachments) {
  const subject = `[Candidature ${job.source}] - ${job.position} - ${job.company} (${job.score}%)`;
  const htmlBody = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #e2e8f0; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
      <p style="font-size: 1.1em; margin-top: 0;">Bonjour Silvère,</p>
      <p>Voici ta candidature personnalisée prête à l'envoi pour le poste de <strong style="color: #2c5282;">${job.position}</strong> chez <strong style="color: #2c5282;">${job.company}</strong>.</p>
      <p>Les fichiers PDF adaptés (CV, Lettre de motivation, et Mémo d'architecture) sont déjà joints à ce brouillon.</p>
      
      <div style="background: #ebf8ff; padding: 20px; border-left: 5px solid #3182ce; margin: 25px 0; border-radius: 4px;">
        <h3 style="margin-top: 0; color: #2b6cb0; font-size: 1.15em;">[Analyse de l'offre - Match : ${job.score}%]</h3>
        <p style="font-style: italic; color: #2d3748; margin-bottom: 12px;">"${job.reasoning}"</p>
        <p style="margin: 0; font-size: 0.9em;"><a href="${job.url}" style="color: #3182ce; text-decoration: underline; font-weight: bold;">Voir l'offre originale sur ${job.source}</a></p>
      </div>
      
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">
      <h4 style="color: #4a5568; margin-bottom: 10px; font-size: 1.1em; border-bottom: 2px solid #edf2f7; padding-bottom: 6px;">Description du poste ciblée :</h4>
      <div style="font-size: 0.9em; color: #2d3748; background: #f7fafc; padding: 18px; border: 1px solid #e2e8f0; border-radius: 8px; white-space: pre-wrap; max-height: 400px; overflow-y: auto; line-height: 1.5;">
${job.job_description_clean || job.raw_description || "Non disponible"}
      </div>

      <p style="margin-top: 25px; font-size: 0.95em; color: #4a5568;">Bien amicalement,<br><strong style="color: #2d3748;">Ton assistant HelloApply</strong></p>
    </div>
  `;
  GmailApp.createDraft("", subject, "", { htmlBody: htmlBody, attachments: attachments });
}
function generateFilesFromTemplate(inputFolder, outputFolder, templateName, markdownText, finalName) {
  const files = inputFolder.getFilesByName(templateName);
  if (!files.hasNext()) throw new Error(`Template ${templateName} introuvable.`);
  const copy = files.next().makeCopy(finalName, outputFolder);
  const doc = DocumentApp.openById(copy.getId());
  
  // Clear any existing headers and footers to prevent legacy template artifacts
  const header = doc.getHeader();
  if (header) {
    header.clear();
  }
  const footer = doc.getFooter();
  if (footer) {
    footer.clear();
  }
  
  const body = doc.getBody();
  
  // Render Markdown beautifully with styles, including robust safe clearing of the template!
  renderMarkdownToDoc(body, markdownText, templateName);
  
  doc.saveAndClose();
  const pdfBlob = copy.getAs(MimeType.PDF).setName(finalName + ".pdf");
  outputFolder.createFile(pdfBlob);
  return { docUrl: copy.getUrl(), pdfBlob: pdfBlob };
}

function clearBodyCompletely(body) {
  // Append a temporary paragraph at the end to make sure there's always at least one paragraph
  const tempPara = body.appendParagraph(" ");
  
  // Now remove all other elements safely
  const numChildren = body.getNumChildren();
  for (let i = numChildren - 2; i >= 0; i--) {
    try {
      body.removeChild(body.getChild(i));
    } catch (e) { /* ignore */ }
  }
  
  return tempPara;
}

function renderMarkdownToDoc(body, markdownText, templateName) {
  // Clear the body completely using our robust clearance engine
  const firstParagraph = clearBodyCompletely(body);

  // Set Margins (Tight ATS: 0.33 inch top/bottom, 0.5 inch left/right to fit everything on 1 page)
  body.setMarginTop(24);
  body.setMarginBottom(24);
  body.setMarginLeft(36);
  body.setMarginRight(36);
  
  const lines = markdownText.split('\n');
  let isFirstLine = true;
  let heading2Count = 0;
  const isCV = templateName.includes("CV") || templateName.toLowerCase().includes("cv");

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    // Skip empty lines in CV to prevent layout breaking. Keep them in Letter with custom small paragraph height.
    if (!line) {
      if (!isCV) {
        const pSpace = body.appendParagraph(" ");
        pSpace.setSpacingBefore(0);
        pSpace.setSpacingAfter(0);
        pSpace.setFontSize(6); // Tiny font size for precise tight paragraph spacing
      }
      continue;
    }
    
    let p;
    let isHeading1 = line.startsWith('# ');
    let isHeading2 = line.startsWith('## ');
    let isHeading3 = line.startsWith('### ');
    
    // Auto-detect numbered lists and treat them as list items (bullets)
    let isNumberedList = /^\d+\s*\.\s+(.*)/.test(line);
    let isListItem = line.startsWith('- ') || line.startsWith('* ') || isNumberedList;
    
    // Note: no manual page break here — rely on section heading SPACING_BEFORE instead.
    
    if (isFirstLine) {
      isFirstLine = false;
      p = firstParagraph;
      
      // If the first line is a bullet item, we append it and safely clean up the empty first paragraph
      if (isListItem) {
        let textVal = " ";
        if (isNumberedList) {
          textVal = line.match(/^\d+\s*\.\s+(.*)/)[1].trim() || " ";
        } else {
          textVal = line.substring(2).trim() || " ";
        }
        const item = body.appendListItem(textVal);
        
        const style = {};
        style[DocumentApp.Attribute.FONT_FAMILY] = 'Roboto';
        style[DocumentApp.Attribute.FONT_SIZE] = 9;
        style[DocumentApp.Attribute.FOREGROUND_COLOR] = '#2D3748';
        style[DocumentApp.Attribute.BOLD] = false; // Disable default bold inheritance
        style[DocumentApp.Attribute.SPACING_BEFORE] = 1;
        style[DocumentApp.Attribute.SPACING_AFTER] = 1;
        style[DocumentApp.Attribute.LINE_SPACING] = 1.05;
        item.setAttributes(style);
        item.setAlignment(DocumentApp.HorizontalAlignment.JUSTIFY);
        item.setGlyphType(DocumentApp.GlyphType.BULLET); // Always enforce bullets (no 1. 2. 3. 4.)
        
        const txt = item.editAsText();
        txt.setFontSize(9);
        txt.setFontFamily('Roboto');
        txt.setBold(false);
        txt.setForegroundColor('#2D3748');
        
        formatInlineStyles(item);
        
        try { body.removeChild(firstParagraph); } catch(e) {}
        continue;
      }
    } else {
      if (isListItem) {
        let textVal = " ";
        if (isNumberedList) {
          textVal = line.match(/^\d+\s*\.\s+(.*)/)[1].trim() || " ";
        } else {
          textVal = line.substring(2).trim() || " ";
        }
        const item = body.appendListItem(textVal);
        
        const style = {};
        style[DocumentApp.Attribute.FONT_FAMILY] = 'Roboto';
        style[DocumentApp.Attribute.FONT_SIZE] = 9;
        style[DocumentApp.Attribute.FOREGROUND_COLOR] = '#2D3748';
        style[DocumentApp.Attribute.BOLD] = false; // Disable default bold inheritance
        style[DocumentApp.Attribute.SPACING_BEFORE] = 1;
        style[DocumentApp.Attribute.SPACING_AFTER] = 1;
        style[DocumentApp.Attribute.LINE_SPACING] = 1.05;
        item.setAttributes(style);
        item.setAlignment(DocumentApp.HorizontalAlignment.JUSTIFY);
        item.setGlyphType(DocumentApp.GlyphType.BULLET); // Always enforce bullets (no 1. 2. 3. 4.)
        
        const txt = item.editAsText();
        txt.setFontSize(9);
        txt.setFontFamily('Roboto');
        txt.setBold(false);
        txt.setForegroundColor('#2D3748');
        
        formatInlineStyles(item);
        continue;
      } else {
        p = body.appendParagraph(" ");
      }
    }
    
    // Configure paragraph p
    if (isHeading1) {
      const textVal = line.substring(2).trim() || " ";
      p.setText(textVal);
      
      const style = {};
      style[DocumentApp.Attribute.FONT_FAMILY] = 'Roboto';
      style[DocumentApp.Attribute.FONT_SIZE] = 16;
      style[DocumentApp.Attribute.BOLD] = true;
      style[DocumentApp.Attribute.FOREGROUND_COLOR] = '#1A365D'; // Premium dark blue
      style[DocumentApp.Attribute.SPACING_BEFORE] = 10;
      style[DocumentApp.Attribute.SPACING_AFTER] = 2;
      p.setAttributes(style);
      p.setAlignment(DocumentApp.HorizontalAlignment.LEFT); // Left-align name per feedback
      formatInlineStyles(p);
    } else if (isHeading2) {
      heading2Count++;
      const textVal = line.substring(3).trim() || " ";
      p.setText(textVal);
      
      const style = {};
      style[DocumentApp.Attribute.FONT_FAMILY] = 'Roboto';
      style[DocumentApp.Attribute.FONT_SIZE] = 11;
      style[DocumentApp.Attribute.BOLD] = true;
      
      // Keep Objet/Subject line in standard charcoal black
      if (textVal.toLowerCase().includes("objet")) {
        style[DocumentApp.Attribute.FOREGROUND_COLOR] = '#2D3748';
      } else {
        style[DocumentApp.Attribute.FOREGROUND_COLOR] = '#2B6CB0'; // Slate Blue
      }
      
      style[DocumentApp.Attribute.SPACING_BEFORE] = 12;
      style[DocumentApp.Attribute.SPACING_AFTER] = 2;
      p.setAttributes(style);
      
      // Center the CV Title (first Heading 2 in CV, which doesn't contain "objet" or "profil")
      if (isCV && heading2Count === 1 && !textVal.toLowerCase().includes("objet") && !textVal.toLowerCase().includes("profil")) {
        style[DocumentApp.Attribute.FONT_SIZE] = 12;
        p.setAttributes(style);
        p.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      } else {
        p.setAlignment(DocumentApp.HorizontalAlignment.LEFT);
      }
      formatInlineStyles(p);
    } else if (isHeading3) {
      const textVal = line.substring(4).trim() || " ";
      p.setText(textVal);
      
      const style = {};
      style[DocumentApp.Attribute.FONT_FAMILY] = 'Roboto';
      style[DocumentApp.Attribute.FONT_SIZE] = 10.5;
      style[DocumentApp.Attribute.BOLD] = true;
      style[DocumentApp.Attribute.FOREGROUND_COLOR] = '#2D3748'; // Charcoal
      style[DocumentApp.Attribute.SPACING_BEFORE] = 4;
      style[DocumentApp.Attribute.SPACING_AFTER] = 2;
      p.setAttributes(style);
      p.setAlignment(DocumentApp.HorizontalAlignment.LEFT);
      formatInlineStyles(p);
    } else {
      const textVal = line.trim() || " ";
      p.setText(textVal);
      
      const style = {};
      style[DocumentApp.Attribute.FONT_FAMILY] = 'Roboto';
      style[DocumentApp.Attribute.FONT_SIZE] = 9;
      style[DocumentApp.Attribute.FOREGROUND_COLOR] = '#2D3748';
      style[DocumentApp.Attribute.BOLD] = false; // Disable default bold inheritance
      style[DocumentApp.Attribute.SPACING_BEFORE] = 2;
      style[DocumentApp.Attribute.SPACING_AFTER] = 2;
      style[DocumentApp.Attribute.LINE_SPACING] = 1.1;
      p.setAttributes(style);
      
      const txt = p.editAsText();
      txt.setFontSize(9);
      txt.setFontFamily('Roboto');
      txt.setBold(false);
      txt.setForegroundColor('#2D3748');
      
      // Right-align date line in cover letter
      if (textVal.startsWith("Lorient, le ") || textVal.startsWith("Lorient, ")) {
        p.setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
      } else {
        p.setAlignment(DocumentApp.HorizontalAlignment.JUSTIFY);
      }
      
      formatInlineStyles(p);
    }
  }
}

function formatInlineStyles(element) {
  let text = element.getText();
  let hasBold = text.includes('**');
  let hasMarkdownLink = text.includes('[');
  let hasPlainLink = text.toLowerCase().includes('linkedin.com') || text.toLowerCase().includes('github.com');
  let hasEmail = text.includes('@');
  if (!hasBold && !hasMarkdownLink && !hasPlainLink && !hasEmail) return;
  
  const textElement = element.editAsText();
  
  // Read existing element-level attributes for base formatting preservation
  let baseFontSize = 9.5;
  let baseFontFamily = 'Roboto';
  let baseColor = '#2D3748';
  
  try {
    const size = element.getAttributes()[DocumentApp.Attribute.FONT_SIZE];
    if (size) baseFontSize = size;
    const family = element.getAttributes()[DocumentApp.Attribute.FONT_FAMILY];
    if (family) baseFontFamily = family;
    const color = element.getAttributes()[DocumentApp.Attribute.FOREGROUND_COLOR];
    if (color) baseColor = color;
  } catch (e) { /* ignore and use standard fallbacks */ }

  // 1. Process Markdown Links: [Link Text](URL)
  let linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let linkMatch;
  while ((linkMatch = linkRegex.exec(text)) !== null) {
    const fullMatch = linkMatch[0];
    const linkText = linkMatch[1];
    const linkUrl = linkMatch[2];
    
    const currentText = element.getText();
    const startIdx = currentText.indexOf(fullMatch);
    if (startIdx !== -1) {
      textElement.deleteText(startIdx, startIdx + fullMatch.length - 1);
      textElement.insertText(startIdx, linkText);
      
      textElement.setLinkUrl(startIdx, startIdx + linkText.length - 1, linkUrl);
      textElement.setForegroundColor(startIdx, startIdx + linkText.length - 1, '#2B6CB0');
      textElement.setUnderline(startIdx, startIdx + linkText.length - 1, true);
      textElement.setFontSize(startIdx, startIdx + linkText.length - 1, baseFontSize);
      textElement.setFontFamily(startIdx, startIdx + linkText.length - 1, baseFontFamily);
      
      text = element.getText();
      linkRegex.lastIndex = 0;
    }
  }
  
  // 2. Process Bold Text: **bold text**
  text = element.getText();
  let boldRegex = /\*\*(.*?)\*\*/g;
  let boldMatch;
  while ((boldMatch = boldRegex.exec(text)) !== null) {
    const fullMatch = boldMatch[0];
    const boldText = boldMatch[1];
    
    const currentText = element.getText();
    const startIdx = currentText.indexOf(fullMatch);
    if (startIdx !== -1) {
      textElement.deleteText(startIdx, startIdx + fullMatch.length - 1);
      textElement.insertText(startIdx, boldText);
      
      textElement.setBold(startIdx, startIdx + boldText.length - 1, true);
      
      // Preserve original text color if it's part of an Objet heading or sender info block
      let highlightColor = '#2B6CB0';
      if (text.toLowerCase().includes("objet") || baseColor === '#1A365D') {
        highlightColor = baseColor;
      }
      textElement.setForegroundColor(startIdx, startIdx + boldText.length - 1, highlightColor);
      textElement.setFontSize(startIdx, startIdx + boldText.length - 1, baseFontSize);
      textElement.setFontFamily(startIdx, startIdx + boldText.length - 1, baseFontFamily);
      
      text = element.getText();
      boldRegex.lastIndex = 0;
    }
  }

  // 3. Process Plain LinkedIn & GitHub Links: linkedin.com/in/... or github.com/...
  text = element.getText();
  let plainRegex = /(?:https?:\/\/)?(?:www\.)?(linkedin\.com\/in\/[^\s|]+|github\.com\/[^\s|]+)/gi;
  let plainMatch;
  while ((plainMatch = plainRegex.exec(text)) !== null) {
    const fullMatch = plainMatch[0];
    const startIdx = text.indexOf(fullMatch);
    if (startIdx !== -1) {
      const endIdx = startIdx + fullMatch.length - 1;
      let destinationUrl = fullMatch;
      if (!destinationUrl.startsWith('http://') && !destinationUrl.startsWith('https://')) {
        destinationUrl = 'https://' + destinationUrl;
      }
      textElement.setLinkUrl(startIdx, endIdx, destinationUrl);
      textElement.setForegroundColor(startIdx, endIdx, '#2B6CB0');
      textElement.setUnderline(startIdx, endIdx, true);
      textElement.setFontSize(startIdx, endIdx, baseFontSize);
      textElement.setFontFamily(startIdx, endIdx, baseFontFamily);
    }
  }

  // 4. Process Plain Email Addresses to make them clickable
  text = element.getText();
  let emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  let emailMatch;
  while ((emailMatch = emailRegex.exec(text)) !== null) {
    const fullMatch = emailMatch[0];
    const startIdx = text.indexOf(fullMatch);
    if (startIdx !== -1) {
      const endIdx = startIdx + fullMatch.length - 1;
      textElement.setLinkUrl(startIdx, endIdx, "mailto:" + fullMatch);
      textElement.setForegroundColor(startIdx, endIdx, '#2B6CB0');
      textElement.setUnderline(startIdx, endIdx, true);
      textElement.setFontSize(startIdx, endIdx, baseFontSize);
      textElement.setFontFamily(startIdx, endIdx, baseFontFamily);
    }
  }
}

/**
 * Detailed Template Diagnostics to scan all files inside the input folder
 */
function getTemplatesDiagnostic() {
  let log = "=== FILES IN INPUT FOLDER ===\n";
  try {
    const root = DriveApp.getRootFolder().getFoldersByName("Candidature Express").next();
    const inputFolder = root.getFoldersByName("input").next();
    
    const files = inputFolder.getFiles();
    if (!files.hasNext()) {
      log += "No files found in 'input' folder.\n";
    }
    
    while (files.hasNext()) {
      const file = files.next();
      log += `\nFile Name: "${file.getName()}"\n`;
      log += `  - MIME Type: ${file.getMimeType()}\n`;
      log += `  - ID: ${file.getId()}\n`;
      
      if (file.getMimeType() === MimeType.GOOGLE_DOCS) {
        try {
          const doc = DocumentApp.openById(file.getId());
          const body = doc.getBody();
          const text = body.getText();
          
          const matches = text.match(/\{[^}]+\}/g) || [];
          const brackets = text.match(/\[[^\]]+\]/g) || [];
          
          log += `  - Found Braces Placeholders: ${JSON.stringify([...new Set(matches)])}\n`;
          log += `  - Found Brackets Placeholders: ${JSON.stringify([...new Set(brackets)])}\n`;
          log += `  - Plain Text Snippet (first 150 chars): "${text.substring(0, 150).replace(/\n/g, " ")}..."\n`;
        } catch (e) {
          log += `  - [ERROR READING CONTENT]: ${e.message}\n`;
        }
      } else {
        log += "  - [NON-GOOGLE-DOC] (cannot inspect inline text)\n";
      }
    }
  } catch (e) {
    log += `[DIAGNOSTIC ERROR] ${e.message}\n`;
  }
  return log;
}

/**
 * Rolling Job Processed Properties
 */
function isJobProcessed(jobId) {
  if (!jobId) return false;
  const props = PropertiesService.getScriptProperties();
  const processed = JSON.parse(props.getProperty('PROCESSED_JOB_IDS') || '[]');
  return processed.indexOf(jobId) !== -1;
}

function markJobProcessed(jobId) {
  if (!jobId) return;
  const props = PropertiesService.getScriptProperties();
  const processed = JSON.parse(props.getProperty('PROCESSED_JOB_IDS') || '[]');
  if (processed.indexOf(jobId) === -1) {
    processed.push(jobId);
    if (processed.length > 500) processed.shift();
    props.setProperty('PROCESSED_JOB_IDS', JSON.stringify(processed));
  }
}

/**
 * Utility: Reset the list of processed job IDs so they can be re-tried.
 * Run this function manually from the Apps Script editor before re-testing.
 */
function resetProcessedJobs() {
  PropertiesService.getScriptProperties().deleteProperty('PROCESSED_JOB_IDS');
  console.log('[RESET] PROCESSED_JOB_IDS cleared. All jobs will be re-processed on next run.');
}

/**
 * HelloWork click-tracking redirect resolver
 */
function resolveRedirects(url) {
  let currentUrl = url;
  let redirectCount = 0;
  while (redirectCount < 5) {
    try {
      const response = UrlFetchApp.fetch(currentUrl, {
        'followRedirects': false,
        'muteHttpExceptions': true,
        'headers': {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const code = response.getResponseCode();
      if (code >= 300 && code < 400) {
        const headers = response.getHeaders();
        const location = headers['Location'] || headers['location'];
        if (location) {
          if (location.startsWith('/')) {
            const domain = currentUrl.match(/^https?:\/\/[^\/]+/)[0];
            currentUrl = domain + location;
          } else {
            currentUrl = location;
          }
          redirectCount++;
          continue;
        }
      }
      break;
    } catch (e) {
      console.error("[ERROR] Redirect resolution: " + e.message);
      break;
    }
  }
  return currentUrl;
}

/**
 * URL Sanitizers
 */
function cleanUrl(url) {
  if (!url) return "";
  let clean = url.trim();
  if (clean.includes('linkedin.com/comm/jobs/view/')) {
    clean = clean.replace('linkedin.com/comm/jobs/view/', 'linkedin.com/jobs/view/');
  }
  if (clean.includes('urlRedirection=')) {
    const match = clean.match(/urlRedirection=([^&]+)/);
    if (match) {
      try {
        clean = decodeURIComponent(match[1]);
      } catch (e) { /* ignore and use original */ }
    }
  }
  return clean;
}

function getJobId(url) {
  if (!url) return "";
  const clean = cleanUrl(url);
  const liMatch = clean.match(/\/view\/(\d+)/);
  if (liMatch) return "LI_" + liMatch[1];
  
  const hwMatch = clean.match(/(?:offre-|emplois\/)(\d+)/);
  if (hwMatch) return "HW_" + hwMatch[1];
  
  return clean;
}

function logToSheet(folder, job, cvUrl, lmUrl, memoUrl) {
  let sheetFile; const files = folder.getFilesByName(TRACKING_SHEET_NAME);
  const status = (cvUrl && lmUrl && memoUrl) ? "Acceptée" : "Rejetée";
  
  const headers = ["Date", "Source", "Entreprise", "Poste", "Score", "Statut", "Lien Offre", "Lien CV (Doc)", "Lien Lettre (Doc)", "Lien Mémo (Doc)", "Lien Origine", "Analyse"];
  
  let sheet;
  if (files.hasNext()) { 
    sheetFile = SpreadsheetApp.openById(files.next().getId()); 
    sheet = sheetFile.getSheets()[0];
    
    // Auto-update spreadsheet headers in-place if they don't match the new layout
    const lastCol = sheet.getLastColumn();
    const existingHeaders = lastCol > 0 ? sheet.getRange(1, 1, 1, Math.max(lastCol, headers.length)).getValues()[0] : [];
    
    // Check if we need to insert the "Lien Mémo (Doc)" column (column 10) dynamically to preserve historical rows
    if (lastCol === 11 && existingHeaders[9] === "Lien Origine") {
      sheet.insertColumnBefore(10);
      console.log(`[UPGRADE] Dynamically inserted column J (10th column) for 'Lien Mémo (Doc)'.`);
    }
    
    let needsUpdate = false;
    if (sheet.getLastColumn() < headers.length) {
      needsUpdate = true;
    } else {
      const currentHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
      for (let i = 0; i < headers.length; i++) {
        if (currentHeaders[i] !== headers[i]) {
          needsUpdate = true;
          break;
        }
      }
    }
    if (needsUpdate) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      console.log(`[UPDATE] Spreadsheet headers updated successfully to match the 12-column layout.`);
    }
  } 
  else {
    sheetFile = SpreadsheetApp.create(TRACKING_SHEET_NAME);
    folder.addFile(DriveApp.getFileById(sheetFile.getId()));
    DriveApp.getRootFolder().removeFile(DriveApp.getFileById(sheetFile.getId()));
    sheet = sheetFile.getSheets()[0];
    sheet.appendRow(headers);
  }
  
  const now = new Date();
  const dateTimeStr = now.toLocaleDateString() + " " + now.toLocaleTimeString();
  sheet.appendRow([dateTimeStr, job.source, job.company, job.position, job.score + "%", status, job.url, cvUrl, lmUrl, memoUrl, job.originalUrl || "", job.reasoning]);
}

function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-3.1-flash-lite:generateContent?key=${GEMINI_API_KEY}`;
  const options = { method: 'post', contentType: 'application/json', payload: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }), muteHttpExceptions: true };
  try {
    const response = UrlFetchApp.fetch(url, options);
    const json = JSON.parse(response.getContentText());
    const outputText = json.candidates[0].content.parts[0].text;
    const match = outputText.match(/\{.*\}/s);
    return JSON.parse(match ? match[0] : outputText);
  } catch (e) { return null; }
}

function extractJobUrls(text) {
  const regex = /https:\/\/[^\s"<>]+/g;
  const matches = text.match(regex) || [];
  return matches.filter(url => {
    const isLinkedIn = url.includes('linkedin.com/');
    const isHelloWork = url.includes('hellowork.com');
    if (isLinkedIn) {
      // Exclusively capture real job posting links containing '/view/' or '/jobs/view/'
      return url.includes('/view/') || url.includes('/jobs/view/');
    }
    if (isHelloWork) {
      // Exclusively capture real click-tracking, redirect or job detail pages
      return url.includes('/clic/') || url.includes('/redirect') || url.includes('/emplois/') || url.includes('/offre-');
    }
    return false;
  });
}

function getOrCreateFolder(name) {
  const folders = DriveApp.getRootFolder().getFoldersByName(name);
  return folders.hasNext() ? folders.next() : DriveApp.getRootFolder().createFolder(name);
}

function getOrCreateFolderIn(parent, name) {
  const folders = parent.getFoldersByName(name);
  return folders.hasNext() ? folders.next() : parent.createFolder(name);
}

function readAnyFileIn(folder, fileName) {
  const files = folder.getFilesByName(fileName);
  if (!files.hasNext()) return null;
  const file = files.next();
  return file.getMimeType() === MimeType.GOOGLE_DOCS ? DocumentApp.openById(file.getId()).getBody().getText() : "";
}
