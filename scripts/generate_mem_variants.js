const fs = require('fs');
const https = require('https');
const path = require('path');

const API_KEY = 'sk_443f500b6831a11d7e4f9f2113179d2a567c4a3d7a870bfa';
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice (Premade Educator)
const MODEL_ID = 'eleven_multilingual_v2';

const ALTS_DIR = path.join(__dirname, '../public/audio/hebrew/alternatives');

if (!fs.existsSync(ALTS_DIR)) {
  fs.mkdirSync(ALTS_DIR, { recursive: true });
}

// Generating different variations of "הצליל הוא מְ" to get different intonations
const VARIANTS = [
  { name: 'mem_var_plain', text: "הצליל הוא מְ" },
  { name: 'mem_var_colon', text: "הצליל הוא: מְ" },
  { name: 'mem_var_comma', text: "הצליל הוא, מְ" },
  { name: 'mem_var_dash', text: "הצליל הוא - מְ" }
];

async function generateTTS(text, filePath) {
  console.log(`Generating: "${text}" into ${path.basename(filePath)}...`);
  
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      text: text,
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
  for (const v of VARIANTS) {
    const filePath = path.join(ALTS_DIR, `${v.name}.mp3`);
    await generateTTS(v.text, filePath);
    // Be nice to API rate limits
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log("\nDone! Check the public/audio/hebrew/alternatives folder.");
}

run();
