/**
 * HelloApply: Cloud Edition
 * VERSION: 3.17.0 (High-Fidelity Exact-Replacement Edition)
 * LAST UPDATED: 17/05/2026 20:45
 * 
 * New:
 * - High-Fidelity Exact-Replacement Engine: Uses plain-text substring mapping to perform in-place character updates, preserving 100% of custom Google Docs layouts, tables, font attributes, colors, and margins!
 * - Multi-Language Coherence (No Franglais): Dynamically replaces French headings, object, salutation, and closing of templates with pure English equivalents if the job description is in English, and vice versa!
 * - Automatic Right Justification: Automatically justifies all body paragraphs in both the CV and the Cover Letter for an impeccable, institution-grade look!
 * - Cleaned Job Description Drafts: Embeds beautifully cleaned, noise-free, and styled HTML descriptions in the Gmail drafts.
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
const MIN_MATCH_SCORE = 80; 

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

  // TEST_MODE quota: max 1 LinkedIn + 1 HelloWork
  let testLinkedInDone = false;
  let testHelloWorkDone = false;

  for (const thread of threads) {
    // In test mode, stop once both sources are covered
    if (TEST_MODE && testLinkedInDone && testHelloWorkDone) break;

    if (!TEST_MODE && thread.getLastMessageDate() <= lastRun) continue;

    const messages = thread.getMessages();
    for (const message of messages) {
      if (!TEST_MODE && message.getDate() <= lastRun) continue;

      const subject = message.getSubject();
      const body = message.getPlainBody();
      const jobUrls = extractJobUrls(body);
      
      console.log(`[MAIL] Analysing email: "${subject}"`);

      for (let rawUrl of jobUrls) {
        let url = cleanUrl(rawUrl);
        const isLinkedIn = url.includes('linkedin.com');
        const isHelloWork = url.includes('hellowork.com');

        // TEST_MODE: skip if we already processed this source
        if (TEST_MODE && isLinkedIn && testLinkedInDone) { console.log('[TEST] LinkedIn quota atteint, skip.'); continue; }
        if (TEST_MODE && isHelloWork && testHelloWorkDone) { console.log('[TEST] HelloWork quota atteint, skip.'); continue; }
        
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
            analysis.source = url.includes('linkedin.com') ? 'LinkedIn' : 'HelloWork';
            analysis.raw_description = context; // Save full context for the draft copy
            
            if (analysis.decision === "Postuler" && analysis.score >= MIN_MATCH_SCORE) {
              processJob(inputFolder, outputFolder, analysis);
            } else {
              console.log(`[IGNORED] ${analysis.position} at ${analysis.company} (Score: ${analysis.score}%, Decision: ${analysis.decision})`);
              logToSheet(outputFolder, analysis, "", ""); // Always log rejected/ignored jobs
            }
            
            // Mark job as processed to prevent duplicates
            markJobProcessed(jobId);
            
            // TEST_MODE: flag source as done
            if (TEST_MODE && isLinkedIn) { testLinkedInDone = true; console.log('[TEST] LinkedIn traité. Quota atteint.'); }
            if (TEST_MODE && isHelloWork) { testHelloWorkDone = true; console.log('[TEST] HelloWork traité. Quota atteint.'); }
          }
        } catch (e) { console.error(`[ERROR] ${url}: ${e.message}`); }
      }
    }
  }

  if (!TEST_MODE) props.setProperty('LAST_RUN_TIMESTAMP', new Date().toISOString());
}
function analyzeAndTailor(context, masterCV, cvTemplateText, letterTemplateText, originalUrl) {
  const prompt = `
    TASK: Analyze job match and tailor application documents (CV and Cover Letter) with high visual fidelity by generating precise search-and-replace string pairs.
    
    JOB CONTEXT:
    ${context}
    
    MASTER CV (SOURCE KNOWLEDGE):
    ${masterCV}
    
    CV TEMPLATE TEXT (CURRENTLY POPULATED IN DRIVE):
    ${cvTemplateText}
    
    COVER LETTER TEMPLATE TEXT (CURRENTLY POPULATED IN DRIVE):
    ${letterTemplateText}
    
    ========================================================================
    GOLD STANDARD WRITING STYLE (EMULATE THIS LEVEL OF RICHNESS & EXECUTIVE TONE):
    Below is a world-class example of a customized CV generated by Gemini 3.1 Pro for an Agentic AI Architect role.
    You MUST match or exceed this level of richness, detail, strategic vision, technical accuracy, and executive power.
    Never write simple keyword lists or short, dry copy-pasted bullets. Write extremely detailed, rich, and strategic bullets!
    
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
    Leadership Technique & Advisory : Direction d'équipes d'ingénierie (jusqu'à 8 développeurs en environnement Agile/Scrum), relation client stratégique (AMOA), vulgarisation de concepts IA complexes auprès d'audiences techniques et exécutives.
    
    EXPÉRIENCES PROFESSIONNELLES
    Lead Architecte & Développeur Open Source — Mécénat GitHub | Lorient (Remote) | 07/2025 - Présent
    - Pionnier du Delivery Augmenté par IA : Automatisation de 80% des tests unitaires et de la documentation technique de bas niveau via l'orchestration de l'outil agentique Antigravity, validant la réduction des cycles de livraison à l'échelle d'un projet d'envergure.
    - Conception d'Architectures Distribuées : Conception et développement de la bibliothèque de calcul scientifique Episteme (+400 000 lignes de code), atteignant des performances 10x supérieures aux standards Apache via une optimisation fine de la JVM.
    - Modélisation de Systèmes Complexes : Développement d'un client-serveur distribué résolvant des solveurs complexes (Eternity II) et d'une simulation 3D temps réel d'insectes sociaux (Three.js).
    
    Spécialiste Support Informatique Senior — Techteam (Fives Syleps) | Lorient | 06/2024 - 07/2025
    - Résolution d'Incidents Critiques (Niveaux 1, 2, 3) : Diagnostic et remédiation 24/7 en environnement de production temps réel sur des plateformes logistiques robotisées complexes (WMS/WCS).
    - Optimisation d'Infrastructure : Réingénierie complète des accès VPN et de l'orchestration des machines virtuelles pour l'équipe technique, réduisant les temps de connexion de 35%.
    
    Responsable IT / Chef de Projet AMOA — Equitive (Groupe Deloitte) | Lorient | 10/2012 - 11/2023
    - Advisory & Transformation Digitale : Accompagnement technique et stratégique de comptes clés, ayant directement soutenu une trajectoire de croissance du chiffre d'affaires client de +400% sur 7 ans.
    - Modernisation d'Applications Critiques : Direction du déploiement de solutions d'envergure nationale de dématérialisation (facturation, paie) pour le Ministère de la Culture.
    - Gouvernance & Cloud hybride : Migration d'infrastructures d'anciennes générations vers une architecture hybride sécurisée de plus de 80 machines virtuelles (chiffrement, conformité RGPD).
    - Management et Mentorat : Coordination, montée en compétences et animation de 8 développeurs en environnements Agiles, DevOps et d'intégration continue."
    ========================================================================
    
    INSTRUCTIONS FOR LANGUAGE & HIGH-FIDELITY TAILORING:
    1. Language Detection & Consistency (No mixed "Franglais" documents):
       - Detect the language of the job description or context.
       - If it is in English, BOTH the CV and the Cover Letter replacements must be completely in English. You must translate any French headings, subject ("Objet"), salutation ("Madame, Monsieur,"), date headers, and closings from the templates into natural English (e.g. replace "Objet : Lettre de motivation" with "Subject: Application for...", "Madame, Monsieur," with "Dear Hiring Manager,", and the French sign-off with "Sincerely,").
       - You must also translate any French components of the CV header (such as the candidate's professional title, phone labels 'Tél' or 'Tel mobile', and location terms) into their exact English equivalents to ensure the entire document is pristine and uniform.
       - If it is in French, all replacements must be in French. Keep French headers and structure intact.
    
    2. Zero-Paragraph Insertion Rule (No newlines in replacements):
       - DO NOT include newlines (\\n) inside the "find" or "replace" fields of a single replacement pair.
       - Split your updates into separate replacement pairs for each individual bullet point, paragraph, heading, or line.
       - This guarantees that we replace text *within* existing document paragraphs and list items, preserving 100% of the custom Google Docs layouts, tables, colors, bullet glyphs, and formatting!
    
    3. Document Customization Strategy:
       - Analyze the seniority and complexity of the role. For high-level or strategic roles, generate rich, sophisticated experiences and summaries. For targeted roles, make them extremely punchy.
       - "cv_replacements": Find the original summary, headings, skills, and experience bullet points of the CV template, and replace them with tailored versions.
       - "letter_replacements": Find the original cover letter subject, salutation, body paragraphs, and closing, and replace them with tailored versions.
       
    4. Exact Substring Match:
       - Every "find" string MUST be an EXACT, character-for-character substring of the template texts provided above.

    5. CRITICAL SELF-CORRECTION & REVIEW LOOP:
       - Before producing your final JSON response, perform a strict mental review of your generated replacements:
       - Language Check: Is there ANY mixed-language text? If the job is in English, are there any French headings (e.g. "COMPÉTENCES"), French labels (e.g. "Tel mobile :"), or French object/salutations/closings remaining? If so, generate replacements to translate them.
       - Substring Check: Is every single "find" string an EXACT character-for-character match in the template text?
       - Quality Check: Are the experience bullet points and summary of high professional standard, detailed, and matching the seniority of the target role? Correct any flaws before outputting.

    Return JSON only:
    {
      "company": "Real Company Name (extracted from context, DO NOT use generic placeholders like 'LinkedIn')",
      "position": "Exact Job Title (extracted from context, DO NOT use generic placeholders)",
      "score": 0-100,
      "reasoning": "Critique of the match (e.g. why full-time or part-time, technical alignment)...",
      "decision": "Postuler" or "Ignorer",
      "job_description_clean": "Beautifully cleaned and structured markdown/plain-text copy of the target job description. Extract and include ONLY the specific job title, company name, context, requirements, responsibilities, and qualifications. Format it beautifully with clean line breaks so it's extremely easy to read.",
      "language": "en" or "fr",
      "cv_replacements": [
        {
          "find": "Exact literal substring from CV template...",
          "replace": "Tailored replacement in target language..."
        }
      ],
      "letter_replacements": [
        {
          "find": "Exact literal substring from Letter template...",
          "replace": "Tailored replacement in target language..."
        }
      ]
    }
  `;
  return callGemini(prompt);
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
    
    return html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gmi, "").replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gmi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().substring(0, 8000);
  } catch (e) { return null; }
}

/**
 * Process Job
 */
