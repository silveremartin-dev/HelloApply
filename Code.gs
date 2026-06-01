/**
 * HelloApply: Cloud Edition
 * VERSION: 6.2.0 (Resilient Production Safety Shield & Configurable Identity Edition)
 * LAST UPDATED: 23/05/2026 15:10
 * 
 * New in v6.2.0:
 * - Centralized Candidate Profile: Isolated all personal identity details (name, email, phone, links, and template names) in a single configuration block at the very top.
 * - Descriptively Updated Header: Accurate versioning and changelog tracking last modifications.
 * 
 * New in v6.1.0:
 * - Anti-Faux Positive Auth Wall: Refined detection to check redirected final URL and strict EXACT page titles, bypassing common page body headers.
 * - Expected Job ID Context Alignment: Injects regex-extracted job ID to perfectly match tracking URLs inside Gmail fallback alerts.
 * 
 * New in v6.0.0:
 * - Triple-Document Sourcing Engine: Systematically generates CV, traditional Cover Letter, and peer-to-peer Technical Architecture Memo as 3 separate custom PDFs.
 * - Auto-Updating 12-Column Spreadsheet: Automatically upgrades tracking layout in-place to log all three document URLs.
 * - Dynamic Languages Extraction: Extracts languages and levels (e.g. Anglais C2, Espagnol B2) from masterCV to dynamically form a clean "## FORMATION & LANGUES" section.
 * - Strict Banning of "JScience": Ban JScience in all generated documents and replace it exclusively with "Episteme".
 */

// --- CANDIDATE PROFILE ---
const CANDIDATE_PROFILE = {
  fullName: "Silvère Martin-Michiellot",
  safeName: "SilvereMartinMichiellot", // Used in generated file names (alphanumeric, no spaces)
  location: "Lorient, France",
  city: "Lorient",
  phone: "07 67 81 52 02",
  email: "silvere.martin@gmail.com",
  linkedinUrl: "https://www.linkedin.com/in/silvere-martin-michiellot",
  linkedinRaw: "linkedin.com/in/silvere-martin-michiellot/", // Short version for CV formatting
  githubUrl: "https://github.com/silveremartin-dev/",
  githubRaw: "github.com/silveremartin-dev", // Short version for CV formatting
  
  // Google Drive Reference Files (inside input/ folder)
  masterCvName: "mastercv.md",
  templateCvName: "SilvereMartinMichiellot-CV-1pageATS-2026",
  templateLetterName: "Lettre de motivation Silvère Martin-Michiellot 2026b"
};

// --- CONFIGURATION ---
const TEST_MODE = false; // Set to true to run infinite tests on the latest emails

const ROOT_FOLDER_NAME = "Candidature Express";
const INPUT_FOLDER_NAME = "input";
const OUTPUT_FOLDER_NAME = "output";

const MASTER_CV_NAME = CANDIDATE_PROFILE.masterCvName; 
const TEMPLATE_CV_NAME = CANDIDATE_PROFILE.templateCvName;
const TEMPLATE_LETTER_NAME = CANDIDATE_PROFILE.templateLetterName;

const TRACKING_SHEET_NAME = 'Suivi_Candidatures';
const MIN_MATCH_SCORE = 75; 
const MAX_GENERATIONS_PER_RUN = 3; // Prevent timeout & API exhaustion by processing at most 3 jobs in a single run

// --- USER PREFERENCES ---
const PREFERENCES = {
  location: CANDIDATE_PROFILE.location,
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

  // Production & Test mode quotas
  let testLinkedInCount = 0;
  let testHelloWorkCount = 0;
  const TEST_MATCH_THRESHOLD = 95;
  
  let generationCount = 0;
  let exitRequested = false;

  for (const thread of threads) {
    if (exitRequested) break;
    if (TEST_MODE && testLinkedInCount >= 1 && testHelloWorkCount >= 1) break;
    
    // Safety check: close to Google execution limit (6 min)
    if (new Date().getTime() - startTime > MAX_EXECUTION_TIME_MS) {
      console.log(`[TIMEOUT] Proche de la limite Apps Script (6 min). Arrêt gracieux, la suite au prochain passage.`);
      exitRequested = true;
      break;
    }

    if (!TEST_MODE && thread.getLastMessageDate() <= lastRun && !thread.isUnread()) continue;

    const messages = thread.getMessages();
    for (const message of messages) {
      if (exitRequested) break;
      if (TEST_MODE && testLinkedInCount >= 1 && testHelloWorkCount >= 1) break;
      if (new Date().getTime() - startTime > MAX_EXECUTION_TIME_MS) {
        console.log(`[TIMEOUT] Proche de la limite Apps Script (6 min). Arrêt gracieux.`);
        exitRequested = true;
        break;
      }
      
      if (!TEST_MODE && message.getDate() <= lastRun && !message.isUnread()) continue;

      const subject = message.getSubject();
      const body = message.getPlainBody();
      const jobUrls = extractJobUrls(body);
      
      console.log(`[MAIL] Analysing email: "${subject}"`);

      for (let rawUrl of jobUrls) {
        if (exitRequested) break;
        if (TEST_MODE && testLinkedInCount >= 1 && testHelloWorkCount >= 1) break;
        if (new Date().getTime() - startTime > MAX_EXECUTION_TIME_MS) {
          console.log(`[TIMEOUT] Proche de la limite Apps Script (6 min). Arrêt gracieux.`);
          exitRequested = true;
          break;
        }

        let decodedUrl = decodeHelloworkTrackingUrl(rawUrl);
        let url = cleanUrl(decodedUrl);
        const isLinkedIn = url.includes('linkedin.com');
        const isHelloWork = url.includes('hellowork.com');

        // TEST_MODE: skip if we already have 1 LinkedIn + 1 HelloWork
        if (TEST_MODE) {
          if (isLinkedIn && testLinkedInCount >= 1) continue;
          if (isHelloWork && testHelloWorkCount >= 1) continue;
        }
        
        // Resolve click-tracking redirections for HelloWork to get the clean final page link
        if (url.includes('emails.hellowork.com/clic') || url.includes('hellowork.com/redirect')) {
          console.log(`[RESOLVING] Resolving redirect for: ${url}`);
          const resolved = resolveRedirects(url);
          if (!resolved || resolved === url || !resolved.includes('/emplois/')) {
            console.warn(`[SKIP] Could not resolve tracking URL to a valid job page: ${url}`);
            continue; // Skip unresolvable tracking URLs
          }
          url = cleanUrl(resolved);
          console.log(`[RESOLVED] Final URL: ${url}`);
        }
        
        // Strict Post-Resolution Validator: Ensure the final URL is indeed a deep job detail page
        const isRealLinkedInJob = url.includes('linkedin.com/jobs/view/') || url.includes('linkedin.com/view/');
        const isRealHelloWorkJob = url.includes('hellowork.com/') && (url.includes('/emplois/') || url.includes('/offre-'));
        
        if (!isRealLinkedInJob && !isRealHelloWorkJob) {
          console.warn(`[SKIP] Final URL is not a valid job detail page: ${url}`);
          continue;
        }
        
        const jobId = getJobId(url);
        
        // 1st guard: fast ScriptProperties cache (survives between runs, avoids sheet scan)
        if (isJobProcessed(jobId)) {
          console.log(`[SKIP] Already processed (cache): ${jobId}`);
          continue;
        }
        
        // 2nd guard: slower sheet scan (fallback if cache was reset or job was processed before cache existed)
        const previousJob = findJobInSheet(outputFolder, jobId);
        if (previousJob) {
          console.log(`[SKIP] Already processed (sheet): ${jobId} — ${previousJob.position} @ ${previousJob.company} (${previousJob.date})`);
          markJobProcessed(jobId); // Sync cache so future runs are fast
          continue;
        }

        try {
          let description = fetchJobDescription(url);
          let context = description;
          let isFallback = false;
          
          if (!description || description === "authWall") {
            console.warn(`[WARN] Login wall detected for ${url}. Using email content as fallback.`);
            context = `[URL: ${url}]\n[EMAIL SUBJECT: ${subject}]\n[EMAIL BODY: ${body}]`;
            isFallback = true;
          }

          const analysis = analyzeAndTailor(context, masterCV, cvTemplateText, letterTemplateText, url);
          if (analysis) {
            analysis.url = url;
            analysis.originalUrl = rawUrl; // Save original URL from email for reporting
            analysis.source = url.includes('linkedin.com') ? 'LinkedIn' : 'HelloWork';
            analysis.raw_description = context; // Save full context for the draft copy
            analysis.isEmailFallback = isFallback;
            
            const requiredScore = TEST_MODE ? TEST_MATCH_THRESHOLD : MIN_MATCH_SCORE;
            if (analysis.decision === "Postuler" && analysis.score >= requiredScore) {
              processJob(inputFolder, outputFolder, analysis);
              if (TEST_MODE) {
                if (isLinkedIn) testLinkedInCount++;
                else testHelloWorkCount++;
                console.log(`[TEST] Job processed (LinkedIn: ${testLinkedInCount}/1, HelloWork: ${testHelloWorkCount}/1) with score ${analysis.score}%`);
              } else {
                generationCount++;
                console.log(`[GENERATION] Candidature générée (${generationCount}/${MAX_GENERATIONS_PER_RUN}) pour ${analysis.company}`);
                if (generationCount >= MAX_GENERATIONS_PER_RUN) {
                  console.log(`[SHIELD] Cap maximum de générations atteint (${MAX_GENERATIONS_PER_RUN}) pour ce passage. Arrêt gracieux.`);
                  exitRequested = true;
                }
              }
            } else {
              console.log(`[IGNORED] ${analysis.position} at ${analysis.company} (Score: ${analysis.score}%, Decision: ${analysis.decision}, Required: ${requiredScore}%)`);
              logToSheet(outputFolder, analysis, "", "", ""); // Always log rejected/ignored jobs
            }
            
            // Mark job as processed to prevent duplicates
            markJobProcessed(jobId);
          }
          
          // Throttling in production to avoid hitting API rate limits or saturating network resources
          if (!TEST_MODE) {
            console.log(`[THROTTLE] Pause de sécurité de 2 secondes...`);
            Utilities.sleep(2000);
          }
        } catch (e) { console.error(`[ERROR] ${url}: ${e.message}`); }
      }
    }
    
    if (!TEST_MODE && thread.isUnread()) {
      thread.markRead();
      console.log(`[MAIL] Marked thread as read: "${thread.getFirstMessageSubject()}"`);
    }
  }
  if (!TEST_MODE) props.setProperty('LAST_RUN_TIMESTAMP', new Date().toISOString());
}

