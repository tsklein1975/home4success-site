const fs = require('fs');
const path = require('path');

const prefixes = {
  comma: '/Users/tsvikaklein/antigravity/public/audio/hebrew/temp/tts_המילה_20260409_194526.mp3',
  periodNikud: '/Users/tsvikaklein/antigravity/public/audio/hebrew/temp/tts_הַמִּ_20260409_194534.mp3'
};

const wordPath = '/Users/tsvikaklein/antigravity/public/audio/hebrew/alternatives/פטריה_v7_Milog_STS.mp3';

async function mergeAudio() {
  const wordBuffer = fs.readFileSync(wordPath);

  for (const [key, prefixPath] of Object.entries(prefixes)) {
    const prefixBuffer = fs.readFileSync(prefixPath);
    const finalBuffer = Buffer.concat([prefixBuffer, wordBuffer]);
    const outputPath = `/Users/tsvikaklein/antigravity/public/audio/hebrew/alternatives/פטריה_v8_prefix_${key}.mp3`;
    
    fs.writeFileSync(outputPath, finalBuffer);
    console.log(`Wrote ${outputPath}`);
  }
}

mergeAudio();
