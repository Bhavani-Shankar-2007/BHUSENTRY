import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'ml', name: 'Malayalam (മലയാളം)' },
  { code: 'as', name: 'Assamese (অসমীয়া)' },
  { code: 'brx', name: 'Bodo (बड़ो)' },
  { code: 'mni', name: 'Manipuri (ꯃꯤꯇꯩꯂꯣꯟ)' },
  { code: 'lus', name: 'Mizo (Mizo ṭawng)' },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  return (
    <div className="relative inline-flex items-center gap-1">
      <Globe className="w-5 h-5 text-slate-500 dark:text-slate-400" />
      <select
        className="block w-auto bg-transparent border-0 py-1.5 pl-1 pr-6 text-slate-700 hover:text-slate-900 focus:ring-0 sm:text-sm sm:leading-6 dark:text-slate-300 dark:hover:text-white cursor-pointer font-medium outline-none shadow-none"
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};