function analyzeAndTailor(context, masterCV, cvTemplateText, letterTemplateText, originalUrl) {
  const jobId = getJobId(originalUrl);
  const numericId = jobId.replace(/^(HW_|LI_)/, "");
  
  // Dynamically calculate current dates to inject into the LLM prompt
  const now = new Date();
  const monthsFr = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  const monthsEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dateFr = "Lorient, le " + now.getDate() + " " + monthsFr[now.getMonth()] + " " + now.getFullYear();
  const dateEn = "Lorient, " + monthsEn[now.getMonth()] + " " + now.getDate() + ", " + now.getFullYear();

  const prompt = `
    TASK: You are an expert AI sourcing agent and technical ghostwriter. Your objective is to perform an asymmetric application for a highly senior profile.
    You will systematically generate THREE distinct documents in the returned JSON object, and extract five precise meta-fields from the job description:
    - 'contract_type': e.g., "CDI", "CDD", "Freelance", or "?" if you cannot extract the information.
    - 'location': e.g., "Lorient", "Paris", or "?" if you cannot extract the information.
    - 'is_in_morbihan': true or false. Determine if the office/location of the job is situated within the Morbihan department (56) in France (e.g. Lorient, Vannes, Lanester, Ploemeur, Hennebont, Auray, Pontivy, Baud, Sarzeau, etc. are true; Rennes, Nantes, Paris, Brest, Bordeaux, etc. are false).
    - 'workplace_setting': e.g., "Full remote", "Hybride / Télétravail partiel", "Présentiel", or "?" if you cannot extract the information. CRITICAL: Analyze the entire description text carefully, not just the job title, as remote availability is often mentioned only in the description body.
    - 'salary': e.g., "45 000 €", "55 k€", or "?" if you cannot extract the information.
    
    You will return all of this in the JSON structure at the bottom.

    You will systematically generate THREE distinct documents in the returned JSON object:
    1. A tailored dynamic CV ('cv_markdown') positioned as an "Index of Executable Proofs of Work".
    2. A traditional, premium Cover Letter ('letter_markdown') following the "You, Me, Us" narrative structure and formal styling.
    3. A peer-to-peer Technical Architecture Memo ('memo_markdown') targeting the company's core bottlenecks.

    JOB DESCRIPTION:
    ${context}
    
    TARGET JOB URL:
    ${originalUrl}
    
    EXPECTED JOB ID:
    ${jobId}
    
    NUMERIC ID:
    ${numericId}
    
    CRITICAL FALLBACK & CONTEXT ALIGNMENT:
    If the JOB DESCRIPTION above is a multi-job email body (fallback context), you MUST locate the specific job posting matching the TARGET JOB URL or associated with the EXPECTED JOB ID or NUMERIC ID (matching any links containing the sub-strings '\${jobId}' or '\${numericId}'). You are strictly prohibited from evaluating, scoring, or generating documents for any other job posting in the text. All extracted details (position, company, description, match reasoning) MUST align exclusively with the single job posting linked to this TARGET JOB URL / EXPECTED JOB ID / NUMERIC ID.
    
    MASTER CV / SOURCE KNOWLEDGE (THE ONLY SOURCE OF TRUTH):
    ${masterCV}
    
    CRITICAL INSTRUCTIONS FOR TRIPLE-DOCUMENT WRITING:
    0. INPUT VALIDATION & RESTRICTIVENESS (STRICT SHIELD):
       - CRITICAL: If the specific Company Name or Job Title cannot be found in the description (e.g. if it's an auth wall, empty, or generic boilerplate), you MUST set Score = 0 and Decision = "Ignorer". DO NOT invent a job title like "Not specified". DO NOT generate documents.
       - LOCATION FILTER: The candidate is based in Lorient, France. If the job is 'Présentiel' (on-site) or 'Hybride' (hybrid), the location/commune MUST be in the Morbihan department (56) (e.g., Lorient, Vannes, Ploemeur, Lanester, Hennebont, Auray, Pontivy, etc.). If the city is NOT in Morbihan (e.g. Paris, Rennes, Nantes, Brest, Villeurbanne), you MUST set Score = 0 and Decision = "Ignorer".
       - SALARY FILTER: If the annual salary is explicitly mentioned and is strictly below 50k€ (50 000 €) per year, you MUST set Score = 0 and Decision = "Ignorer". If no salary is mentioned, or if it is at or above 50k€ (e.g. 50k€, 55k€, 60k€, etc.), do NOT reject it based on salary.
       - This profile has 30+ years of experience in complex systems. If the role is junior, purely executant, or unrelated to IT Management, Systems Architecture, or Senior AI Engineering, Score strictly < 80%, Decision = "Ignorer".
       
    1. LANGUAGE DETECTION & CONSISTENCY (ABSOLUTE PRIORITY):
        - Detect the native language of the job description (usually English or French).
        - CRITICAL RULE: If the job description is in English, ALL THREE generated documents ('cv_markdown', 'letter_markdown', 'memo_markdown') MUST be written 100% ENTIRELY IN ENGLISH. 
          * This means you MUST fully translate the French Master CV (headings, job titles, achievements, responsibilities, locations, and dates) into premium, high-level corporate English! 
          * Absolutely NO French words should remain in the generated documents (e.g., change "Compétences clés" to "Key Competencies", "Expériences professionnelles" to "Professional Experience", "Formation & Langues" to "Education & Languages", "Présent" to "Present", "le" in dates to "${dateEn}").
          * The French template and the French reference CV below are strictly structure and density references—you must produce their fluent English equivalents.
          * The greetings and Recipient MUST be in English (e.g., "Attention: Hiring Manager", "Dear Hiring Manager,").
          * The closing salutation MUST be in English (e.g., "Sincerely,"). Never mix French closings!
        - If the job description is in French, ALL documents MUST be written 100% entirely in French.
          * The date block MUST be in French (e.g., "${dateFr}").
          * The greeting MUST be "Madame, Monsieur,".
          * The closing salutation MUST be "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.".
       
    1.5. EXECUTIVE WRITING STYLE (Emulate the Gold Standard tone):
       - Emulate the high-impact, prestigious tone of the Gemini 3.1 Pro reference CV below.
       - Write extremely rich, strategic, and metric-heavy bullet points and summaries from the Master CV details. Do not write short or generic bullet points.
       
    <tone_reference_only_do_not_copy>
    [GOLD STANDARD CV EXAMPLE]:
    "\${CANDIDATE_PROFILE.fullName.toUpperCase()} \${CANDIDATE_PROFILE.location} (Remote) | \${CANDIDATE_PROFILE.phone} | \${CANDIDATE_PROFILE.email} 
    LinkedIn: \${CANDIDATE_PROFILE.linkedinRaw} | GitHub: \${CANDIDATE_PROFILE.githubRaw}
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
           \${CANDIDATE_PROFILE.fullName}
           [Target Position Title matching the CV]
           \${CANDIDATE_PROFILE.city} | \${CANDIDATE_PROFILE.phone} | \${CANDIDATE_PROFILE.email}
           LinkedIn: \${CANDIDATE_PROFILE.linkedinUrl}
           GitHub: \${CANDIDATE_PROFILE.githubUrl}
         - A blank line, then the \${CANDIDATE_PROFILE.city} date line, matched to the current date.
         - Recipient: "À l'attention du Responsable du Recrutement - [Company Name]" (or English equivalent).
         - Subject line: "## **Objet : Candidature au poste de [Exact Target Position]**" (or English equivalent) (must be standard black text, no horizontal rules below it).
         - Formal greeting: "Madame, Monsieur," (or English equivalent).
         - Narrative: Clean "You, Me, Us" narrative structure (written entirely in the target language):
           - You: Show deep understanding of their business context, technical environment, and structural challenges.
           - Me: Showcase authority by linking directly to candidate's elite projects (Episteme, Eternity, Open Primer, Swarm Forge, Ether, or Google Antigravity).
           - Us: Propose high-value synergy and immediate technical collaboration.
         - Formal closing salutation: "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées." (or English equivalent).
         - Sign-off: "\${CANDIDATE_PROFILE.fullName}."
         
    3. THE PEER-TO-PEER TECHNICAL ARCHITECTURE MEMO ('memo_markdown'):
       - Replaces traditional cover letter subordination with an elite, peer-to-peer technical architecture memo / flash audit addressed directly to the CTO/CEO.
       - **ABSOLUTE HEADER REQUIREMENT**: The very first block of text in "memo_markdown" must be the raw header block below, with absolutely no greetings, and no subordination formulas ("À l'attention de..."). It must be at the absolute top of the document:
           \${CANDIDATE_PROFILE.fullName}
           [Target Position Title matching the CV]
           \${CANDIDATE_PROFILE.city} | \${CANDIDATE_PROFILE.phone} | \${CANDIDATE_PROFILE.email}
           LinkedIn: \${CANDIDATE_PROFILE.linkedinUrl}
           GitHub: \${CANDIDATE_PROFILE.githubUrl}
       - A blank line, then the \${CANDIDATE_PROFILE.city} date line, positioned right after the header block and before the subject line.
       - Immediately following the date line, write the Subject Line: "## **Mémo d'Architecture : [Identify the core technical challenge or bottleneck implicitly described in the job offer]**" (or English equivalent).
       - Under no circumstances should you prepend any subordination formulas like "À l'attention de la Direction Technique," or traditional greetings like "Madame, Monsieur,". Keep it strictly peer-to-peer, professional, and authoritative.
       - The core content of the Memo must feature:
         - **The Hook (Le Diagnostic):** Start by dissecting their technical environment based on the offer. Point out the likely friction points (e.g., legacy debt, scaling LLMs in production, CI/CD bottlenecks).
         - **The Proposition:** Propose a high-level architectural posture to solve it.
         - **The Proof of Work (CRITICAL):** Explicitly link their bottleneck to the candidate's tangible, production-ready assets (Episteme, Eternity, Open Primer, Swarm Forge, Ether, or Google Antigravity).
         - **The Call to Action (CTA):** Close assertively. E.g., "Je vous propose d'auditer cette architecture lors d'un premier échange technique." (or English equivalent).
         - **Sign-off:** "\${CANDIDATE_PROFILE.fullName}."

     4. THE CV AS AN INDEX ('cv_markdown'):
        - Use "### " for job titles/companies or sub-sections (e.g. "### Lead Architecte & Développeur Open Source — Mécénat GitHub | \${CANDIDATE_PROFILE.city} | 07/2025 - Présent").
        - Maintain strict Markdown formatting: "# " for name, normal paragraphs for contact info, "## [TARGET POSITION]" for the dynamic title.
        - Contact info must include exactly these lines without any bullet points:
          \${CANDIDATE_PROFILE.city} | \${CANDIDATE_PROFILE.phone} | \${CANDIDATE_PROFILE.email}
          LinkedIn: \${CANDIDATE_PROFILE.linkedinUrl}
          GitHub: \${CANDIDATE_PROFILE.githubUrl}
        - **MANDATORY SECTIONS**: You MUST include a "## COMPÉTENCES CLÉS" (in French) or "## KEY COMPETENCIES" (in English) section right after the profile summary. Never skip it.
        - **NO HALLUCINATION OF DATES OR ROLES**: You MUST strictly use the exact dates, company names, and official job titles from the masterCV. Do not alter dates (e.g., Hardis Group is 2011-2012) and do not invent roles (e.g., do not say you were Freelance in 2023 if it's not in the masterCV).
        - **NO META-COMMENTS**: Never include AI notes or comments like "Additional historical experience maintained...". Output only the final CV text.
        - **MAXIMUM DENSITY AND DETAIL (DO NOT TRUNCATE OR SUMMARIZE)**: Do not ever summarize, shorten, or truncate the professional experiences. You must retrieve and strictly preserve the complete, exhaustive list of responsibilities, tasks, detailed technologies used, methodologies (Agile, TDD, Design Patterns, UML), and quantified metrics from the "masterCV" source for each experience (e.g., Deloitte, Hardis, Fives Syleps, etc.). Every single experience must be highly informative, fully detailed, and dense with concrete achievements.
        - Highlight the capability to govern AI and structure complex logic (not just write code).
        - Ensure all metrics (budgets, team sizes, time saved) and the mandatory "**Environnement technique :**" (in French) or "**Technical Environment:**" (in English) line at the end of every experience are strictly preserved.
        - Do not use numbered lists (1. 2. 3.). Use standard bullet points (- or *).
        - **DYNAMIC LANGUAGES EXTRACTION**: Format a clean "## FORMATION & LANGUES" (in French) or "## EDUCATION & LANGUAGES" (in English) section at the end of the CV. You MUST systematically list all 4 languages from the masterCV (English, French, Italian, Spanish) and their levels, translated to the target language (e.g. Anglais, Français, Italien, Espagnol).
        - **PAGE FILLING**: The rendered CV must fill the page(s) almost entirely. Do NOT leave large blank space at the bottom of any page. If the content fits on 1 page, expand bullet points with more detail from the masterCV to fill the page. If there is enough relevant material for the target role, you may use 2 pages, but never leave half a page blank.
        
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
       "contract_type": "CDI", // or other type, or "?" if not found
       "location": "Lorient", // or other city, or "?" if not found
       "is_in_morbihan": true, // or false. Determine if the office/commune is in the Morbihan department (56).
       "workplace_setting": "Full remote", // or "Hybride / Télétravail partiel", "Présentiel", or "?" if not found
       "salary": "Salary string (e.g. 55k€, 45-50 k€) or '?' if not found",
       "job_description_clean": "Cleaned job description in plain text...",
       "language": "en" or "fr",
       "cv_markdown": "Full CV tailored as an authoritative index of technical assets...",
       "letter_markdown": "The traditional Cover Letter following the premium You-Me-Us structure...",
       "memo_markdown": "The peer-to-peer Technical Architecture Memo..."
     }
  `;
  
  let result = callGemini(prompt);
  if (result) {
    if (result.score !== undefined) {
      let sc = parseFloat(result.score);
      if (!isNaN(sc)) {
        if (sc <= 1.0) {
          result.score = Math.round(sc * 100);
        } else {
          result.score = Math.round(sc);
        }
      }
    }
    const fields = ['cv_markdown', 'letter_markdown', 'memo_markdown'];
    fields.forEach(field => {
      if (result[field]) {
        // Robust programmatic shield to replace JScience with Episteme (case-insensitive)
        result[field] = result[field].replace(/jscience/gi, "Episteme");
      }
    });

    // --- JS Post-Analysis Filters ---
    const workplaceSetting = (result.workplace_setting || "").toLowerCase();
    const locationStr = (result.location || "").toLowerCase();
    const isLinkedIn = originalUrl.includes('linkedin.com');
    const isHelloWork = originalUrl.includes('hellowork.com');
    const inMorbihan = result.is_in_morbihan === true || isMorbihan(locationStr);
    
    // 1. Contract Type Filter (CDI only)
    const contractType = (result.contract_type || "").toUpperCase();
    if (contractType !== "CDI") {
      console.log(`[FILTER] Rejected ${result.company} because contract type is "${result.contract_type}" instead of CDI.`);
      result.decision = "Ignorer";
      result.score = 0;
      result.reasoning = `Contrat autre que CDI (${result.contract_type}). ${result.reasoning}`;
    }
    
    // 2. HelloWork Location Filter (Morbihan only)
    if (isHelloWork && !inMorbihan) {
      console.log(`[FILTER] Rejected ${result.company} (HelloWork) because location "${result.location}" is not in Morbihan.`);
      result.decision = "Ignorer";
      result.score = 0;
      result.reasoning = `Offre HelloWork hors Morbihan: ${result.location}. ${result.reasoning}`;
    }
    
    // 3. LinkedIn Location & Workplace Setting Filter
    if (isLinkedIn) {
      const isFullRemote = workplaceSetting.includes("remote") || workplaceSetting.includes("télétravail") || workplaceSetting.includes("distance");
      if (!inMorbihan && !isFullRemote) {
        console.log(`[FILTER] Rejected ${result.company} (LinkedIn) because it is outside Morbihan ("${result.location}") and not Full Remote (Setting: "${result.workplace_setting}").`);
        result.decision = "Ignorer";
        result.score = 0;
        result.reasoning = `Offre LinkedIn hors Morbihan et non Full Remote: ${result.location} (${result.workplace_setting}). ${result.reasoning}`;
      }
    }
    
    // 4. Salary Filter (>= 50k€)
    if (isSalaryBelow50k(result.salary)) {
      console.log(`[FILTER] Rejected ${result.company} because salary "${result.salary}" is explicitly below 50k€.`);
      result.decision = "Ignorer";
      result.score = 0;
      result.reasoning = `Salaire inférieur à 50k€: ${result.salary}. ${result.reasoning}`;
    }
  }
  return result;
}
/**
 * URL Transformation & Fetching
 * 3-tier extraction strategy:
 *   1. JSON-LD JobPosting schema  (cleanest — immune to cookie banners / login overlays)
 *   2. Open Graph meta tags       (title + description fallback)
 *   3. Targeted HTML scraping     (last resort, strips scripts/styles and finds content areas)
 */
