import { GoogleGenerativeAI } from '@google/generative-ai';
import { JobDetails } from './scraper';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateTailoredContent(job: JobDetails, userProfile: any) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const prompt = `
    Tu es un expert en recrutement et en rédaction de CV.
    Voici une offre d'emploi :
    Titre : ${job.title}
    Entreprise : ${job.company}
    Description : ${job.description}
    Prérequis : ${job.requirements}

    Voici mon profil (CV complet) :
    ${JSON.stringify(userProfile)}

    Génère les éléments suivants en français (ou en anglais si l'offre est en anglais) :
    1. Un CV d'une page adapté à l'offre (Format JSON structuré pour injection dans un template HTML).
    2. Une lettre de motivation percutante et personnalisée.
    3. Un court message d'accompagnement pour l'email.

    Concentre-toi sur mes expériences en IA Augmentée et en architecture Java, en faisant le lien avec les besoins de l'offre.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
