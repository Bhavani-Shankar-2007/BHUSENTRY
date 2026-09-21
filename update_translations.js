const fs = require('fs');
const path = require('path');

const localesDir = path.join('d:', 'PERSONAL FILES', 'MY PROJECTS', 'BHUSENTRY', 'Frontend', 'public', 'locales');
const languages = ['en', 'hi', 'ta', 'te', 'ml', 'as', 'brx', 'mni', 'lus'];

const newKeys = {
  critical_warnings: "Critical Warnings",
  surveillance_active: "Surveillance Active",
  search_placeholder: "Search stations...",
  ner: "NER",
  ner_full: "North Eastern Region",
  western_ghats: "Western Ghats",
  western_ghats_full: "Western Ghats",
  n_himalayas: "N-Himalayas",
  n_himalayas_full: "Northern Himalayas",
  pan_india: "Pan-India",
  pan_india_full: "All India (Pan-India)",
  score: "Score",
  '24h_rainfall': "24h Rainfall",
  slope_angle: "Slope Angle",
  elevation: "Elevation",
  telemetry_sync: "Telemetry Sync",
  lithology_soil: "Lithology & Soil",
  land_classification: "Land Classification",
};

languages.forEach(lang => {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (lang === 'en') {
      data = { ...data, ...newKeys };
    } else {
      let translatedKeys = {};
      for (const [key, value] of Object.entries(newKeys)) {
        if (lang === 'hi') {
           if (key === 'critical_warnings') translatedKeys[key] = "गंभीर चेतावनी";
           else if (key === 'search_placeholder') translatedKeys[key] = "स्टेशन खोजें...";
           else if (key === 'score') translatedKeys[key] = "स्कोर";
           else if (key === '24h_rainfall') translatedKeys[key] = "24 घंटे की बारिश";
           else if (key === 'slope_angle') translatedKeys[key] = "ढलान कोण";
           else if (key === 'elevation') translatedKeys[key] = "ऊंचाई";
           else if (key === 'lithology_soil') translatedKeys[key] = "लिथोलॉजी और मिट्टी";
           else if (key === 'land_classification') translatedKeys[key] = "भूमि वर्गीकरण";
           else translatedKeys[key] = `[HI] ${value}`;
        } else {
           translatedKeys[key] = `[${lang.toUpperCase()}] ${value}`;
        }
      }
      data = { ...data, ...translatedKeys };
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${lang}/translation.json`);
  }
});
