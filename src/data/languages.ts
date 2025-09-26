// Re-export JSON for Turbopack compatibility
// Using import attributes keeps the source of truth in languages.json
import data from './languages.json' assert { type: 'json' };

export type LanguageInfo = {
  name: string;
  code: string;
  countryCode?: string;
  callingCode?: string;
};

const languages = data as unknown as LanguageInfo[];
export default languages;