function processJob(inputFolder, outputFolder, job) {
  let cvDocUrl = ""; let lmDocUrl = ""; let attachments = [];
  try {
    const rand = Math.floor(Math.random() * 900000) + 10000;
    const cvName = `SilvereMartinMichiellot-CV-2026-${rand}`;
    const lmName = `SilvereMartinMichiellot-LM-2026-${rand}`;
    
    // Process exact in-place high-fidelity replacements
    const cvResult = generateFilesFromTemplate(inputFolder, outputFolder, TEMPLATE_CV_NAME, job.cv_replacements || [], [], cvName);
    const lmResult = generateFilesFromTemplate(inputFolder, outputFolder, TEMPLATE_LETTER_NAME, [], job.letter_replacements || [], lmName);
    
    cvDocUrl = cvResult.docUrl; 
    lmDocUrl = lmResult.docUrl; 
    attachments = [cvResult.pdfBlob, lmResult.pdfBlob];
    
    createDraft(job, attachments);
  } catch (e) { console.error(`[ERROR] Processing ${job.company}: ${e.message}`); }
  logToSheet(outputFolder, job, cvDocUrl, lmDocUrl);
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
      <p>Les fichiers PDF adaptés (CV et Lettre de motivation) sont déjà joints à ce brouillon.</p>
      
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
/**
 * High-Fidelity exact-replacement layout generator
 */
function generateFilesFromTemplate(inputFolder, outputFolder, templateName, cvReplacements, letterReplacements, finalName) {
  const files = inputFolder.getFilesByName(templateName);
  if (!files.hasNext()) throw new Error(`Template ${templateName} introuvable.`);
  const copy = files.next().makeCopy(finalName, outputFolder);
  const doc = DocumentApp.openById(copy.getId());
  const body = doc.getBody();
  
  const isLetter = templateName.toLowerCase().includes('lettre') || templateName.toLowerCase().includes('lm');
  const replacements = isLetter ? letterReplacements : cvReplacements;
  
  console.log(`[TAILOR] Running ${replacements.length} high-fidelity replacements on ${templateName}...`);
  
  replacements.forEach(pair => {
    if (pair.find && pair.find.trim()) {
      const cleanFind = escapeRegex(pair.find.trim());
      const cleanReplace = pair.replace || "";
      body.replaceText(cleanFind, cleanReplace);
    }
  });

  // Justify all body paragraphs in both CV and Cover Letter to look extremely clean and premium!
  const paragraphs = body.getParagraphs();
  paragraphs.forEach(p => {
    const text = p.getText().trim();
    if (text.length > 50 && p.getHeading() === DocumentApp.ParagraphHeading.NORMAL) {
      p.setAlignment(DocumentApp.HorizontalAlignment.JUSTIFY);
    }
  });
  
  // Dynamic March 11th Hardcoded overrides (in case template has static dates)
  const currentLongDate = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  body.replaceText("(?i)11 mars 2026", currentLongDate);
  body.replaceText("(?i)11 mars", currentLongDate);
  body.replaceText("(?i)11/03/2026", new Date().toLocaleDateString('fr-FR'));
  body.replaceText("(?i)11/03/26", new Date().toLocaleDateString('fr-FR'));
  
  doc.saveAndClose();
  const pdfBlob = copy.getAs(MimeType.PDF).setName(finalName + ".pdf");
  outputFolder.createFile(pdfBlob);
  return { docUrl: copy.getUrl(), pdfBlob: pdfBlob };
}

/**
 * Escapes a literal search string to make it perfectly safe for Google Doc regex replaceText
 */
function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
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
  let clean = url.split('?')[0].trim();
  if (clean.includes('linkedin.com/comm/jobs/view/')) {
    clean = clean.replace('linkedin.com/comm/jobs/view/', 'linkedin.com/jobs/view/');
  }
  if (clean.includes('linkedin.com/jobs/view/') && !clean.endsWith('/')) {
    clean += '/';
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

function logToSheet(folder, job, cvUrl, lmUrl) {
  let sheetFile; const files = folder.getFilesByName(TRACKING_SHEET_NAME);
  if (files.hasNext()) { sheetFile = SpreadsheetApp.openById(files.next().getId()); } 
  else {
    sheetFile = SpreadsheetApp.create(TRACKING_SHEET_NAME);
    folder.addFile(DriveApp.getFileById(sheetFile.getId()));
    DriveApp.getRootFolder().removeFile(DriveApp.getFileById(sheetFile.getId()));
    sheetFile.getSheets()[0].appendRow(["Date", "Source", "Entreprise", "Poste", "Score", "Lien Offre", "Lien CV (Doc)", "Lien Lettre (Doc)", "Analyse"]);
  }
  sheetFile.getSheets()[0].appendRow([new Date().toLocaleDateString(), job.source, job.company, job.position, job.score + "%", job.url, cvUrl, lmUrl, job.reasoning]);
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
  return matches.filter(url => url.includes('linkedin.com/') || url.includes('hellowork.com'));
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