function fetchJobDescription(url) {
  try {
    const options = {
      'muteHttpExceptions': true,
      'followRedirects': true,
      'headers': {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    };
    const response = UrlFetchApp.fetch(url, options);
    const html = response.getContentText();
    const htmlLower = html.toLowerCase();

    // --- TRUE auth wall: response code indicates unauthorized or page title confirms login page ---
    const code = response.getResponseCode();
    const titleIsLogin = /<title[^>]*>\s*(sign in|connexion|se connecter|authwall|login)\s*<\/title>/i.test(html);
    if (code === 401 || code === 403 || titleIsLogin) {
      console.warn(`[AUTH WALL] Login page detected (Code: ${code}, Title: ${titleIsLogin})`);
      return 'authWall';
    }

    // --- Tier 1: JSON-LD JobPosting (best quality, works even with overlays) ---
    const jsonLd = extractJsonLdJobPosting(html);
    if (jsonLd && jsonLd.length > 100) {
      console.log(`[FETCH] ✅ Tier 1 — JSON-LD JobPosting extracted (${jsonLd.length} chars)`);
      return jsonLd;
    }

    // --- Tier 2: Strip HTML & targeted descriptions (full detailed content) ---
    const stripped = extractStrippedContent(html, url);
    if (stripped && stripped.length > 200) {
      console.log(`[FETCH] ✅ Tier 2 — Detailed HTML/JSON content extracted (${stripped.length} chars)`);
      return stripped;
    }

    // --- Tier 3: Open Graph / meta tags (last resort summary fallback) ---
    const og = extractOpenGraphJob(html);
    if (og && og.length > 150) {
      console.log(`[FETCH] ✅ Tier 3 — Open Graph metadata fallback extracted (${og.length} chars)`);
      return og;
    }

    // Nothing useful found at all
    console.warn(`[FETCH] ❌ No usable content found for ${url}`);
    return 'authWall';

  } catch (e) {
    console.error(`[FETCH ERROR] ${url}: ${e.message}`);
    return null;
  }
}

/** Extracts a clean text summary from a JSON-LD JobPosting schema block */
function extractJsonLdJobPosting(html) {
  try {
    const jsonLdRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = jsonLdRegex.exec(html)) !== null) {
      try {
        const data = JSON.parse(match[1]);
        const posting = findJobPostingNode(data);
        if (posting) return formatJobPostingNode(posting);
      } catch (e) { /* malformed JSON, skip */ }
    }
  } catch (e) {}
  return null;
}

