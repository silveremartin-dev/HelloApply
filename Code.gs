/**
 * HelloApply: Cloud Edition
 * VERSION: 5.1.0 (Dense Asymmetric Engine & PoW Index Edition)
 * LAST UPDATED: 20/05/2026 15:40
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
              logToSheet(outputFolder, analysis, "", ""); // Always log rejected/ignored jobs
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
    Instead of a traditional Cover Letter, you will generate a "Technical Architecture Memo / Audit Flash". The CV must be positioned as an "Index of Executable Proofs of Work".

    JOB DESCRIPTION:
    ${context}
    
    MASTER CV / SOURCE KNOWLEDGE (THE ONLY SOURCE OF TRUTH):
    ${masterCV}
    
    CRITICAL INSTRUCTIONS FOR ASYMMETRIC WRITING:
    0. INPUT VALIDATION & RESTRICTIVENESS (STRICT SHIELD):
       - If the description is missing, an auth wall, or withdrawn, Score = 0, Decision = "Ignorer".
       - This profile has 30+ years of experience in complex systems. If the role is junior, purely executant, or unrelated to IT Management, Systems Architecture, or Senior AI Engineering, Score strictly < 80%, Decision = "Ignorer".
       
    1. LANGUAGE COMPLIANCE:
       - Strictly align with the language of the job description (English or French). Absolutely no mixed languages.
       
    2. THE ARCHITECTURE MEMO (Replaces the Cover Letter in 'letter_markdown'):
       - ABANDON ALL TRADITIONAL COVER LETTER FORMATS. Never use "Madame, Monsieur," or standard polite sign-offs.
       - Format this as a peer-to-peer technical memo addressed directly to the CTO/CEO.
       - **ABSOLUTE HEADER REQUIREMENT**: The very first block of text in "letter_markdown" must be the raw header block below, with absolutely no greetings, no subordination formulas ("À l'attention de..."), and no date lines before it. It must be at the absolute top of the document:
           Silvère Martin-Michiellot
           Architecte Systèmes d'Information & Expert IA Agentique
           Lorient | 07 67 81 52 02 | silvere.martin@gmail.com
           LinkedIn: linkedin.com/in/silvere-martin-michiellot
           GitHub: github.com/silveremartin-dev/
       - Immediately following the header block, write the Subject Line: "## **Mémo d'Architecture : [Identify the core technical challenge or bottleneck implicitly described in the job offer]**"
       - Under no circumstances should you prepend any subordination formulas like "À l'attention de la Direction Technique," or traditional greetings like "Madame, Monsieur,". Keep it strictly peer-to-peer, professional, and authoritative.
       - **STRICTLY BAN THE MENTION OF "JScience" (OR "Jscience")**: Do not ever mention JScience or any 20-year-old legacy project. If the job involves scientific or distributed computing, exclusively reference the modern successor **"Episteme"** (developed 2025-2026, 450,000+ lines of scientific/distributed Java framework) or **"Eternity"** (massively parallel combinatorial optimization solver leveraging TornadoVM/OpenCL for GPU acceleration). If JScience is found in the "masterCV" source experiences, dynamically translate/rename it to **"Episteme"** or replace it with modern high-performance Java architectures to keep the profile modern, elite, and state-of-the-art.
       - **The Hook (Le Diagnostic):** Start by dissecting their technical environment based on the offer. Point out the likely friction points (e.g., legacy debt, scaling LLMs in production, CI/CD bottlenecks).
       - **The Proposition:** Propose a high-level architectural posture to solve it.
       - **The Proof of Work (CRITICAL):** You MUST explicitly link their problem to the candidate's tangible assets. Select the most relevant based on the job:
         * If the offer involves Java, high performance, or heavy algorithmics: Point to **"Episteme"** (emphasize the 450,000+ lines of scientific computing framework).
         * If the offer involves GPU computing, hardware acceleration, TornadoVM, or complex algorithmics/massive parallel optimization: Point to **"Eternity"** (massively parallel combinatorial optimization solver leveraging TornadoVM/OpenCL for GPU acceleration).
         * If the offer involves modern Web/React/Next.js/AI integrations: Point to **"Open Primer"** (AI-assisted pedagogy platform).
         * If the offer involves complex logic, distributed systems, or macro-architecture: Point to **"Swarm Forge"** or **"Ether"** (multi-agent simulations, macro-historical systems).
         * If the offer focuses on Delivery, DevOps, or CI/CD: Highlight the use of **"Google Antigravity"** to divide delivery cycles by 5.
       - **The Call to Action (CTA):** Close assertively. E.g., "Je vous propose d'auditer cette architecture lors d'un premier échange technique."
       - **Sign-off:** "Silvère Martin-Michiellot."

    3. THE CV AS AN INDEX (Executive Tone for 'cv_markdown'):
       - Maintain strict Markdown formatting: "# " for name, normal paragraphs for contact info, "## [TARGET POSITION]" for the dynamic title.
       - **MAXIMUM DENSITY AND DETAIL (DO NOT TRUNCATE OR SUMMARIZE)**: Do not ever summarize, shorten, or truncate the professional experiences. You must retrieve and strictly preserve the complete, exhaustive list of responsibilities, tasks, detailed technologies used, methodologies (Agile, TDD, Design Patterns, UML), and quantified metrics from the "masterCV" source for each experience (e.g., Deloitte, Hardis, Fives Syleps, etc.). Every single experience must be highly informative, fully detailed, and dense with concrete achievements, rather than reduced to 2 or 3 brief lines.
       - **STRICTLY BAN THE MENTION OF "JScience" (OR "Jscience")**: Do not ever mention JScience in the CV either. Dynamically rename/translate any JScience project reference to **"Episteme"** or replace it with modern high-performance Java/J2EE standard engineering to keep the profile modern and elite.
       - Transform the summary into a display of absolute authority: Focus on the transition from legacy systems to AI-augmented delivery. 
       - Highlight the capability to govern AI and structure complex logic (not just write code).
       - Ensure all metrics (budgets, team sizes, time saved) and the mandatory "**Environnement technique :**" line at the end of every experience are strictly preserved.
       - Do not use numbered lists (1. 2. 3.). Use standard bullet points (- or *).

    4. JSON STRUCTURE:
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
      "letter_markdown": "The Architecture Memo / Flash Audit..."
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
    
    // Process complete generation from Markdown
    const cvResult = generateFilesFromTemplate(inputFolder, outputFolder, TEMPLATE_CV_NAME, job.cv_markdown || "", cvName);
    const lmResult = generateFilesFromTemplate(inputFolder, outputFolder, TEMPLATE_LETTER_NAME, job.letter_markdown || "", lmName);
    
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

  // Set Margins (ATS Standard: 0.5 inch top/bottom, 0.75 inch left/right)
  body.setMarginTop(36);
  body.setMarginBottom(36);
  body.setMarginLeft(54);
  body.setMarginRight(54);
  
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
    
    // Prevent orphan lines (Espagnol split under FORMATION & LANGUES)
    if (isHeading2 && isCV) {
      const h2Text = line.substring(3).trim();
      const upperText = h2Text.toUpperCase();
      if (upperText === "FORMATION" || upperText === "EDUCATION" || upperText === "FORMATIONS" || upperText === "EDUCATIONS" || upperText.startsWith("FORMATION &") || upperText.startsWith("EDUCATION &")) {
        body.appendPageBreak();
      }
    }
    
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
        style[DocumentApp.Attribute.FONT_SIZE] = 9.5;
        style[DocumentApp.Attribute.FOREGROUND_COLOR] = '#2D3748';
        style[DocumentApp.Attribute.BOLD] = false; // Disable default bold inheritance
        style[DocumentApp.Attribute.SPACING_BEFORE] = 1;
        style[DocumentApp.Attribute.SPACING_AFTER] = 1;
        style[DocumentApp.Attribute.LINE_SPACING] = 1.15;
        item.setAttributes(style);
        item.setAlignment(DocumentApp.HorizontalAlignment.JUSTIFY);
        item.setGlyphType(DocumentApp.GlyphType.BULLET); // Always enforce bullets (no 1. 2. 3. 4.)
        
        const txt = item.editAsText();
        txt.setFontSize(9.5);
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
        style[DocumentApp.Attribute.FONT_SIZE] = 9.5;
        style[DocumentApp.Attribute.FOREGROUND_COLOR] = '#2D3748';
        style[DocumentApp.Attribute.BOLD] = false; // Disable default bold inheritance
        style[DocumentApp.Attribute.SPACING_BEFORE] = 1;
        style[DocumentApp.Attribute.SPACING_AFTER] = 1;
        style[DocumentApp.Attribute.LINE_SPACING] = 1.15;
        item.setAttributes(style);
        item.setAlignment(DocumentApp.HorizontalAlignment.JUSTIFY);
        item.setGlyphType(DocumentApp.GlyphType.BULLET); // Always enforce bullets (no 1. 2. 3. 4.)
        
        const txt = item.editAsText();
        txt.setFontSize(9.5);
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
      style[DocumentApp.Attribute.SPACING_BEFORE] = 8;
      style[DocumentApp.Attribute.SPACING_AFTER] = 1;
      p.setAttributes(style);
      p.setAlignment(DocumentApp.HorizontalAlignment.LEFT);
      formatInlineStyles(p);
    } else {
      const textVal = line.trim() || " ";
      p.setText(textVal);
      
      const style = {};
      style[DocumentApp.Attribute.FONT_FAMILY] = 'Roboto';
      style[DocumentApp.Attribute.FONT_SIZE] = 9.5;
      style[DocumentApp.Attribute.FOREGROUND_COLOR] = '#2D3748';
      style[DocumentApp.Attribute.BOLD] = false; // Disable default bold inheritance
      style[DocumentApp.Attribute.SPACING_BEFORE] = 2;
      style[DocumentApp.Attribute.SPACING_AFTER] = 2;
      style[DocumentApp.Attribute.LINE_SPACING] = 1.15;
      p.setAttributes(style);
      
      const txt = p.editAsText();
      txt.setFontSize(9.5);
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
  if (!hasBold && !hasMarkdownLink && !hasPlainLink) return;
  
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

function logToSheet(folder, job, cvUrl, lmUrl) {
  let sheetFile; const files = folder.getFilesByName(TRACKING_SHEET_NAME);
  const status = (cvUrl && lmUrl) ? "Acceptée" : "Rejetée";
  
  const headers = ["Date", "Source", "Entreprise", "Poste", "Score", "Statut", "Lien Offre", "Lien CV (Doc)", "Lien Lettre (Doc)", "Lien Origine", "Analyse"];
  
  let sheet;
  if (files.hasNext()) { 
    sheetFile = SpreadsheetApp.openById(files.next().getId()); 
    sheet = sheetFile.getSheets()[0];
    
    // Auto-update spreadsheet headers in-place if they don't match the new layout
    const lastCol = sheet.getLastColumn();
    const existingHeaders = lastCol > 0 ? sheet.getRange(1, 1, 1, Math.max(lastCol, headers.length)).getValues()[0] : [];
    let needsUpdate = false;
    if (lastCol < headers.length) {
      needsUpdate = true;
    } else {
      for (let i = 0; i < headers.length; i++) {
        if (existingHeaders[i] !== headers[i]) {
          needsUpdate = true;
          break;
        }
      }
    }
    if (needsUpdate) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      console.log(`[UPDATE] Spreadsheet headers updated successfully to match the 11-column layout.`);
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
  sheet.appendRow([dateTimeStr, job.source, job.company, job.position, job.score + "%", status, job.url, cvUrl, lmUrl, job.originalUrl || "", job.reasoning]);
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
