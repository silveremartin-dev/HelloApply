/**
 * HelloApply: Cloud Edition
 * VERSION: 3.14.1 (2026 Edition)
 * LAST UPDATED: 17/05/2026 16:34
 * 
 * New:
 * - Bullet Points Fix: Enforces standard small black bullet points (DocumentApp.GlyphType.BULLET) instead of copying custom ribbon bullet icons
 * - Template Diagnostic Box: Integrates a complete inspection of all templates inside Gmail drafts (lists placeholders, file names, contents)
 * - French & English placeholders dictionary matching
 * - Escaped regex matching for replaceText and findText literal brace parsing
 * - HelloWork clic link redirect check
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

// --- UNIVERSAL PLACEHOLDER DICTIONARY (FRENCH & ENGLISH) ---
const PLACEHOLDER_DICTIONARY = {
  'SUMMARY': ['SUMMARY', 'summary', 'PROFIL', 'profil', 'RESUME', 'resume'],
  'EXPERIENCE': ['EXPERIENCE', 'experience', 'EXPERIENCES', 'experiences', 'PARCOURS', 'parcours'],
  'SKILLS': ['SKILLS', 'skills', 'COMPETENCES', 'competences', 'COMPETENCES_CLES', 'competences_cles'],
  'LETTER_BODY': ['LETTER_BODY', 'letter_body', 'LETTRE', 'lettre', 'CORPS_DE_LETTRE', 'corps_de_lettre', 'CORPS', 'corps'],
  'DATE': ['DATE', 'date', 'DATE_DU_JOUR', 'date_du_jour'],
  'FULL_NAME': ['FULL_NAME', 'full_name', 'NOM', 'nom', 'PRENOM_NOM', 'prenom_nom'],
  'JOB_TITLE': ['JOB_TITLE', 'job_title', 'POSTE', 'poste', 'TITRE', 'titre']
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

          const analysis = analyzeAndTailor(context, masterCV, url);
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

/**
 * Enhanced Gemini Analysis with Context Fallback, Language Detection & Full-Time Filter
 */
function analyzeAndTailor(context, masterCV, originalUrl) {
  const prompt = `
    TASK: Analyze job match and tailor application documents (CV and Cover Letter/Lettre de Motivation).
    JOB CONTEXT: ${context}
    MASTER CV: ${masterCV}
    
    INSTRUCTIONS FOR LANGUAGE & DETAILED TAILORING:
    1. Language Detection: Detect the language of the job description or context. 
       - If it is in English, you MUST generate the 'summary', 'experience', 'skills', and 'letter_body' in English.
       - If it is in French, you MUST generate them in French.
       - Keep the writing extremely professional and natural.
    
    2. Strict Employment Type Filtering:
       - Only target FULL-TIME (Temps plein, CDI, Full-time) roles.
       - If the job is explicitly part-time, freelance, an internship, or short contract not matching the master CV seniority, set "decision" to "Ignorer" and "score" to a lower value.
       
    3. Document Tailoring:
       - "summary": A compelling, ATS-optimized professional summary (3-4 sentences in the target language) showing exactly why the candidate is a perfect fit.
       - "experience": Highly tailored select professional experiences from the Master CV (formatted clearly with bullet points in the target language) emphasizing skills in Java, Distributed Systems, project leadership, and AI.
       - "skills": Comma-separated list of the top 8-10 technical and soft skills from the Master CV most relevant to this job.
       - "letter_body": A fully customized, professional, and convincing cover letter body in the target language (French or English). Address it to the hiring manager of the company, reference the specific position, highlight the matching 30 years of experience, and state why they want to join this company.

    Return JSON only:
    {
      "company": "Real Company Name (extracted from context, DO NOT use generic placeholders like 'LinkedIn')",
      "position": "Exact Job Title (extracted from context, DO NOT use generic placeholders)",
      "score": 0-100,
      "reasoning": "Critique of the match (e.g. why full-time or part-time, technical alignment)...",
      "decision": "Postuler" or "Ignorer",
      "full_description": "Clean summary of the job description...",
      "data": {
        "full_name": "Silvère Martin-Michiellot",
        "job_title": "Tailored Professional Title for this application",
        "summary": "[Tailored Summary]",
        "experience": "[Tailored Experiences]",
        "skills": "[Tailored Skills]",
        "letter_body": "[Tailored Cover Letter Body]"
      }
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
    
    const cvResult = generateFilesFromTemplate(inputFolder, outputFolder, TEMPLATE_CV_NAME, job.data, cvName);
    const lmResult = generateFilesFromTemplate(inputFolder, outputFolder, TEMPLATE_LETTER_NAME, job.data, lmName);
    
    cvDocUrl = cvResult.docUrl; 
    lmDocUrl = lmResult.docUrl; 
    attachments = [cvResult.pdfBlob, lmResult.pdfBlob];
    
    createDraft(job, attachments);
  } catch (e) { console.error(`[ERROR] Processing ${job.company}: ${e.message}`); }
  logToSheet(outputFolder, job, cvDocUrl, lmDocUrl);
}

/**
 * Create Gmail Draft (Embeds complete raw job description directly & diagnostic report)
 */
function createDraft(job, attachments) {
  const subject = `[Candidature ${job.source}] - ${job.position} - ${job.company} (${job.score}%)`;
  const diag = getTemplatesDiagnostic();
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
      <p>Bonjour,</p>
      <p>Voici ma candidature personnalisée pour le poste de <strong>${job.position}</strong> chez <strong>${job.company}</strong>.</p>
      <p>Les fichiers PDF sont joints à ce brouillon.</p>
      
      <div style="background: #f4f7f6; padding: 15px; border-left: 5px solid #3498db; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #2c3e50;">[Analyse de l'offre - Match : ${job.score}%]</h3>
        <p><em>${job.reasoning}</em></p>
        <p>Lien vers l'offre originale : <a href="${job.url}" style="color: #3498db; text-decoration: none;">Voir sur ${job.source}</a></p>
      </div>
      
      <hr style="border: 0; border-top: 1px solid #ddd; margin: 30px 0;">
      <h4 style="color: #7f8c8d;">Description complète du poste :</h4>
      <div style="font-size: 0.85em; color: #444; background: #fafafa; padding: 15px; border: 1px solid #e2e8f0; border-radius: 5px; white-space: pre-wrap; max-height: 350px; overflow-y: auto; font-family: monospace;">
        ${job.raw_description || "Non disponible"}
      </div>

      <hr style="border: 0; border-top: 1px solid #ddd; margin: 30px 0;">
      <h4 style="color: #c0392b;">[Rapport Diagnostic des Templates]</h4>
      <pre style="font-size: 0.80em; color: #7f8c8d; background: #fdf2e9; padding: 10px; border: 1px solid #f5cba7; border-radius: 5px; white-space: pre-wrap; font-family: monospace; max-height: 250px; overflow-y: auto;">
${diag}
      </pre>

      <p style="margin-top: 20px;">Bien cordialement,<br><strong>Silvère Martin-Michiellot</strong></p>
    </div>
  `;
  GmailApp.createDraft("", subject, "", { htmlBody: htmlBody, attachments: attachments });
}

