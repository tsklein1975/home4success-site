const fs = require('fs');
const https = require('https');
const path = require('path');

const API_KEY = 'sk_443f500b6831a11d7e4f9f2113179d2a567c4a3d7a870bfa';
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const MODEL_ID = 'eleven_v3';

const ALTERNATIVES_DIR = path.join(__dirname, '../public/audio/hebrew/alternatives');

const MUSHROOM_VARIANTS_V6 = [
  { name: 'Weighted_Milra', text: 'פִּטְ-רִי - יָה.' }, // Space gap before final syllable
  { name: 'Mappiq_Exclamation', text: 'פִּט-רִי-יָהּ !' }, // Sharp finish
  { name: 'Clarified_Pi', text: 'פִּיט-רִי-יָה.' },    // Full Yod for the first syllable
];

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
  for (let i = 0; i < MUSHROOM_VARIANTS_V6.length; i++) {
    const item = MUSHROOM_VARIANTS_V6[i];
    const fileName = `פטריה_v6_variant_${i + 8}_${item.name}.mp3`;
    const filePath = path.join(ALTERNATIVES_DIR, fileName);
    await generateTTS(item.text, filePath);
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log('Mushroom v6 (Final Refinement) generation complete!');
}

run();