/** Recursively finds a JobPosting node in a JSON-LD graph */
function findJobPostingNode(data) {
  if (!data) return null;
  if (data['@type'] === 'JobPosting') return data;
  if (Array.isArray(data)) {
    for (const item of data) {
      const found = findJobPostingNode(item);
      if (found) return found;
    }
  }
  if (data['@graph']) return findJobPostingNode(data['@graph']);
  return null;
}

/** Formats a JobPosting node into a clean readable string for Gemini */
function formatJobPostingNode(p) {
  const clean = s => (s || '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ').replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
  const parts = [];
  if (p.title)                          parts.push(`Poste : ${clean(p.title)}`);
  if (p.hiringOrganization)             parts.push(`Entreprise : ${clean(p.hiringOrganization.name || p.hiringOrganization)}`);
  if (p.jobLocation && p.jobLocation.address) {
    const a = p.jobLocation.address;
    parts.push(`Lieu : ${[a.addressLocality, a.addressRegion, a.addressCountry].filter(Boolean).join(', ')}`);
  }
  if (p.employmentType)                 parts.push(`Contrat : ${clean(p.employmentType)}`);
  if (p.datePosted)                     parts.push(`Date : ${p.datePosted}`);
  if (p.baseSalary && p.baseSalary.value) {
    const v = p.baseSalary.value;
    parts.push(`Salaire : ${v.minValue || ''}–${v.maxValue || ''} ${v.unitText || ''}`.trim());
  }
  if (p.description)                    parts.push(`\nDescription :\n${clean(p.description)}`);
  if (p.skills)                         parts.push(`Compétences : ${clean(Array.isArray(p.skills) ? p.skills.join(', ') : p.skills)}`);
  if (p.qualifications)                 parts.push(`Qualifications : ${clean(p.qualifications)}`);
  const result = parts.join('\n');
  return result.length > 50 ? result : null;
}

