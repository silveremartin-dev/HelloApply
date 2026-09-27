/**
 * HelloApply: Cloud Edition - Diagnostics & Utilities
 * VERSION: 6.5.0
 * 
 * Part of the HelloApply autonomous agent suite. Contains manual diagnostics, 
 * template auditing, direct URL runner, and cache cleanup utilities.
 */

/**
 * Diagnostic tool to test Gemini API connectivity across versions and models.
 */
function testModels() {
  const models = [
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash"
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
        if (code === 200) console.info(`✅ SUCCÈS : Modèle ${model} opérationnel.`);
      } catch (e) {
        console.error(`[ERROR] ${ver} | ${model} => ${e.message}`);
      }
    });
  });
}

/**
 * Inspects templates and writes their structure/placeholders to Drive.
 */
function inspectTemplates() {
  const root = DriveApp.getRootFolder().getFoldersByName(ROOT_FOLDER_NAME).next();
  const inputFolder = root.getFoldersByName(INPUT_FOLDER_NAME).next();
  const outputFolder = root.getFoldersByName(OUTPUT_FOLDER_NAME).next();
  
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
 * Utility to manually generate tailored CV, Letter, and Memo PDFs from Markdown text directly.
 */
function generateManual(lang, includeNote) {
  const cvMarkdown = ``;
  const letterMarkdown = ``;
  const memoMarkdown = ``;
  const language = lang || 'fr';
  const shouldIncludeNote = includeNote !== undefined ? includeNote : (CANDIDATE_PROFILE.includeTechnicalNote !== false);
  
  const root = getOrCreateFolder(ROOT_FOLDER_NAME);
  const inputFolder = getOrCreateFolderIn(root, INPUT_FOLDER_NAME);
  const outputFolder = getOrCreateFolderIn(root, OUTPUT_FOLDER_NAME);
  
  const rand = Math.floor(Math.random() * 900000) + 10000;
  const cvName = `${CANDIDATE_PROFILE.safeName}-CV-Manual-${rand}`;
  const lmName = `${CANDIDATE_PROFILE.safeName}-LM-Manual-${rand}`;
  const memoName = `${CANDIDATE_PROFILE.safeName}-Memo-Manual-${rand}`;
  
  let fullCvMarkdown = cvMarkdown ? cvMarkdown.trim() : "";
  if (shouldIncludeNote) {
    const technicalNote = getTechnicalNote(language);
    if (technicalNote) {
      fullCvMarkdown = (fullCvMarkdown ? fullCvMarkdown + "\n\n---pagebreak---\n\n" : "") + technicalNote;
    }
  }
  
  console.log("Generating manual files...");
  const cvResult = generateFilesFromTemplate(inputFolder, outputFolder, CANDIDATE_PROFILE.templateCvName, fullCvMarkdown, cvName);
  const lmResult = generateFilesFromTemplate(inputFolder, outputFolder, CANDIDATE_PROFILE.templateLetterName, letterMarkdown, lmName);
  const memoResult = generateFilesFromTemplate(inputFolder, outputFolder, CANDIDATE_PROFILE.templateLetterName, memoMarkdown, memoName);
  
  console.log("✅ Success!");
  console.log(`CV (${shouldIncludeNote ? "with Technical Note" : "standard"}) PDF URL: ` + cvResult.docUrl);
  console.log("LM PDF URL: " + lmResult.docUrl);
  console.log("Memo PDF URL: " + memoResult.docUrl);
}

/**
 * Utility to process a list of job URLs directly from the Apps Script editor.
 * Accepts one or multiple URLs (HelloWork, LinkedIn, etc.) and generates tailored candidatures.
 * 
 * @param {string|Array<string>} urls - URL or array of URLs to process.
 * @param {boolean} forceApply - If true (default), forces generation and creates Gmail drafts.
 */
function processManualUrls(urls, forceApply) {
  const urlList = Array.isArray(urls) ? urls : [urls];
  const shouldForce = forceApply !== undefined ? forceApply : true;
  
  const root = getOrCreateFolder(ROOT_FOLDER_NAME);
  const inputFolder = getOrCreateFolderIn(root, INPUT_FOLDER_NAME);
  const outputFolder = getOrCreateFolderIn(root, OUTPUT_FOLDER_NAME);
  
  const masterCV = readAnyFileIn(inputFolder, CANDIDATE_PROFILE.masterCvName);
  const cvTemplateText = readAnyFileIn(inputFolder, CANDIDATE_PROFILE.templateCvName);
  const letterTemplateText = readAnyFileIn(inputFolder, CANDIDATE_PROFILE.templateLetterName);

  if (!masterCV) {
    console.error("[ERROR] Master CV introuvable dans input/.");
    return;
  }
  
  console.log(`[MANUAL RUN] Lancement du traitement de ${urlList.length} URL(s)...`);
  
  urlList.forEach((rawUrl, idx) => {
    if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.trim()) return;
    console.log(`\n--- [${idx + 1}/${urlList.length}] Traitement de : ${rawUrl} ---`);
    
    try {
      const res = processSingleJobUrl(rawUrl.trim(), {
        forceApply: shouldForce,
        inputFolder: inputFolder,
        outputFolder: outputFolder,
        masterCV: masterCV,
        cvTemplateText: cvTemplateText,
        letterTemplateText: letterTemplateText
      });
      
      if (res.success) {
        console.log(`✅ SUCCÈS pour ${res.analysis.company} (${res.analysis.score}%) :`);
        console.log(`   - CV Doc : ${res.docUrls.cvDocUrl}`);
        console.log(`   - LM Doc : ${res.docUrls.lmDocUrl}`);
        console.log(`   - Memo Doc : ${res.docUrls.memoDocUrl}`);
        console.log(`   - Brouillon Gmail créé et prêt dans votre boîte Gmail !`);
      } else if (res.analysis) {
        console.warn(`⚠️ REJETÉ : Score ${res.analysis.score}% (< ${MIN_MATCH_SCORE}%). Pour forcer, utilisez forceApply: true.`);
      } else {
        console.error(`❌ ÉCHEC : ${res.error}`);
      }
      Utilities.sleep(2000);
    } catch (e) {
      console.error(`❌ ERREUR pour ${rawUrl} : ${e.message}`);
    }
  });
  console.log("\n[MANUAL RUN] Fin du traitement.");
}

/**
 * Exemple prêt à l'emploi : collez vos URLs ici et cliquez sur 'Exécuter' !
 */
function runManualUrlsExample() {
  const myUrls = [
    // "https://www.hellowork.com/fr-fr/emplois/12345678.html",
    // "https://www.linkedin.com/jobs/view/1234567890/"
  ];
  if (myUrls.length === 0) {
    console.log("ℹ️ Ajoutez une ou plusieurs URLs dans 'myUrls' avant de lancer cette fonction.");
    return;
  }
  processManualUrls(myUrls, true);
}

/**
 * Utility to clear the processed jobs cache from ScriptProperties.
 * Allows re-running all offers immediately without clearing Google Sheets.
 */
function resetPropertiesCache() {
  const props = PropertiesService.getScriptProperties();
  props.deleteProperty('PROCESSED_JOB_IDS');
  console.log("✅ Cache des IDs traités (ScriptProperties) réinitialisé !");
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
      console.log(`[CLEANUP] Supprimé ${lastRow - 1} ligne(s) de la feuille de suivi.`);
    } else {
      console.log("[CLEANUP] La feuille de suivi est déjà vide.");
    }
  } else {
    console.log("[CLEANUP] Feuille de suivi introuvable.");
  }
}
