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
