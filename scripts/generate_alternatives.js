const fs = require('fs');
const https = require('https');
const path = require('path');

const API_KEY = 'sk_443f500b6831a11d7e4f9f2113179d2a567c4a3d7a870bfa';
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const MODEL_ID = 'eleven_v3';

const ALTERNATIVES_DIR = path.join(__dirname, '../public/audio/hebrew/alternatives');

if (!fs.existsSync(ALTERNATIVES_DIR)) {
  fs.mkdirSync(ALTERNATIVES_DIR, { recursive: true });
}

const VARIANTS = {
  'נעליים': [
    { name: 'Standard', text: 'נַעֲ-לַיִם' },
    { name: 'Natural', text: 'נע-ליים' },
    { name: 'FullSplit', text: 'נַ-עֲ-לַ-יִ-ם' }
  ],
  'פטריה': [
    { name: 'Standard', text: 'פִּטְ-רִיָּ-ה' },
    { name: 'VavRich', text: 'פיט-רייה' },
    { name: 'Precise', text: 'פִּט-רִי-יָה' }
  ],
  'ספסל': [
    { name: 'Standard', text: 'סַפְ-סָל' },
    { name: 'LongVowel', text: 'סַפ-סאל' },
    { name: 'Exclamation', text: 'סַפ-סַל !' }
  ],
  'שיניים': [
    { name: 'Standard', text: 'שִׁ-נַּיִם' },
    { name: 'Natural', text: 'שי-ניים' },
    { name: 'DoubleYod', text: 'שִׁי-נַּ-יִיים' }
  ],
  'הר': [
    { name: 'Standard', text: 'הַר' },
    { name: 'Emphasis', text: 'הַ-ר !' },
    { name: 'Spaced', text: 'הַ ר .' }
  ],
  'צב': [
    { name: 'Standard', text: 'צָב' },
    { name: 'AlephHint', text: 'צָאב' },
    { name: 'Punctuation', text: 'צָ-ב .' }
  ]
};

async function generateTTS(inputText, filePath) {
  const fullText = `המילה היא - ${inputText}`;
  console.log(`Generating: "${fullText}" (File: ${path.basename(filePath)})...`);
  
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      text: fullText,
      model_id: MODEL_ID,
      voice_settings: {
        stability: 0.35,
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
  for (const [word, items] of Object.entries(VARIANTS)) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const fileName = `${word}_variant_${i + 1}_${item.name}.mp3`;
      const filePath = path.join(ALTERNATIVES_DIR, fileName);
      await generateTTS(item.text, filePath);
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  console.log('Alternatives generation complete!');
}

run();
