const fs = require('fs');
const TextToSVG = require('text-to-svg');

const fontPath = './Heebo-Bold.ttf';
generatePaths();

function generatePaths() {
  console.log('Parsing TTF Font into exact SVGs...');
  const textToSVG = TextToSVG.loadSync(fontPath);
  const hebrew = 'אבגדהוזחטיכלמנסעפצקרשת';
  const english = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  const hPaths = {};
  for(const char of hebrew) {
    const path = textToSVG.getD(char, {x: 50, y: 75, fontSize: 80, anchor: 'center baseline'});
    hPaths[char] = [path];
  }
  const ePaths = {};
  for(const char of english) {
    const path = textToSVG.getD(char, {x: 50, y: 75, fontSize: 80, anchor: 'center baseline'});
    ePaths[char] = [path];
  }
  
  const content = `export type LetterDef = string[];\n\nexport const hebrewLetters: Record<string, LetterDef> = ${JSON.stringify(hPaths, null, 2)};\n\nexport const englishLetters: Record<string, LetterDef> = ${JSON.stringify(ePaths, null, 2)};`;
  
  fs.writeFileSync('./src/components/interactive/lettersDataSVG.ts', content);
  console.log('SUCCESS!');
}
