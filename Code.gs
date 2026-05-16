/**
 * HelloApply: Cloud Edition
 * VERSION: 3.9.0 (2026 Edition)
 * LAST UPDATED: 16/05/2026 18:45
 * 
 * New: Time-based execution (8h, 14h, 18h), doesn't touch read/unread status,
 *      uses PropertiesService for persistent last-run tracking.
 */

// --- CONFIGURATION ---
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
  const lastRun = lastRunStr ? new Date(lastRunStr) : new Date(Date.now() - 24 * 60 * 60 * 1000); // 24h par défaut au 1er run

  console.log(`[START] Scanning jobs since ${lastRun.toLocaleString()}...`);

  const query = '(from:notification@emails.hellowork.com OR from:jobalerts-noreply@linkedin.com)';
  const threads = GmailApp.search(query);
  
  const root = getOrCreateFolder(ROOT_FOLDER_NAME);
  const inputFolder = getOrCreateFolderIn(root, INPUT_FOLDER_NAME);
  const outputFolder = getOrCreateFolderIn(root, OUTPUT_FOLDER_NAME);

  const masterCV = readAnyFileIn(inputFolder, MASTER_CV_NAME);
  if (!masterCV) return;

  for (const thread of threads) {
    // Si le dernier message du thread est antérieur au dernier run, on passe
    if (thread.getLastMessageDate() <= lastRun) continue;

    const messages = thread.getMessages();
    for (const message of messages) {
      // On ne traite que les messages reçus après le dernier run
      if (message.getDate() <= lastRun) continue;

      const jobUrls = extractJobUrls(message.getPlainBody());
      for (const url of jobUrls) {
        try {
          const analysis = analyzeAndTailor(url, masterCV);
          if (analysis) {
            analysis.url = url;
            analysis.source = url.includes('linkedin.com') ? 'LinkedIn' : 'HelloWork';
            processJob(inputFolder, outputFolder, analysis);
          }
        } catch (e) { console.error(`[ERROR] ${url}: ${e.message}`); }
      }
      // Fini message.markRead() ! On respecte votre boîte mail.
    }
  }

  // On enregistre l'heure de ce passage
  props.setProperty('LAST_RUN_TIMESTAMP', new Date().toISOString());
  console.log(`[END] Last run timestamp updated.`);
}

/**
 * Configure les déclencheurs (8h, 14h, 18h)
 */
function setupTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(t => ScriptApp.deleteTrigger(t));
  
  ScriptApp.newTrigger('main').timeBased().atHour(8).everyDays(1).create();
  ScriptApp.newTrigger('main').timeBased().atHour(14).everyDays(1).create();
  ScriptApp.newTrigger('main').timeBased().atHour(18).everyDays(1).create();
  
  console.info("Déclencheurs configurés pour 08:00, 14:00 et 18:00.");
}

/**
 * Gemini Analysis
 */
function analyzeAndTailor(url, masterCV) {
  const jobDescription = fetchJobDescription(url);
  const prompt = `Analyze this JOB (${jobDescription || url}) against MASTER CV: ${masterCV}. 
                  Score strictly. Return JSON with company, position, score, reasoning, decision, full_description, data.`;
  return callGemini(prompt);
}

/**
 * Process a single job
 */
function processJob(inputFolder, outputFolder, job) {
  let cvDocUrl = "";
  let lmDocUrl = "";
  let attachments = [];

  if (job.score >= MIN_MATCH_SCORE && job.decision === "Postuler") {
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
    } catch (e) { console.error(e.message); }
  }
  logToSheet(outputFolder, job, cvDocUrl, lmDocUrl);
}

/**
 * Create Gmail Draft (HTML)
 */
function createDraft(job, attachments) {
  const subject = `Candidature - ${job.position} - ${job.company} (${job.score}%)`;
  const htmlBody = `
    <div style="font-family: Arial; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
      <p>Bonjour,</p>
      <p>Voici ma candidature pour le poste de <strong>${job.position}</strong> chez <strong>${job.company}</strong>.</p>
      <div style="background: #f4f7f6; padding: 15px; border-left: 5px solid #3498db; margin: 20px 0;">
        <h3 style="margin-top: 0;">🧠 Analyse IA (Score : ${job.score}%)</h3>
        <p><em>${job.reasoning}</em></p>
        <p>🔗 <a href="${job.url}" style="color: #3498db;">Voir l'offre originale sur ${job.source}</a></p>
      </div>
      <hr style="border: 0; border-top: 1px solid #ddd; margin: 30px 0;">
      <h4 style="color: #7f8c8d;">📄 Descriptif complet du poste :</h4>
      <div style="font-size: 0.85em; color: #666; background: #fff; padding: 10px; border: 1px solid #eee;">
        ${job.full_description || "N/A"}
      </div>
      <p style="margin-top: 20px;">Cordialement,<br><strong>Silvère Martin-Michiellot</strong></p>
    </div>
  `;
  GmailApp.createDraft("", subject, "", { htmlBody: htmlBody, attachments: attachments });
}

/**
 * Helpers (Files, Folder, Gemini)
 */
function generateFilesFromTemplate(inputFolder, outputFolder, templateName, data, finalName) {
  const files = inputFolder.getFilesByName(templateName);
  if (!files.hasNext()) throw new Error(`Template ${templateName} introuvable.`);
  const copy = files.next().makeCopy(finalName, outputFolder);
  const doc = DocumentApp.openById(copy.getId());
  const body = doc.getBody();
  const fields = ['FULL_NAME', 'JOB_TITLE', 'SUMMARY', 'EXPERIENCE', 'SKILLS', 'LETTER_BODY'];
  fields.forEach(f => body.replaceText(`{{${f}}}`, data[f.toLowerCase()] || ''));
  doc.saveAndClose();
  const pdfBlob = copy.getAs(MimeType.PDF).setName(finalName + ".pdf");
  outputFolder.createFile(pdfBlob);
  return { docUrl: copy.getUrl(), pdfBlob: pdfBlob };
}

function logToSheet(folder, job, cvUrl, lmUrl) {
  let sheetFile;
  const files = folder.getFilesByName(TRACKING_SHEET_NAME);
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
  return matches.filter(url => url.includes('linkedin.com/comm/jobs/view/') || (url.includes('hellowork.com') && url.includes('/offre-')));
}

function fetchJobDescription(url) {
  try {
    const response = UrlFetchApp.fetch(url, { 'muteHttpExceptions': true, 'headers': { 'User-Agent': 'Mozilla/5.0' } });
    if (response.getResponseCode() !== 200) return null;
    return response.getContentText().replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gmi, "").replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gmi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().substring(0, 8000);
  } catch (e) { return null; }
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
