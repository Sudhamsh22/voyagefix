import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Note: GenkitPlugin is not a real type, using any to avoid type errors.
const plugins: any[] = [];

if (process.env.GEMINI_API_KEY) {
  plugins.push(googleAI());
} else {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      'WARNING: GEMINI_API_KEY environment variable not set. AI features will be disabled. Please create a .env.local file and add your API key.'
    );
  } else {
    console.error('ERROR: GEMINI_API_KEY environment variable not set. AI features are disabled.');
  }
}


export const ai = genkit({
  plugins,
  model: 'googleai/gemini-2.5-flash',
});