/**
 * Case-Insensitive Template Replacements (No global font override to preserve ribbons/bookmark styles)
 */
function generateFilesFromTemplate(inputFolder, outputFolder, templateName, data, finalName) {
  const files = inputFolder.getFilesByName(templateName);
  if (!files.hasNext()) throw new Error(`Template ${templateName} introuvable.`);
  const copy = files.next().makeCopy(finalName, outputFolder);
  const doc = DocumentApp.openById(copy.getId());
  const body = doc.getBody();
  
  Object.keys(PLACEHOLDER_DICTIONARY).forEach(key => {
    let value = "";
    if (key === 'DATE') {
      value = new Date().toLocaleDateString('fr-FR');
    } else {
      value = data[key.toLowerCase()] || '';
    }
    
    // Replace all possible French and English placeholders (literal escaped matching)
    PLACEHOLDER_DICTIONARY[key].forEach(placeholder => {
      replacePlaceholder(body, placeholder, value);
    });
  });
  
  doc.saveAndClose();
  const pdfBlob = copy.getAs(MimeType.PDF).setName(finalName + ".pdf");
  outputFolder.createFile(pdfBlob);
  return { docUrl: copy.getUrl(), pdfBlob: pdfBlob };
}

/**
 * Case-Insensitive Multiline Placeholder Replacer with Literal Regex Escapes
 */
function replacePlaceholder(body, placeholder, value) {
  const upper = placeholder.toUpperCase();
  const lower = placeholder.toLowerCase();
  
  // Regex escaped search patterns for literal brace matching
  const patterns = [
    `\\{\\{${upper}\\}\\}`,
    `\\{\\{${lower}\\}\\}`,
    `\\{\\{ ${upper} \\}\\}`,
    `\\{\\{ ${lower} \\}\\}`,
    `\\[${upper}\\]`,
    `\\[${lower}\\]`,
    `\\[ ${upper} \\]`,
    `\\[ ${lower} \\]`
  ];
  
  if (value && value.toString().includes('\n')) {
    patterns.forEach(p => {
      replacePlaceholderWithMultiline(body, p, value);
    });
  } else {
    patterns.forEach(p => {
      body.replaceText(p, value || '');
    });
  }
}

/**
 * Robust Multiline replacer enforcing standard bullet glyphs (normal black dots)
 */
function replacePlaceholderWithMultiline(body, placeholderRegexStr, text) {
  let rangeElement = body.findText(placeholderRegexStr);
  if (!rangeElement) return;
  
  const lines = text.split('\n');
  const textElement = rangeElement.getElement();
  const parent = textElement.getParent();
  const parentType = parent.getType();
  
  if (parentType === DocumentApp.ElementType.PARAGRAPH || parentType === DocumentApp.ElementType.LIST_ITEM) {
    const parentContainer = parent.getParent();
    const index = parentContainer.getChildIndex(parent);
    
    let addedCount = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      let newElement;
      if (parentType === DocumentApp.ElementType.LIST_ITEM) {
        const placeholderLI = parent.asListItem();
        newElement = parentContainer.insertListItem(index + addedCount + 1, line);
        newElement.setListId(placeholderLI);
        newElement.setGlyphType(DocumentApp.GlyphType.BULLET); // Force standard small black bullets!
      } else {
        newElement = parentContainer.insertParagraph(index + addedCount + 1, line);
      }
      
      // Inherit the template's exact styles (Roboto typography, sizes, colors)
      newElement.setAttributes(parent.getAttributes());
      addedCount++;
    }
    
    // Remove the original placeholder paragraph/list item
    parentContainer.removeChild(parent);
  } else {
    body.replaceText(placeholderRegexStr, text);
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