/** Extracts Open Graph / meta tag summary as fallback */
function extractOpenGraphJob(html) {
  const metas = {};
  const metaRegex = /<meta[^>]+(?:property|name)=["']([^"']+)["'][^>]+content=["']([^"']*?)["'][^>]*>/gi;
  let m;
  while ((m = metaRegex.exec(html)) !== null) metas[m[1]] = m[2];
  const parts = [];
  if (metas['og:title'])       parts.push(`Poste : ${metas['og:title']}`);
  if (metas['og:site_name'])   parts.push(`Source : ${metas['og:site_name']}`);
  if (metas['og:description']) parts.push(`Description : ${metas['og:description']}`);
  if (metas['description'])    parts.push(`Résumé : ${metas['description']}`);
  return parts.join('\n');
}

/** Last-resort: strip scripts/styles/tags, prioritise large text blocks */
function extractStrippedContent(html, url) {
  // Remove noisy blocks
  let cleaned = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gmi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gmi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  // For LinkedIn: the job description lives in <code> tags as serialised JSON (Voyager API)
  if (url && url.includes('linkedin.com')) {
    const codeMatch = cleaned.match(/<code[^>]*>([\s\S]{500,}?)<\/code>/i);
    if (codeMatch) {
      try {
        // Try to pull plain text out of the encoded JSON blob
        const decoded = codeMatch[1].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&quot;/g,'"');
        const descMatch = decoded.match(/"description"\s*:\s*"([\s\S]{100,}?)(?<!\\)"/);
        if (descMatch) return `Description LinkedIn :\n${descMatch[1].replace(/\\n/g,'\n').replace(/\\u[\da-f]{4}/gi, c => String.fromCharCode(parseInt(c.slice(2), 16)))}`.substring(0, 40000);
      } catch(e) {}
    }
  }

  // Generic: strip remaining tags
  return cleaned
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 40000);
}



/**
 * Process Job
 */
