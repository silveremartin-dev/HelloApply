import fs from 'fs/promises';
import path from 'path';
import Mustache from 'mustache';
import puppeteer from 'puppeteer';

const PROJECT_ROOT = 'C:\\Silvere\\Encours\\Developpement\\HelloApply';
const TEMP_DIR = path.join(PROJECT_ROOT, 'temp_results');

const DATA = [
  {
    id: 'A_FR_Fintech',
    name: 'Silvère Martin-Michiellot',
    title: 'Architecte Senior Java | Expert Performance',
    email: 'silvere.martin@gmail.com',
    phone: '07 67 81 52 02',
    location: 'Lorient / Remote',
    links: 'github.com/silveremartin-dev',
    summary: 'Expert Java (J2SE 1.0 à 21+) spécialisé dans les systèmes financiers à haute performance et la refonte de legacy critique.',
    skills: [
      { category: 'Backend', items: 'Java 21, Spring Boot, Hibernate, Kafka, SQL' },
      { category: 'Architecture', items: 'Micro-services, Design Patterns, Calcul Scientifique' }
    ],
    education: [{ degree: 'DEA Intelligence Artificielle', year: '1994', school: 'INPG Grenoble' }],
    languages: 'Français (Maternel), Anglais (C2)',
    experience: [
      { role: 'Lead Architecte Open Source', dates: '2025 - Présent', company: 'Episteme', location: 'Remote', description: 'Développement d\'une bibliothèque de calcul 10x plus rapide que les standards Apache.' }
    ],
    subject: 'Candidature Architecte Senior Java',
    letter_content: 'Fort d\'une expertise de 30 ans en Java, j\'ai suivi l\'évolution du langage depuis ses débuts. Ma capacité à concevoir des architectures robustes pour des environnements à forte contrainte, comme illustré par mon projet Episteme, est un atout majeur pour votre Fintech...'
  },
  {
    id: 'C_EN_London',
    name: 'Silvère Martin-Michiellot',
    title: 'Lead AI Research Engineer',
    email: 'silvere.martin@gmail.com',
    phone: '+33 7 67 81 52 02',
    location: 'London (Remote)',
    links: 'github.com/silveremartin-dev',
    summary: 'AI Architect and Neurosciences expert specializing in multi-agent orchestration and cognitive-augmented engineering.',
    skills: [
      { category: 'AI & Research', items: 'Multi-agent Systems, Deep Learning, Cognitive Science' },
      { category: 'Engineering', items: 'Python, Java, Distributed Systems, Antigravity' }
    ],
    education: [{ degree: 'Cert. in Cognitive Neurosciences', year: '1998', school: 'University of Geneva' }],
    languages: 'French (Native), English (C2 - TOEFL 267/300)',
    experience: [
      { role: 'AI Architect (Antigravity Expert)', dates: '2024 - Present', company: 'Open Source', location: 'Remote', description: 'Pioneering augmented engineering through multi-agent collaboration and high-performance cognitive loops.' }
    ],
    subject: 'Application for Lead AI Research Engineer',
    letter_content: 'As a pioneer in augmented engineering and a Google Antigravity Expert, I bridge the gap between natural and artificial intelligence. My background in neurosciences combined with 30 years of system architecture allows me to design next-gen multi-agent systems that are both cognitively sound and highly scalable...'
  }
];

async function generatePDF(html: string, outputPath: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({ path: outputPath, format: 'A4', printBackground: true });
  await browser.close();
}

async function run() {
  await fs.mkdir(TEMP_DIR, { recursive: true });
  const cvTemplate = await fs.readFile(path.join(PROJECT_ROOT, 'src/templates/cv.html'), 'utf-8');
  const letterTemplate = await fs.readFile(path.join(PROJECT_ROOT, 'src/templates/letter.html'), 'utf-8');

  for (const data of DATA) {
    console.log(`Generating PDFs for: ${data.id}...`);
    
    const cvHtml = Mustache.render(cvTemplate, data);
    await generatePDF(cvHtml, path.join(TEMP_DIR, `CV_${data.id}.pdf`));

    const letterHtml = Mustache.render(letterTemplate, { ...data, content: data.letter_content, date: '12/05/2026', city: 'Lorient' });
    await generatePDF(letterHtml, path.join(TEMP_DIR, `Letter_${data.id}.pdf`));

    console.log(`Finished ${data.id}`);
  }
}

run().catch(console.error);
