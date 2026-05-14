/**
 * HelloApply: Cloud Edition
 * VERSION: 1.2.0
 * LAST UPDATED: 14/05/2026 21:55
 * 
 * New: Analysis phase, matching score, and global summary report.
 */

// --- CONFIGURATION ---
const MASTER_CV_NAME = 'SilvereMartinMichiellot-CV-full'; 
const TEMPLATE_CV_NAME = 'SilvereMartinMichiellot-CV-1pageATS-2026';
const TEMPLATE_LETTER_NAME = 'Lettre de motivation Silvère Martin-Michiellot';
const OUTPUT_FOLDER_NAME = 'output'; 
const MIN_MATCH_SCORE = 60; // Seuil minimum pour postuler

/**
 * Main Entry Point
 */
function main() {
  const query = '(from:notification@emails.hellowork.com OR from:jobalerts-noreply@linkedin.com) is:unread';
  const threads = GmailApp.search(query);
  const masterCV = readAnyFile(MASTER_CV_NAME);
  
  if (!masterCV) {
    console.error("[ERROR] Master CV not found. Aborting.");
    return;
  }

  let allAnalyses = [];
  console.log(`[START] Scanning ${threads.length} threads...`);

  for (const thread of threads) {
    const messages = thread.getMessages();
    for (const message of messages) {
      if (!message.isUnread()) continue;

      const jobUrls = extractJobUrls(message.getPlainBody());
      for (const url of jobUrls) {
        try {
          const analysis = analyzeAndTailor(url, masterCV);
          allAnalyses.push({ url, ...analysis });
        } catch (e) {
          console.error(`[ERROR] Analysis failed for ${url}: ${e.message}`);
        }
      }
      message.markRead();
    }
  }

  if (allAnalyses.length === 0) {
    console.log("[END] No jobs found to analyze.");
    return;
  }

  // Sort by score and keep top 5
  allAnalyses.sort((a, b) => b.score - a.score);
  const topJobs = allAnalyses.slice(0, 5);

  processTopJobs(topJobs);
}

/**
 * Single Gemini Call for Analysis + Data Generation
 */
function analyzeAndTailor(url, masterCV) {
  console.log(`[ANALYSIS] Analyzing: ${url}`);
  
  const prompt = `
    Analyze this job (URL: ${url}) against this Master CV: ${masterCV}
    
    1. Score the match from 0 to 100%.
    2. Decide if I should apply ("Postuler" if score > 60, else "Passer").
    3. Extract pros and cons.
    4. If decision is "Postuler", generate tailored CV data.

    Return JSON only:
    {
      "score": 85,
      "decision": "Postuler",
      "reasons": "Matching skills in X, but lacks experience in Y",
      "data": {
        "full_name": "...",
        "job_title": "...",
        "summary": "...",
        "experience": "...",
        "skills": "...",
        "letter_body": "..."
      }
    }
  `;

  return callGemini(prompt);
}

/**
 * Process top jobs and generate report
 */
function processTopJobs(jobs) {
  const reportId = createReport(jobs);
  console.log(`[REPORT] Summary report created: ${reportId}`);

  for (const job of jobs) {
    if (job.decision === "Postuler") {
      try {
        console.log(`[GENERATE] Tailoring for ${job.url} (${job.score}%)`);
        generateDocument(TEMPLATE_CV_NAME, job.data, `CV_${job.score}pct`);
        generateDocument(TEMPLATE_LETTER_NAME, job.data, `Letter_${job.score}pct`);
      } catch (e) {
        console.error(`[ERROR] Document generation failed for ${job.url}: ${e.message}`);
      }
    }
  }
}

/**
 * Gemini Request (Fixed for Error 400/404)
 */
function callGemini(prompt) {
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { 
      // Using standard naming for v1beta
      responseMimeType: "application/json" 
    }
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  // Switch to v1beta for better JSON support
  const response = UrlFetchApp.fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, options);
  const resText = response.getContentText();
  
  if (response.getResponseCode() !== 200) {
    console.warn(`[WARN] Gemini 400, retrying without responseMimeType...`);
    delete payload.generationConfig;
    options.payload = JSON.stringify(payload); // Update payload in options
    const retry = UrlFetchApp.fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, options);
    const retryJson = JSON.parse(retry.getContentText());
    const innerText = retryJson.candidates[0].content.parts[0].text;
    return JSON.parse(extractJson(innerText));
  }

  const json = JSON.parse(resText);
  return JSON.parse(json.candidates[0].content.parts[0].text);
}

