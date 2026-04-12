const fs = require('fs');
const https = require('https');
const path = require('path');

const API_KEY = 'sk_443f500b6831a11d7e4f9f2113179d2a567c4a3d7a870bfa';
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const MODEL_ID = 'eleven_v3';

const AUDIO_BASE_PATH = path.join(__dirname, '../public/audio/hebrew/words');

const WORDS_TO_FIX = [
  { text: 'נעליים', phonetic: 'נַעֲ-לַיִם.' },
  { text: 'פטריה', phonetic: 'פִּטְ-רִיָּ-ה.' },
  { text: 'ספסל', phonetic: 'סַפְ-סָל.' },
  { text: 'שיניים', phonetic: 'שִׁ-נַּיִם.' },
  { text: 'הר', phonetic: 'הַ-ר.' },
  { text: 'צב', phonetic: 'צָ-ב.' },
];

async function generateTTS(phoneticText, filePath) {
  const fullText = `המילה היא - ${phoneticText}`;
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
  for (const item of WORDS_TO_FIX) {
    const filePath = path.join(AUDIO_BASE_PATH, `${item.text}.mp3`);
    await generateTTS(item.phonetic, filePath);
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log('Targeted updates complete!');
}

run();
