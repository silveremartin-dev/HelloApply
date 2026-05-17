/**
 * HelloApply: Cloud Edition
 * VERSION: 3.13.1 (2026 Edition)
 * LAST UPDATED: 17/05/2026 15:10
 * 
 * New: 
 * - Enhanced HelloWork URL parsing to support all digest and click-tracking links
 * - Removed global setAttributes to preserve beautiful template styling (e.g. blue ribbon bullets)
 * - Robust job ID matching for both LinkedIn and HelloWork
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
 */
function main() {
  const props = PropertiesService.getScriptProperties();
  const lastRunStr = props.getProperty('LAST_RUN_TIMESTAMP');
  const lastRun = TEST_MODE ? new Date(Date.now() - 48 * 60 * 60 * 1000) : (lastRunStr ? new Date(lastRunStr) : new Date(Date.now() - 12 * 60 * 60 * 1000));

  console.log(`[START] Scanning since ${lastRun.toLocaleString()}...`);

  let threads = [];
  const queries = [
    'subject:"nouvelles offres" "HelloWork"',
    'subject:"alerte" "LinkedIn"',
    'from:jobalerts-noreply@linkedin.com',
    'from:notification@emails.hellowork.com'
  ];
  
  queries.forEach(q => {
    const result = GmailApp.search(q, 0, TEST_MODE ? 3 : 10);
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

  for (const thread of threads) {
    if (!TEST_MODE && thread.getLastMessageDate() <= lastRun) continue;

    const messages = thread.getMessages();
    for (const message of messages) {
      if (!TEST_MODE && message.getDate() <= lastRun) continue;

      const subject = message.getSubject();
      const body = message.getPlainBody();
      const jobUrls = extractJobUrls(body);
      
      console.log(`[MAIL] Analysing email: "${subject}"`);

      for (let rawUrl of jobUrls) {
        const url = cleanUrl(rawUrl);
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
            
            if (analysis.decision === "Postuler" && analysis.score >= MIN_MATCH_SCORE) {
              processJob(inputFolder, outputFolder, analysis);
            } else {
              console.log(`[IGNORED] ${analysis.position} at ${analysis.company} (Score: ${analysis.score}%, Decision: ${analysis.decision})`);
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
 * Create Gmail Draft (Clean plain-text formatting to avoid replacement chars)
 */
function createDraft(job, attachments) {
  const subject = `[Candidature ${job.source}] - ${job.position} - ${job.company} (${job.score}%)`;
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
      <div style="font-size: 0.85em; color: #666; background: #fff; padding: 10px; border: 1px solid #eee; white-space: pre-wrap;">
        ${job.full_description || "Non disponible"}
      </div>

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
  
  const fields = ['SUMMARY', 'EXPERIENCE', 'SKILLS', 'LETTER_BODY', 'DATE', 'DATE_DU_JOUR', 'FULL_NAME', 'JOB_TITLE'];
  fields.forEach(f => {
    let value = "";
    if (f === 'DATE' || f === 'DATE_DU_JOUR') {
      value = new Date().toLocaleDateString('fr-FR');
    } else {
      value = data[f.toLowerCase()] || '';
    }
    body.replaceText(`{{${f}}}`, value);
    body.replaceText(`{{${f.toLowerCase()}}}`, value);
  });
  
  doc.saveAndClose();
  const pdfBlob = copy.getAs(MimeType.PDF).setName(finalName + ".pdf");
  outputFolder.createFile(pdfBlob);
  return { docUrl: copy.getUrl(), pdfBlob: pdfBlob };
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
