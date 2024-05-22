import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, '..', '..', 'dist', 'index.js');
const shebang = '#!/usr/bin/env node\n';

// Read the current content of the file
const fileContent = fs.readFileSync(filePath, 'utf8');

// Prepend the shebang line
fs.writeFileSync(filePath, shebang + fileContent);
