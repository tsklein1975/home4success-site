const { execSync } = require('child_process');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const fs = require('fs');

const DURATION_VARIANTS = ['1.0']; // Testing exactly 1.0s as requested
const PREFIX_SOURCE = 'public/audio/hebrew/words/דג.mp3';
const TARGET_WORD = 'public/audio/hebrew/alternatives/פטריה_v7_Milog_STS.mp3';
const OUTPUT_DIR = 'public/audio/hebrew/alternatives';
const TEMP_DIR = 'public/audio/hebrew/temp_slices';

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

DURATION_VARIANTS.forEach(duration => {
  const prefixPath = `${TEMP_DIR}/prefix_${duration}.mp3`;
  const mergedPath = `${OUTPUT_DIR}/פטריה_merged_${duration}s.mp3`;

  // 1. Extract prefix
  console.log(`Extracting prefix for ${duration}s...`);
  execSync(`"${ffmpegPath}" -y -t ${duration} -i "${PREFIX_SOURCE}" -c copy "${prefixPath}"`, { stdio: 'inherit' });

  // 2. Merge with target word
  console.log(`Merging for ${duration}s...`);
  execSync(`"${ffmpegPath}" -y -i "${prefixPath}" -i "${TARGET_WORD}" -filter_complex "[0:a][1:a]concat=n=2:v=0:a=1[outa]" -map "[outa]" "${mergedPath}"`, { stdio: 'inherit' });
  
  console.log(`Successfully generated: ${mergedPath}`);
});

console.log('All variations processed.');
