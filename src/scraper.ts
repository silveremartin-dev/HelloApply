import puppeteer from 'puppeteer';

export interface JobDetails {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  url: string;
}

export async function scrapeJobOffer(url: string): Promise<JobDetails | null> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Set a realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    await page.goto(url, { waitUntil: 'networkidle2' });

    if (url.includes('hellowork.com')) {
      return await scrapeHelloWork(page, url);
    }

    // Generic fallback or other boards can be added here
    return null;
  } catch (err) {
    console.error(`Error scraping ${url}:`, err);
    return null;
  } finally {
    await browser.close();
  }
}

async function scrapeHelloWork(page: puppeteer.Page, url: string): Promise<JobDetails> {
  // Selectors might need adjustment as sites change
  const details = await page.evaluate(() => {
    const title = document.querySelector('h1')?.innerText || '';
    const company = document.querySelector('.offer-company')?.textContent || '';
    const location = document.querySelector('.offer-location')?.textContent || '';
    
    // Mission and profile are often in structured blocks
    const description = document.querySelector('.offer-description')?.innerText || '';
    const requirements = document.querySelector('.offer-profile')?.innerText || '';

    return { title, company, location, description, requirements };
  });

  return { ...details, url };
}
