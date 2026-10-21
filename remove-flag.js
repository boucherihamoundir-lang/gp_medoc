const fs = require('fs');
const path = require('path');

const files = ['medecin.html', 'doctor.html'];
for (const file of files) {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove the flag stripe
  content = content.replace(/\s*<!-- Drapeau algérien -->\s*<div class="h-2 w-full"[^>]*><\/div>/g, '');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
}
