# HelloApply

Automated job application generator for HelloWork alerts in Gmail.

## Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/silveremartin-dev/HelloApply.git
   cd HelloApply
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Gmail API Setup**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project.
   - Enable the **Gmail API**.
   - Go to **Credentials** -> **Create Credentials** -> **OAuth client ID**.
   - Select **Desktop app**.
   - Download the JSON file and rename it to `credentials.json` in the root of this project.

4. **Environment Variables**:
   Create a `.env` file with:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   USER_EMAIL=silvere.martin@gmail.com
   ```

5. **Run**:
   ```bash
   npm run dev
   ```

## Workflow
- Monitors Gmail for "HelloWork" search alerts.
- Scrapes the job offer URL.
- Uses Gemini AI to tailor the ATS CV and Cover Letter.
- Generates professional PDFs.
- Sends an email with attachments for review.
