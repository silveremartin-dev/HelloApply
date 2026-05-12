import dotenv from 'dotenv';
import { getGmailClient, searchJobEmails, getEmailContent, extractJobUrl } from './gmail';
import { scrapeJobOffer } from './scraper';
import { generateTailoredContent } from './generator';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

async function main() {
  console.log('--- HelloApply Automation Starting ---');

  try {
    const gmail = await getGmailClient();
    
    // V1 & V2: Search for HelloWork and generic job alerts
    const query = 'from:alerte@hellowork.com OR subject:"Offre d\'emploi" OR subject:"Job Alert"';
    console.log(`Searching Gmail with query: ${query}`);
    
    const messages = await searchJobEmails(gmail, query);
    console.log(`Found ${messages.length} potential job emails.`);

    for (const msg of messages) {
      if (!msg.id) continue;

      const content = await getEmailContent(gmail, msg.id);
      const url = extractJobUrl(content);

      if (url) {
        console.log(`Processing offer: ${url}`);
        const job = await scrapeJobOffer(url);

        if (job) {
          console.log(`Successfully scraped: ${job.title} at ${job.company}`);
          
          // Load user profile (Placeholder for CV analysis result)
          const userProfile = { name: 'Silvère Martin-Michiellot', status: 'Expert Antigravity' };

          const tailored = await generateTailoredContent(job, userProfile);
          console.log('Tailored content generated.');

          // TODO: PDF Generation and Email sending
          // For now, save as a log
          await fs.appendFile('applications.log', `\n[${new Date().toISOString()}] Applied to ${job.company} - ${job.title}\n`);
        }
      }
    }

  } catch (err) {
    console.error('Error during execution:', err);
  }

  console.log('--- HelloApply Automation Finished ---');
}

main();