function processJob(inputFolder, outputFolder, job) {
  let cvDocUrl = ""; let lmDocUrl = ""; let memoDocUrl = ""; let attachments = [];
  try {
    const rand = Math.floor(Math.random() * 900000) + 10000;
    const cvName = `${CANDIDATE_PROFILE.safeName}-CV-2026-${rand}`;
    const lmName = `${CANDIDATE_PROFILE.safeName}-LM-2026-${rand}`;
    const memoName = `${CANDIDATE_PROFILE.safeName}-Memo-2026-${rand}`;
    
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
        
        <div style="margin: 15px 0; padding: 10px; background: #fff; border-radius: 6px; border: 1px solid #bee3f8; font-size: 0.9em; color: #2d3748;">
          <ul style="margin: 0; padding-left: 20px; list-style-type: square; line-height: 1.5;">
            <li><strong>Type de contrat :</strong> ${job.contract_type || "?"}</li>
            <li><strong>Lieu :</strong> ${job.location || "?"}</li>
            <li><strong>Cadre de travail :</strong> ${job.workplace_setting || "?"}</li>
            <li><strong>Salaire :</strong> ${job.salary || "?"}</li>
          </ul>
        </div>
        
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
  const isCV = templateName.includes("CV") || templateName.toLowerCase().includes("cv");
  
  if (isCV) {
    // --- CV DYNAMIC LAYOUT OPTIMIZER ---
    // Start with Standard Comfortable layout
    let layout = {
      bodySize: 10,
      h1Size: 16,
      h2Size: 11,
      h3Size: 11,
      marginTop: 24,
      marginBottom: 24,
      marginLeft: 36,
      marginRight: 36,
      lineSpacing: 1.15,
      spacingBeforeH1: 10,
      spacingAfterH1: 2,
      spacingBeforeH2: 14,
      spacingAfterH2: 3,
      spacingBeforeH3: 6,
      spacingAfterH3: 2,
      spacingBeforeBody: 2,
      spacingAfterBody: 2,
      spacingBeforeList: 1,
      spacingAfterList: 1
    };
    
    renderMarkdownToDoc(body, markdownText, templateName, layout);
    doc.saveAndClose();
    
    let pdfFile = null;
    let pageCount = 1;
    try {
      const pdfBlobTemp = copy.getAs(MimeType.PDF);
      pdfFile = outputFolder.createFile(pdfBlobTemp.setName(finalName + "_temp.pdf"));
      pageCount = getPdfPageCount(pdfFile.getId());
      pdfFile.setTrashed(true); // Clean up temp file
    } catch (e) {
      console.warn("[WARN] Could not measure page count: " + e.message);
    }
    
    console.log(`[CV OPTIMIZER] Standard render page count: ${pageCount} pages. Char count: ${markdownText.length}`);
    
    // If standard layout spills slightly onto the 2nd page, try to fit it on exactly 1 page
    if (pageCount === 2) {
      console.log("[CV OPTIMIZER] Spills onto 2 pages. Attempting compact render to fit on 1 page...");
      let compactLayout = {
        bodySize: 9.3,
        h1Size: 14,
        h2Size: 10,
        h3Size: 10,
        marginTop: 18,
        marginBottom: 18,
        marginLeft: 30,
        marginRight: 30,
        lineSpacing: 1.1,
        spacingBeforeH1: 8,
        spacingAfterH1: 1,
        spacingBeforeH2: 10,
        spacingAfterH2: 2,
        spacingBeforeH3: 4,
        spacingAfterH3: 1,
        spacingBeforeBody: 1,
        spacingAfterBody: 1,
        spacingBeforeList: 0.5,
        spacingAfterList: 0.5
      };
      
      const docToReopen = DocumentApp.openById(copy.getId());
      const bodyToReopen = docToReopen.getBody();
      renderMarkdownToDoc(bodyToReopen, markdownText, templateName, compactLayout);
      docToReopen.saveAndClose();
      
      let compactPageCount = 2;
      try {
        const pdfBlobTemp = copy.getAs(MimeType.PDF);
        pdfFile = outputFolder.createFile(pdfBlobTemp.setName(finalName + "_temp.pdf"));
        compactPageCount = getPdfPageCount(pdfFile.getId());
        pdfFile.setTrashed(true);
      } catch (e) {}
      
      console.log(`[CV OPTIMIZER] Compact render page count: ${compactPageCount} page(s).`);
      
      if (compactPageCount === 1) {
        console.log(`[CV OPTIMIZER] Success! CV successfully compressed into exactly 1 page.`);
        // Keep compact version!
      } else {
        // If it still doesn't fit on 1 page, it's a genuine 2-page CV.
        // We will render it with a comfortable layout to fill the 2 pages beautifully.
        console.log(`[CV OPTIMIZER] Genuine 2-page CV. Reverting to comfortable standard layout.`);
        const docToReopen2 = DocumentApp.openById(copy.getId());
        const bodyToReopen2 = docToReopen2.getBody();
        renderMarkdownToDoc(bodyToReopen2, markdownText, templateName, layout);
        docToReopen2.saveAndClose();
      }
    } else if (pageCount > 2) {
      // If it spills onto page 3, attempt to fit it on 2 pages!
      console.log("[CV OPTIMIZER] Spills onto 3 pages. Attempting compact render to fit on 2 pages...");
      let compactLayout2 = {
        bodySize: 9.3,
        h1Size: 14,
        h2Size: 10,
        h3Size: 10,
        marginTop: 18,
        marginBottom: 18,
        marginLeft: 30,
        marginRight: 30,
        lineSpacing: 1.1,
        spacingBeforeH1: 8,
        spacingAfterH1: 1,
        spacingBeforeH2: 10,
        spacingAfterH2: 2,
        spacingBeforeH3: 4,
        spacingAfterH3: 1,
        spacingBeforeBody: 1,
        spacingAfterBody: 1,
        spacingBeforeList: 0.5,
        spacingAfterList: 0.5
      };
      
      const docToReopen3 = DocumentApp.openById(copy.getId());
      const bodyToReopen3 = docToReopen3.getBody();
      renderMarkdownToDoc(bodyToReopen3, markdownText, templateName, compactLayout2);
      docToReopen3.saveAndClose();
    }
  } else {
    // Non-CV: standard render
    renderMarkdownToDoc(body, markdownText, templateName);
    doc.saveAndClose();
  }
  
  const pdfBlob = copy.getAs(MimeType.PDF).setName(finalName + ".pdf");
  outputFolder.createFile(pdfBlob);
  return { docUrl: copy.getUrl(), pdfBlob: pdfBlob };
}

/**
 * Utility to parse PDF page count from PDF binary stream (using `/Type /Pages /Count N`)
 */
function getPdfPageCount(fileId) {
  try {
    const file = DriveApp.getFileById(fileId);
    const blob = file.getAs(MimeType.PDF);
    const data = blob.getDataAsString();
    
    // Parse standard PDF Page Tree Pages object and get Count property
    const pagesTreeMatch = data.match(/\/Type\s*\/Pages[\s\S]*?\/Count\s+(\d+)/);
    if (pagesTreeMatch) {
      const pageCount = parseInt(pagesTreeMatch[1], 10);
      if (pageCount > 0 && pageCount < 10) return pageCount;
    }
    
    // Fallback Page Object regex matching
    const countMatch = data.match(/\/Count\s+(\d+)/);
    if (countMatch) {
      const pageCount = parseInt(countMatch[1], 10);
      if (pageCount > 0 && pageCount < 10) return pageCount;
    }
    
    const pagesMatch = data.match(/\/Type\s*\/Page\b/g);
    if (pagesMatch) {
      return pagesMatch.length;
    }
  } catch (e) {
    console.warn("[WARN] Error parsing PDF page count: " + e.message);
  }
  return 1; // Default fallback
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

function renderMarkdownToDoc(body, markdownText, templateName, layout) {
  // Clear the body completely using our robust clearance engine
  const firstParagraph = clearBodyCompletely(body);

  const isCV = templateName.includes("CV") || templateName.toLowerCase().includes("cv");

  // Layout default variables (can be adjusted dynamically)
  const cfg = layout || {
    bodySize: 10,
    h1Size: 16,
    h2Size: 11,
    h3Size: 11,
    marginTop: 24,
    marginBottom: 24,
    marginLeft: 36,
    marginRight: 36,
    lineSpacing: 1.15,
    spacingBeforeH1: 10,
    spacingAfterH1: 2,
    spacingBeforeH2: 14,
    spacingAfterH2: 3,
    spacingBeforeH3: 6,
    spacingAfterH3: 2,
    spacingBeforeBody: 2,
    spacingAfterBody: 2,
    spacingBeforeList: 1,
    spacingAfterList: 1
  };

  // Set Margins
  body.setMarginTop(cfg.marginTop);
  body.setMarginBottom(cfg.marginBottom);
  body.setMarginLeft(cfg.marginLeft);
  body.setMarginRight(cfg.marginRight);
  
  const lines = markdownText.split('\n');
  let isFirstLine = true;
  let heading2Count = 0;

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
        style[DocumentApp.Attribute.FONT_SIZE] = cfg.bodySize;
        style[DocumentApp.Attribute.FOREGROUND_COLOR] = '#2D3748';
        style[DocumentApp.Attribute.BOLD] = false; // Disable default bold inheritance
        style[DocumentApp.Attribute.SPACING_BEFORE] = cfg.spacingBeforeList;
        style[DocumentApp.Attribute.SPACING_AFTER] = cfg.spacingAfterList;
        style[DocumentApp.Attribute.LINE_SPACING] = cfg.lineSpacing;
        item.setAttributes(style);
        item.setAlignment(DocumentApp.HorizontalAlignment.JUSTIFY);
        item.setGlyphType(DocumentApp.GlyphType.BULLET); // Always enforce bullets
        
        const txt = item.editAsText();
        txt.setFontSize(cfg.bodySize);
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
        style[DocumentApp.Attribute.FONT_SIZE] = cfg.bodySize;
        style[DocumentApp.Attribute.FOREGROUND_COLOR] = '#2D3748';
        style[DocumentApp.Attribute.BOLD] = false; // Disable default bold inheritance
        style[DocumentApp.Attribute.SPACING_BEFORE] = cfg.spacingBeforeList;
        style[DocumentApp.Attribute.SPACING_AFTER] = cfg.spacingAfterList;
        style[DocumentApp.Attribute.LINE_SPACING] = cfg.lineSpacing;
        item.setAttributes(style);
        item.setAlignment(DocumentApp.HorizontalAlignment.JUSTIFY);
        item.setGlyphType(DocumentApp.GlyphType.BULLET); // Always enforce bullets
        
        const txt = item.editAsText();
        txt.setFontSize(cfg.bodySize);
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
      style[DocumentApp.Attribute.FONT_SIZE] = cfg.h1Size;
      style[DocumentApp.Attribute.BOLD] = true;
      style[DocumentApp.Attribute.FOREGROUND_COLOR] = '#1A365D'; // Premium dark blue
      style[DocumentApp.Attribute.SPACING_BEFORE] = cfg.spacingBeforeH1;
      style[DocumentApp.Attribute.SPACING_AFTER] = cfg.spacingAfterH1;
      p.setAttributes(style);
      try {
        p.setAttributes({ [DocumentApp.Attribute.KEEP_WITH_NEXT]: true });
      } catch (e) {
        console.warn("[WARN] Could not set KEEP_WITH_NEXT on H1: " + e.message);
      }
      p.setAlignment(DocumentApp.HorizontalAlignment.LEFT);
      formatInlineStyles(p);
    } else if (isHeading2) {
      heading2Count++;
      const textVal = line.substring(3).trim() || " ";
      p.setText(textVal);
      
      const style = {};
      style[DocumentApp.Attribute.FONT_FAMILY] = 'Roboto';
      style[DocumentApp.Attribute.FONT_SIZE] = cfg.h2Size;
      style[DocumentApp.Attribute.BOLD] = true;
      
      // Keep Objet/Subject line in standard charcoal black
      if (textVal.toLowerCase().includes("objet")) {
        style[DocumentApp.Attribute.FOREGROUND_COLOR] = '#2D3748';
      } else {
        style[DocumentApp.Attribute.FOREGROUND_COLOR] = '#2B6CB0'; // Slate Blue
      }
      
      style[DocumentApp.Attribute.SPACING_BEFORE] = cfg.spacingBeforeH2;
      style[DocumentApp.Attribute.SPACING_AFTER] = cfg.spacingAfterH2;
      p.setAttributes(style);
      try {
        p.setAttributes({ [DocumentApp.Attribute.KEEP_WITH_NEXT]: true });
      } catch (e) {
        console.warn("[WARN] Could not set KEEP_WITH_NEXT on H2: " + e.message);
      }
      
      // Center the CV Title (first Heading 2 in CV, which doesn't contain "objet" or "profil")
      if (isCV && heading2Count === 1 && !textVal.toLowerCase().includes("objet") && !textVal.toLowerCase().includes("profil")) {
        style[DocumentApp.Attribute.FONT_SIZE] = cfg.h2Size + 1; // Slightly larger for CV main title
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
      style[DocumentApp.Attribute.FONT_SIZE] = cfg.h3Size;
      style[DocumentApp.Attribute.BOLD] = true;
      style[DocumentApp.Attribute.FOREGROUND_COLOR] = '#2D3748'; // Charcoal
      style[DocumentApp.Attribute.SPACING_BEFORE] = cfg.spacingBeforeH3;
      style[DocumentApp.Attribute.SPACING_AFTER] = cfg.spacingAfterH3;
      p.setAttributes(style);
      try {
        p.setAttributes({ [DocumentApp.Attribute.KEEP_WITH_NEXT]: true });
      } catch (e) {
        console.warn("[WARN] Could not set KEEP_WITH_NEXT on H3: " + e.message);
      }
      p.setAlignment(DocumentApp.HorizontalAlignment.LEFT);
      formatInlineStyles(p);
    } else {
      const textVal = line.trim() || " ";
      p.setText(textVal);
      
      const style = {};
      style[DocumentApp.Attribute.FONT_FAMILY] = 'Roboto';
      style[DocumentApp.Attribute.FONT_SIZE] = cfg.bodySize;
      style[DocumentApp.Attribute.FOREGROUND_COLOR] = '#2D3748';
      style[DocumentApp.Attribute.BOLD] = false; // Disable default bold inheritance
      style[DocumentApp.Attribute.SPACING_BEFORE] = cfg.spacingBeforeBody;
      style[DocumentApp.Attribute.SPACING_AFTER] = cfg.spacingAfterBody;
      style[DocumentApp.Attribute.LINE_SPACING] = cfg.lineSpacing;
      p.setAttributes(style);
      
      const txt = p.editAsText();
      txt.setFontSize(cfg.bodySize);
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
  let baseFontSize = 10;
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

/**
 * Scan the tracking sheet to look up a previously processed job by its ID.
 * Returns the job details if found, or null if not found.
 */
function findJobInSheet(folder, jobId) {
  if (!jobId) return null;
  try {
    const files = folder.getFilesByName(TRACKING_SHEET_NAME);
    if (!files.hasNext()) return null;
    
    const sheetFile = SpreadsheetApp.openById(files.next().getId());
    const sheet = sheetFile.getSheets()[0];
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return null;
    
    const lastCol = sheet.getLastColumn();
    const data = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
    
    // Search from bottom to top (most recent first)
    for (let i = data.length - 1; i >= 0; i--) {
      const row = data[i];
      const offerUrl = row[6] || "";
      if (offerUrl) {
        const rowJobId = getJobId(offerUrl);
        if (rowJobId === jobId) {
          let scoreVal = row[4];
          if (typeof scoreVal === 'number') {
            if (scoreVal <= 1.0) {
              scoreVal = Math.round(scoreVal * 100) + "%";
            } else {
              scoreVal = scoreVal + "%";
            }
          } else {
            scoreVal = String(scoreVal || "");
            if (scoreVal && !scoreVal.includes('%')) {
              scoreVal = scoreVal + "%";
            }
          }
          return {
            date: row[0],
            source: row[1],
            company: row[2],
            position: row[3],
            score: scoreVal,
            status: row[5],
            url: row[6],
            cvUrl: row[7] || "",
            lmUrl: row[8] || "",
            memoUrl: row[9] || "",
            originalUrl: row[10] || "",
            reasoning: row[11] || ""
          };
        }
      }
    }
  } catch (e) {
    console.warn(`[WARN] Error scanning spreadsheet for duplicate jobId ${jobId}: ${e.message}`);
  }
  return null;
}

function markJobProcessed(jobId) {
  if (!jobId) return;
  const props = PropertiesService.getScriptProperties();
  const processed = JSON.parse(props.getProperty('PROCESSED_JOB_IDS') || '[]');
  if (processed.indexOf(jobId) === -1) {
    processed.push(jobId);
    if (processed.length > 300) processed.shift();
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
 * Decodes HelloWork base64url tracking click URL to its real destination URL.
 */
function decodeHelloworkTrackingUrl(url) {
  if (!url || !url.includes('emails.hellowork.com/clic')) return url;
  try {
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    if (!lastPart) return url;
    
    // Replace URL-safe base64 characters
    const base64Str = lastPart.replace(/-/g, '+').replace(/_/g, '/');
    const decodedBytes = Utilities.base64Decode(base64Str);
    const decodedStr = Utilities.newBlob(decodedBytes).getDataAsString('UTF-8');
    
    const httpsIndex = decodedStr.indexOf('https://');
    if (httpsIndex !== -1) {
      return decodedStr.substring(httpsIndex);
    }
  } catch (e) {
    console.error("[ERROR] Decoding HelloWork tracking URL: " + e.message);
  }
  return url;
}

/**
 * URL Sanitizers
 */
function cleanUrl(url) {
  if (!url) return "";
  let clean = url.trim();
  
  // First, if the URL is completely encoded or has encoded parts, decode it
  try {
    const decoded = decodeURIComponent(clean);
    // If it contains a nested linkedin or hellowork URL, extract it
    const nestedMatch = decoded.match(/(https?:\/\/(?:www\.)?(?:linkedin\.com|hellowork\.com)[^\s"'<>]+)/i);
    if (nestedMatch) {
      clean = nestedMatch[1];
    }
  } catch (e) {}

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
  // Always strip query string (? and everything after) to avoid redirect walls and tracking params
  const qIndex = clean.indexOf('?');
  if (qIndex !== -1) {
    clean = clean.substring(0, qIndex);
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
  
  let status = "Rejetée";
  if (cvUrl && lmUrl && memoUrl) {
    status = "Acceptée";
  } else if (job.isEmailFallback) {
    status = "Rejetée (sur email, à revoir)";
  }
  
  const headers = ["Date", "Source", "Entreprise", "Poste", "Score", "Statut", "Salaire", "Lien Offre", "Lien CV (Doc)", "Lien Lettre (Doc)", "Lien Mémo (Doc)", "Lien Origine", "Analyse"];
  
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
    
    // Check if we need to insert the "Salaire" column (column 7) dynamically to preserve historical rows
    const updatedCol = sheet.getLastColumn();
    const updatedHeaders = updatedCol > 0 ? sheet.getRange(1, 1, 1, Math.max(updatedCol, headers.length)).getValues()[0] : [];
    if (updatedHeaders[6] === "Lien Offre") {
      sheet.insertColumnBefore(7);
      console.log(`[UPGRADE] Dynamically inserted column G (7th column) for 'Salaire'.`);
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
      console.log(`[UPDATE] Spreadsheet headers updated successfully to match the 13-column layout.`);
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
  const rowValues = [dateTimeStr, job.source, job.company, job.position, job.score + "%", status, job.salary || "?", job.url, cvUrl, lmUrl, memoUrl, job.originalUrl || "", job.reasoning];
  
  // Try to find if this jobId already has a row to update in-place instead of creating duplicates
  const jobId = getJobId(job.url);
  let targetRowIndex = -1;
  if (jobId) {
    const lastRow = sheet.getLastRow();
    if (lastRow >= 2) {
      // Index for Lien Offre is now 8 (1-based index) because we inserted Salaire before it
      const urls = sheet.getRange(2, 8, lastRow - 1, 1).getValues();
      for (let i = 0; i < urls.length; i++) {
        if (getJobId(urls[i][0]) === jobId) {
          targetRowIndex = i + 2; // 2-based because range starts at row 2
          break;
        }
      }
    }
  }
  
  if (targetRowIndex !== -1) {
    sheet.getRange(targetRowIndex, 1, 1, headers.length).setValues([rowValues]);
    console.log(`[SHEET] Updated existing row ${targetRowIndex} for ${job.company} with status: ${status}`);
  } else {
    sheet.appendRow(rowValues);
    console.log(`[SHEET] Appended new row for ${job.company} with status: ${status}`);
  }
}

function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-3.1-flash-lite:generateContent?key=${GEMINI_API_KEY}`;
  const options = { 
    method: 'post', 
    contentType: 'application/json', 
    payload: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }), 
    muteHttpExceptions: true 
  };
  
  const retries = 3;
  let delayMs = 2000;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = UrlFetchApp.fetch(url, options);
      const code = response.getResponseCode();
      
      if (code === 429) {
        console.warn(`[WARN] Gemini API Rate Limit (429) on attempt ${attempt}/${retries}. Retrying in ${delayMs}ms...`);
        Utilities.sleep(delayMs);
        delayMs *= 2.5; // Exponential backoff with a slightly higher multiplier for safety
        continue;
      }
      
      const responseText = response.getContentText();
      let json;
      try {
        json = JSON.parse(responseText);
      } catch (err) {
        console.error(`[ERROR] JSON parsing failed for response text. Attempt ${attempt}/${retries}.`);
        if (attempt < retries) {
          Utilities.sleep(delayMs);
          delayMs *= 2;
          continue;
        }
        return null;
      }
      
      if (json.error) {
        console.error(`[ERROR] Gemini API returned error: ${json.error.message} (Code: ${json.error.code})`);
        if (attempt < retries) {
          Utilities.sleep(delayMs);
          delayMs *= 2;
          continue;
        }
        return null;
      }
      
      if (!json.candidates || json.candidates.length === 0 || !json.candidates[0].content || !json.candidates[0].content.parts || json.candidates[0].content.parts.length === 0) {
        console.error(`[ERROR] Invalid Gemini API payload structure. Attempt ${attempt}/${retries}.`);
        if (attempt < retries) {
          Utilities.sleep(delayMs);
          delayMs *= 2;
          continue;
        }
        return null;
      }
      
      const outputText = json.candidates[0].content.parts[0].text;
      const match = outputText.match(/\{.*\}/s);
      return JSON.parse(match ? match[0] : outputText);
    } catch (e) {
      console.error(`[ERROR] Exception calling Gemini API on attempt ${attempt}/${retries}: ${e.message}`);
      if (attempt < retries) {
        Utilities.sleep(delayMs);
        delayMs *= 2;
        continue;
      }
      return null;
    }
  }
  return null;
}

function extractJobUrls(text) {
  const regex = /https:\/\/[^\s"<>]+/g;
  const matches = text.match(regex) || [];
  const seen = new Set();
  return matches.filter(url => {
    let decodedUrl = url;
    try {
      decodedUrl = decodeURIComponent(url);
    } catch (e) {}

    // --- LinkedIn job links only ---
    if (url.includes('linkedin.com/') || decodedUrl.includes('linkedin.com/')) {
      // Must contain /jobs/view/ (real job page) - NOT /company/, /in/, /comm/company/
      if (!decodedUrl.includes('/jobs/view/') && !decodedUrl.includes('/comm/jobs/view/')) return false;
      const clean = cleanUrl(url);
      if (!clean) return false;
      if (seen.has(clean)) return false;
      seen.add(clean);
      return true;
    }
    // --- HelloWork job links only ---
    if (url.includes('hellowork.com') || decodedUrl.includes('hellowork.com')) {
      // Must be a click-tracking link OR a real job/search page
      const isClickTracking = decodedUrl.includes('emails.hellowork.com/clic/');
      const isJobPage = decodedUrl.includes('/emplois/') || decodedUrl.includes('/offre-');
      // /home/redirect is a bare redirect with no path — skip /redirection and all nav pages
      const isBareRedirect = /\/home\/redirect(\?|$)/.test(decodedUrl);
      if (!isClickTracking && !isJobPage && !isBareRedirect) return false;
      // Exclude navigation / footer / account pages
      const navPatterns = ['/fr-fr/', '/page/', '/candidat/', '/company/', '/entreprise/', 'instagram.com', 'facebook.com'];
      if (navPatterns.some(p => decodedUrl.includes(p))) return false;
      const clean = cleanUrl(url);
      if (!clean) return false;
      if (seen.has(clean)) return false;
      seen.add(clean);
      return true;
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
  const mime = file.getMimeType();
  if (mime === MimeType.GOOGLE_DOCS) {
    return DocumentApp.openById(file.getId()).getBody().getText();
  } else {
    return file.getBlob().getDataAsString('UTF-8');
  }
}

/**
 * Checks if a city/location is inside the Morbihan department.
 */
function isMorbihan(location) {
  if (!location || location === "?") return false;
  const loc = location.toLowerCase();
  if (loc.includes('56') || loc.includes('morbihan')) return true;
  
  const morbihanCities = [
    'lorient', 'vannes', 'lanester', 'ploemeur', 'hennebont', 'pontivy', 'auray', 'guidel', 
    'saint-ave', 'saint-avé', 'ploermel', 'ploërmel', 'sene', 'séné', 'sarzeau', 'larmor-plage', 
    'queven', 'quéven', 'languidic', 'theix', 'ploeren', 'ploëren', 'brech', 'bréch', 'muzillac', 
    'kervignac', 'elven', 'carnac', 'baud', 'locmine', 'locminé', 'pluvigner', 'plouay', 
    'grand-champ', 'questembert', 'caudan', 'nivillac', 'guer', 'ploemel', 'ploëmel', 
    'aradon', 'arradon', 'plouhinec', 'quiberon', 'port-louis', 'riantec', 'belz', 'nino'
  ];
  
  return morbihanCities.some(city => loc.includes(city));
}

/**
 * Parses and verifies if the salary is below 50k annual.
 */
function isSalaryBelow50k(salaryStr) {
  if (!salaryStr || salaryStr === "?") return false;
  const normalized = salaryStr.toLowerCase().replace(/\s/g, '');
  const numbers = normalized.match(/\d+/g);
  if (!numbers) return false;
  
  const annualValues = numbers.map(numStr => {
    let val = parseInt(numStr, 10);
    if (val < 100) {
      val = val * 1000;
    }
    if (normalized.includes('mois') || normalized.includes('mensuel') || normalized.includes('/m')) {
      val = val * 12;
    }
    return val;
  });
  
  const maxSalary = Math.max(...annualValues);
  if (maxSalary > 0 && maxSalary < 50000) {
    return true;
  }
  return false;
}
