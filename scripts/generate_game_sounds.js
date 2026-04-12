const fs = require('fs');
const https = require('https');
const path = require('path');

const API_KEY = 'sk_443f500b6831a11d7e4f9f2113179d2a567c4a3d7a870bfa';
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice (Engaging Educator)
const MODEL_ID = 'eleven_v3';

const AUDIO_BASE_PATH = path.join(__dirname, '../public/audio/hebrew');
const WORDS_DIR = path.join(AUDIO_BASE_PATH, 'words');
const LETTERS_DIR = path.join(AUDIO_BASE_PATH, 'letters');

// Ensure directories exist
[WORDS_DIR, LETTERS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const HEBREW_WORD_POOL = [
  { text: 'ארנב', wordNikud: 'אַרְנָב', icon: '🐰', letter: 'א', letterNikud: 'אַ' },
  { text: 'ברז', wordNikud: 'בֶּרֶז', icon: '🚰', letter: 'ב', letterNikud: 'בֶּ' },
  { text: 'גיטרה', wordNikud: 'גִּיטָרָה', icon: '🎸', letter: 'ג', letterNikud: 'גִּ' },
  { text: 'דף', wordNikud: 'דַּף', icon: '📄', letter: 'ד', letterNikud: 'דַּ' },
  { text: 'דג', wordNikud: 'דָּג', icon: '🐟', letter: 'ד', letterNikud: 'דָּ' },
  { text: 'הר', wordNikud: 'הַר', icon: '⛰️', letter: 'ה', letterNikud: 'הַ' },
  { text: 'וופל', wordNikud: 'וָפֶל', icon: '🧇', letter: 'ו', letterNikud: 'וָ' },
  { text: 'זית', wordNikud: 'זַיִת', icon: '🫒', letter: 'ז', letterNikud: 'זַ' },
  { text: 'חבל', wordNikud: 'חֶבֶל', icon: '🪢', letter: 'ח', letterNikud: 'חֶ' },
  { text: 'טלפון', wordNikud: 'טֶלֶפוֹן', icon: '☎️', letter: 'ט', letterNikud: 'טֶ' },
  { text: 'יד', wordNikud: 'יָד', icon: '✋', letter: 'י', letterNikud: 'יָ' },
  { text: 'יו-יו', wordNikud: 'יוֹ-יוֹ', icon: '🪀', letter: 'י', letterNikud: 'יוֹ' },
  { text: 'כדור', wordNikud: 'כַּדּוּר', icon: '⚽', letter: 'כ', letterNikud: 'כַּ' },
  { text: 'כריש', wordNikud: 'כָּרִישׁ', icon: '🦈', letter: 'כ', letterNikud: 'כָּ' },
  { text: 'למה', wordNikud: 'לָמָה', icon: '🦙', letter: 'ל', letterNikud: 'לָ' },
  { text: 'מכונית', wordNikud: 'מְכוֹנִית', icon: '🚗', letter: 'מ', letterNikud: 'מְ' },
  { text: 'מלח', wordNikud: 'מֶלַח', icon: '🧂', letter: 'מ', letterNikud: 'מֶ' },
  { text: 'נעליים', wordNikud: 'נַעֲלַיִם', icon: '👟', letter: 'נ', letterNikud: 'נַ' },
  { text: 'נחש', wordNikud: 'נָחָשׁ', icon: '🐍', letter: 'נ', letterNikud: 'נָ' },
  { text: 'ספסל', wordNikud: 'סַפְסָל', icon: '🛋️', letter: 'ס', letterNikud: 'סַ' },
  { text: 'עכבר', wordNikud: 'עַכְבָּר', icon: '🐭', letter: 'ע', letterNikud: 'עַ' },
  { text: 'עטלף', wordNikud: 'עֲטַלֵּף', icon: '🦇', letter: 'ע', letterNikud: 'עֲ' },
  { text: 'פיצה', wordNikud: 'פִּיצָה', icon: '🍕', letter: 'פ', letterNikud: 'פִּ' },
  { text: 'פטריה', wordNikud: 'פִּטְרִיָּה', icon: '🍄', letter: 'פ', letterNikud: 'פִּ' },
  { text: 'צב', wordNikud: 'צָב', icon: '🐢', letter: 'צ', letterNikud: 'צָ' },
  { text: 'קוף', wordNikud: 'קוֹף', icon: '🐒', letter: 'ק', letterNikud: 'קוֹ' },
  { text: 'רגל', wordNikud: 'רֶגֶל', icon: '🦶', letter: 'ר', letterNikud: 'רֶ' },
  { text: 'שיניים', wordNikud: 'שִׁנַּיִם', icon: '🦷', letter: 'ש', letterNikud: 'שִׁ' },
  { text: 'תנין', wordNikud: 'תַּנִּין', icon: '🐊', letter: 'ת', letterNikud: 'תַּ' },
  { text: 'תרנגול', wordNikud: 'תַּרְנְגוֹל', icon: '🐓', letter: 'ת', letterNikud: 'תַּ' },
];

/**
 * Phonetic Overrides Table
 * Maps raw Nikud text to specialized TTS strings for better pronunciation and stress.
 */
const PHONETIC_OVERRIDES = {
  'וָפֶל': 'וָו-פֶל', // Fix "F" sound instead of "P"
  'מֶלַח': 'מֶ-לַח.', // Force Mil'el stress with period emphasis
  'יָד': 'יָ-ד.',    // Force clear articulation of "Yad"
  'דָּג': 'דָּ-ג.',    // Force clear articulation of "Dag"
  'דַּף': 'דַּ-ף.',    // Force clear articulation of "Daf"
  'צָב': 'צָ-ב.',    // Force clear articulation of "Tzav"
  'הַר': 'הַ-ר.',    // Force clear articulation of "Har"
};

async function generateTTS(text, prefix, filePath) {
  // Use specialized string if available
  const phoneticText = PHONETIC_OVERRIDES[text] || text;
  
  // Format based on prefix
  let fullText;
  if (prefix === 'המילה היא') {
    fullText = `המילה היא - ${phoneticText}`;
  } else if (prefix === 'הצליל הוא') {
    fullText = `הצליל הוא - ${phoneticText}`;
  } else {
    fullText = phoneticText;
  }
  
  // Add trailing punctuation helps short words
  if (!fullText.endsWith('.')) fullText += '.';

  console.log(`Generating: "${fullText}" (File: ${path.basename(filePath)})...`);
  
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      text: fullText,
      model_id: MODEL_ID,
      voice_settings: {
        stability: 0.35, // Lower stability can help with natural flow in multilingual
        similarity_boost: 0.8
      }
    });

    const options = {
      hostname: 'api.elevenlabs.io',
      path: `/v1/text-to-speech/${VOICE_ID}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let errorBody = '';
        res.on('data', (chunk) => errorBody += chunk);
        res.on('end', () => reject(new Error(`API Error ${res.statusCode}: ${errorBody}`)));
        return;
      }

      const fileStream = fs.createWriteStream(filePath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    });

    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
}

async function run() {
  try {
    // Purge logic: Ensure we're cleaning up specifically for these categories
    // (Manual rm -rf is already happening in command, but logic here ensures clean overwrite if run standalone)
    
    for (const item of HEBREW_WORD_POOL) {
      if (item.text) {
        const wordFile = path.join(WORDS_DIR, `${item.text}.mp3`);
        await generateTTS(item.wordNikud || item.text, 'המילה היא', wordFile);
        await new Promise(r => setTimeout(r, 800)); // Rate limit buffer
      }

      if (item.letterNikud || item.letter) {
        const letterText = item.letterNikud || item.letter;
        const letterFile = path.join(LETTERS_DIR, `${letterText}.mp3`);
        await generateTTS(letterText, 'הצליל הוא', letterFile);
        await new Promise(r => setTimeout(r, 800)); // Rate limit buffer
      }
    }
    console.log('Full audio regeneration complete!');
  } catch (err) {
    console.error('Error during generation:', err);
  }
}

run();
