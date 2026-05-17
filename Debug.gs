function testModels() {
  const models = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.0-pro",
    "gemini-pro"
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
  
  inspectDoc("SilvereMartinMichiellot-CV-1pageATS-2026");
  inspectDoc("Lettre de motivation Silvère Martin-Michiellot 2026b");
  
  // Write log to file
  const files = outputFolder.getFilesByName("TemplateInspection.txt");
  if (files.hasNext()) files.next().setTrashed(true);
  outputFolder.createFile("TemplateInspection.txt", log);
  console.log("Inspection complete! Check TemplateInspection.txt in output folder.");
}
