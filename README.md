# HelloApply: Cloud Edition
**VERSION 1.2.0**

Autonomous AI-driven job application pipeline for Google Apps Script.

## 🏗️ Architecture
The system operates as a 100% Cloud pipeline on Google infrastructure:
1.  **Ingestion**: Monitors Gmail for unread alerts from LinkedIn and HelloWork.
2.  **Filtering**: Extracts and filters job URLs using strict regex to avoid administrative links.
3.  **Analysis Phase (New)**: Gemini 1.5 Flash analyzes each job offer against the **Master CV** to calculate a matching score and pros/cons.
4.  **Decision Logic**: The system decides whether to apply based on a minimum match score (60% by default).
5.  **Generation**: For the **Top 5** matches, it generates a tailored CV and Cover Letter using Google Docs templates.
6.  **Reporting**: A global summary report is created for each execution, detailing the analysis of all jobs found.

## 🎨 Design Decisions
- **Fuzzy Search for Resources**: The script dynamically scans the `input` folder for files containing keywords (full, 1pageATS, Lettre), making it resilient to file ID changes.
- **Scoring & Selectivity**: To avoid "application spam", the system prioritizes quality over quantity, only generating files for highly relevant offers.
- **Fallbacks**: Implementation of robust JSON extraction fallbacks for Gemini to ensure stability even if the API response format varies.
- **Standardization**: Using `.gs` extension and root-level organization for perfect integration with the Google Apps Script IDE.

## ⚙️ Setup
1.  **Google Drive**: Create an `input` folder and an `output` folder.
2.  **Templates**: Place your Master CV (`full`), Template CV (`1pageATS`), and Template Letter (`Lettre`) in the `input` folder.
3.  **API Key**: Add your Gemini API Key in `Code.gs`.
4.  **Services**: Enable **Drive API** and **Google Docs API** in Apps Script Services.
5.  **Triggers**: Run `setupTrigger()` once to automate execution every 30 minutes.

## 🚀 Deployment
- Local editing with **Clasp**.
- Use `push.bat` to sync local changes to the Cloud.
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   USER_EMAIL=silvere.martin@gmail.com
   ```bash
   npm run dev
   ```

## Workflow
- Monitors Gmail for "HelloWork" search alerts.
- Scrapes the job offer URL.
- Uses Gemini AI to tailor the ATS CV and Cover Letter.
- Generates professional PDFs.
- Sends an email with attachments for review.
