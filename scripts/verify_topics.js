const fs = require('fs');
const path = require('path');
const topicsDir = path.join(__dirname, '..', 'src', 'data', 'topics');
const files = [
  'airport.json',
  'restaurant.json',
  'hotel.json',
  'transportation.json',
  'cafe.json',
  'shopping.json',
  'socializing.json',
  'workplace.json'
];

let totalScenarios = 0;
let totalVocab = 0;

for (const f of files) {
  const p = path.join(topicsDir, f);
  if (!fs.existsSync(p)) {
    console.error('Missing file:', f);
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  console.log(`Topic: ${data.icon} ${data.titleEn} (${data.id}) -> ${data.scenarios.length} scenarios`);
  totalScenarios += data.scenarios.length;
  for (const s of data.scenarios) {
    if (!s.id || !s.titleEn || !s.defaultRoles || !s.initialMessageEn) {
      console.error('Invalid scenario:', s.id);
      process.exit(1);
    }
    totalVocab += (s.vocabulary || []).length;
  }
}

console.log(`\nALL VALID! Total Topics: ${files.length}, Total Scenarios: ${totalScenarios}, Total Vocab: ${totalVocab}`);
