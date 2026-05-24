/**
 * HelloApply: Cloud Edition - Diagnostics & Utilities
 * VERSION: 6.2.0 (Configurable Identity Edition)
 * LAST UPDATED: 23/05/2026 15:15
 * 
 * Part of the HelloApply autonomous agent suite. Contains manual diagnostics, 
 * template auditing, and direct manual document generation.
 */

function testModels() {
  const models = [
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro"
  ];
  const versions = ["v1", "v1beta"];
  
  models.forEach(model => {
    versions.forEach(ver => {
      const url = `https://generativelanguage.googleapis.com/${ver}/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const payload = { contents: [{ parts: [{ text: "Hi" }] }] };
      
      try {
        const response = UrlFetchApp.fetch(url, {
          method: "post",
          contentType: "application/json",
          payload: JSON.stringify(payload),
          muteHttpExceptions: true
        });
        const code = response.getResponseCode();
        console.log(`[TEST] ${ver} | ${model} => Code ${code}`);
        if (code === 200) console.info(`✅ SUCCÈS : Utilisez ce modèle !`);
      } catch (e) {
        console.error(`[ERROR] ${ver} | ${model} => ${e.message}`);
      }
    });
  });
}

/**
 * Inspects templates and writes their structure/placeholders to Drive
 */
function inspectTemplates() {
  const root = DriveApp.getRootFolder().getFoldersByName("Candidature Express").next();
  const inputFolder = root.getFoldersByName("input").next();
  const outputFolder = root.getFoldersByName("output").next();
  
  let log = "=== TEMPLATE INSPECTION LOG ===\n\n";
  
  const inspectDoc = (name) => {
    log += `\n--- DOCUMENT: ${name} ---\n`;
    const files = inputFolder.getFilesByName(name);
    if (!files.hasNext()) {
      log += `[ERROR] File not found.\n`;
      return;
    }
    const file = files.next();
    const doc = DocumentApp.openById(file.getId());
    const body = doc.getBody();
    
    // Find all {{placeholder}} patterns
    const text = body.getText();
    const matches = text.match(/\{\{[^}]+\}\}/g) || [];
    log += `Found placeholders: ${JSON.stringify([...new Set(matches)])}\n\n`;
    
    // List elements
    log += `Document Elements:\n`;
    const numChildren = body.getNumChildren();
    for (let i = 0; i < numChildren; i++) {
      const child = body.getChild(i);
      const type = child.getType();
      let info = `[${type}] `;
      
      if (type === DocumentApp.ElementType.PARAGRAPH) {
        const p = child.asParagraph();
        info += `Heading: ${p.getHeading()} | Text: "${p.getText().substring(0, 100)}"`;
      } else if (type === DocumentApp.ElementType.LIST_ITEM) {
        const li = child.asListItem();
        info += `Glyph: ${li.getGlyphType()} | Text: "${li.getText().substring(0, 100)}"`;
      } else if (type === DocumentApp.ElementType.TABLE) {
        const t = child.asTable();
        info += `Rows: ${t.getNumRows()} | Cols: ${t.getRow(0).getNumCells()}`;
      } else {
        info += `Type: ${type}`;
      }
      log += `  - ${info}\n`;
    }
  };
  
  inspectDoc(CANDIDATE_PROFILE.templateCvName);
  inspectDoc(CANDIDATE_PROFILE.templateLetterName);
  
  // Write log to file
  const files = outputFolder.getFilesByName("TemplateInspection.txt");
  if (files.hasNext()) files.next().setTrashed(true);
  outputFolder.createFile("TemplateInspection.txt", log);
  console.log("Inspection complete! Check TemplateInspection.txt in output folder.");
}

/**
 * Utility to manually generate tailored CV and Letter PDFs from Markdown text
 * directly from the Google Apps Script editor.
 * Fill in your markdown text, select this function, and click Run!
 */
function generateManual() {
  const cvMarkdown = ``;
  const letterMarkdown = ``;
  
  const root = getOrCreateFolder(ROOT_FOLDER_NAME);
  const inputFolder = getOrCreateFolderIn(root, INPUT_FOLDER_NAME);
  const outputFolder = getOrCreateFolderIn(root, OUTPUT_FOLDER_NAME);
  
  const rand = Math.floor(Math.random() * 900000) + 10000;
  const cvName = `${CANDIDATE_PROFILE.safeName}-CV-Manual-${rand}`;
  const lmName = `${CANDIDATE_PROFILE.safeName}-LM-Manual-${rand}`;
  
  console.log("Generating manual files...");
  const cvResult = generateFilesFromTemplate(inputFolder, outputFolder, CANDIDATE_PROFILE.templateCvName, cvMarkdown, cvName);
  const lmResult = generateFilesFromTemplate(inputFolder, outputFolder, CANDIDATE_PROFILE.templateLetterName, letterMarkdown, lmName);
  
  console.log("✅ Success!");
  console.log("CV PDF URL: " + cvResult.docUrl);
  console.log("LM PDF URL: " + lmResult.docUrl);
}

/**
 * Diagnostic tool to check active triggers and configure automated hourly execution.
 * Run this function manually in the Google Apps Script editor to ensure automation is active!
 */
function checkAndSetupTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  console.log(`[TRIGGER ENGINE] Found ${triggers.length} active trigger(s) in project.`);
  
  let hasMainTrigger = false;
  triggers.forEach((trigger, index) => {
    const handler = trigger.getHandlerFunction();
    const type = trigger.getEventType();
    console.log(`  - Trigger #${index + 1}: calls function "${handler}" | Event Type: ${type}`);
    if (handler === 'main') {
      hasMainTrigger = true;
    }
  });
  
  if (hasMainTrigger) {
    console.log("✅ Automated execution ('main') is already programmed and active!");
  } else {
    console.log("⚠️ No active trigger found for 'main'. Creating a time-driven trigger to run every hour automatically...");
    ScriptApp.newTrigger('main')
      .timeBased()
      .everyHours(1)
      .create();
    console.log("✅ Success! Time-driven trigger successfully created. 'main' will run automatically every hour.");
  }
}

/**
 * Utility to clear the processed jobs cache from ScriptProperties.
 * Allows re-running all offers immediately without clearing Google Sheets.
 */
function resetPropertiesCache() {
  const props = PropertiesService.getScriptProperties();
  props.deleteProperty('PROCESSED_JOB_IDS');
  console.log("✅ ScriptProperties Cache cleared successfully!");
}

/**
 * Utility to clear the Google Sheet tracking data (excluding headers).
 */
function clearGoogleSheetsTracking() {
  const root = getOrCreateFolder(ROOT_FOLDER_NAME);
  const outputFolder = getOrCreateFolderIn(root, OUTPUT_FOLDER_NAME);
  const files = outputFolder.getFilesByName(TRACKING_SHEET_NAME);
  if (files.hasNext()) {
    const sheetFile = SpreadsheetApp.openById(files.next().getId());
    const sheet = sheetFile.getSheets()[0];
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.deleteRows(2, lastRow - 1);
      console.log(`[CLEANUP] Deleted ${lastRow - 1} rows from tracking sheet.`);
    } else {
      console.log("[CLEANUP] Tracking sheet is already empty.");
    }
  } else {
    console.log("[CLEANUP] Tracking sheet not found.");
  }
}

/**
 * Advanced Debug utility to force reprocess old emails (e.g. from a specific date range)
 * bypasses unread/read rules, bypasses date rules, and runs the evaluation logic.
 * 
 * Example query: 'after:2026/05/20 before:2026/05/22 subject:"LinkedIn"'
 */
function forceProcessEmailsQuery(query) {
  if (!query) {
    console.error("Please provide a search query! E.g. 'after:2026/05/20 before:2026/05/22 \"LinkedIn\"'");
    return;
  }
  
  console.log(`[FORCE] Querying Gmail for: "${query}"`);
  const threads = GmailApp.search(query, 0, 15);
  console.log(`[FORCE] Found ${threads.length} threads.`);
  
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

  let generationCount = 0;

  for (const thread of threads) {
    const messages = thread.getMessages();
    for (const message of messages) {
      const subject = message.getSubject();
      const body = message.getPlainBody();
      const jobUrls = extractJobUrls(body);
      
      console.log(`[FORCE] Analysing email: "${subject}"`);

      for (let rawUrl of jobUrls) {
        let decodedUrl = decodeHelloworkTrackingUrl(rawUrl);
        let url = cleanUrl(decodedUrl);
        
        // Resolve click-tracking redirections for HelloWork
        if (url.includes('emails.hellowork.com/clic') || url.includes('hellowork.com/redirect')) {
          console.log(`[RESOLVING] Resolving redirect for: ${url}`);
          const resolved = resolveRedirects(url);
          if (!resolved || resolved === url || !resolved.includes('/emplois/')) {
            continue;
          }
          url = cleanUrl(resolved);
        }
        
        const isRealLinkedInJob = url.includes('linkedin.com/jobs/view/') || url.includes('linkedin.com/view/');
        const isRealHelloWorkJob = url.includes('hellowork.com/') && (url.includes('/emplois/') || url.includes('/offre-'));
        
        if (!isRealLinkedInJob && !isRealHelloWorkJob) continue;
        
        const jobId = getJobId(url);
        console.log(`[FORCE RUN] Processing ${jobId} - ${url}`);
        
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
            analysis.originalUrl = rawUrl;
            analysis.source = url.includes('linkedin.com') ? 'LinkedIn' : 'HelloWork';
            analysis.raw_description = context;
            analysis.isEmailFallback = isFallback;
            
            if (analysis.decision === "Postuler" && analysis.score >= MIN_MATCH_SCORE) {
              processJob(inputFolder, outputFolder, analysis);
              generationCount++;
              console.log(`[GENERATION] Candidature générée (${generationCount}) pour ${analysis.company}`);
            } else {
              console.log(`[IGNORED] ${analysis.position} at ${analysis.company} (Score: ${analysis.score}%, Decision: ${analysis.decision})`);
              logToSheet(outputFolder, analysis, "", "", "");
            }
            
            // Mark job as processed in script properties cache
            markJobProcessed(jobId);
          }
          Utilities.sleep(2000);
        } catch (e) {
          console.error(`[ERROR] ${url}: ${e.message}`);
        }
      }
    }
  }
  console.log(`[FORCE] Completed! Generated ${generationCount} applications.`);
}