function extractJson(text) {
  const match = text.match(/\{.*\}/s);
  return match ? match[0] : text;
}

/**
 * Create a summary report in Google Docs
 */
function createReport(jobs) {
  const doc = DocumentApp.create(`HelloApply_Report_${new Date().toLocaleDateString()}`);
  const body = doc.getBody();
  
  body.appendParagraph("HelloApply: Rapport d'Analyse").setHeading(DocumentApp.ParagraphHeading.HEADING1);
  
  const table = body.appendTable();
  const header = table.appendTableRow();
  header.appendTableCell("Score");
  header.appendTableCell("Décision");
  header.appendTableCell("Analyse / Raisons");
  header.appendTableCell("URL Offre");

  for (const job of jobs) {
    const row = table.appendTableRow();
    row.appendTableCell(String(job.score || 0) + "%");
    row.appendTableCell(String(job.decision || "Inconnu"));
    row.appendTableCell(String(job.reasons || "N/A"));
    row.appendTableCell(String(job.url || "Lien manquant"));
  }

  // Move to output
  const file = DriveApp.getFileById(doc.getId());
  const outputFolders = DriveApp.getFoldersByName(OUTPUT_FOLDER_NAME);
  const folder = outputFolders.hasNext() ? outputFolders.next() : DriveApp.getRootFolder();
  folder.addFile(file);
  DriveApp.getRootFolder().removeFile(file);

  return doc.getId();
}

/**
 * Helpers (Read/Extract/Filter/Document)
 */
function readAnyFile(fileName) {
  const files = DriveApp.getFilesByName(fileName);
  if (!files.hasNext()) {
    const filesNoExt = DriveApp.getFilesByName(fileName.replace('.pdf', ''));
    if (!filesNoExt.hasNext()) return null;
    return readAnyFileObject(filesNoExt.next());
  }
  return readAnyFileObject(files.next());
}

function readAnyFileObject(file) {
  const mimeType = file.getMimeType();
  if (mimeType === MimeType.GOOGLE_DOCS) return DocumentApp.openById(file.getId()).getBody().getText();
  if (mimeType === MimeType.PDF) {
    const resource = { title: file.getName(), mimeType: MimeType.GOOGLE_DOCS };
    const docFile = Drive.Files.insert(resource, file.getBlob(), { ocr: true });
    const content = DocumentApp.openById(docFile.id).getBody().getText();
    Drive.Files.remove(docFile.id);
    return content;
  }
  return "";
}

function extractJobUrls(text) {
  const regex = /https:\/\/[^\s"<>]+/g;
  const matches = text.match(regex) || [];
  return matches.filter(url => url.includes('linkedin.com/comm/jobs/view/') || (url.includes('hellowork.com') && url.includes('/offre-')));
}

function generateDocument(templateName, data, prefix) {
  const files = DriveApp.getFilesByName(templateName);
  if (!files.hasNext()) return;
  
  const template = files.next();
  const copy = template.makeCopy(`${prefix}_${data.full_name || 'Candidat'}_${new Date().getTime()}`);
  const doc = DocumentApp.openById(copy.getId());
  const body = doc.getBody();

  body.replaceText('{{FULL_NAME}}', data.full_name || '');
  body.replaceText('{{JOB_TITLE}}', data.job_title || '');
  body.replaceText('{{SUMMARY}}', data.summary || '');
  body.replaceText('{{EXPERIENCE}}', data.experience || '');
  body.replaceText('{{SKILLS}}', data.skills || '');
  body.replaceText('{{LETTER_BODY}}', data.letter_body || '');

  doc.saveAndClose();
  
  const outputFolders = DriveApp.getFoldersByName(OUTPUT_FOLDER_NAME);
  const folder = outputFolders.hasNext() ? outputFolders.next() : DriveApp.getRootFolder();
  folder.addFile(copy);
  DriveApp.getRootFolder().removeFile(copy);
}

function setupTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('main').timeBased().everyMinutes(30).create();
}

