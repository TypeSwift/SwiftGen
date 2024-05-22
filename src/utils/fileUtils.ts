import fs from 'fs';
import path from 'path';
import os from 'os';

export function readJsonFile(filePath: string) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading JSON file at ${filePath}:`, error);
    throw error;
  }
}

export function resolveDir(dir: string) {
  // Expand `~` to the home directory
  if (dir.startsWith('~')) {
    dir = path.join(os.homedir(), dir.slice(1));
  }

  // Resolve the directory path
  return path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);
}

export function ensureOutputDirExists(outputDir: string) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
}

export function writeSwiftCodeToFile(swiftCode: string, outputDir: string, outputFileName: string, outputSuffix: string) {
  ensureOutputDirExists(outputDir);
  const outputFilePath = path.join(outputDir, `${outputFileName}${outputSuffix}`);
  fs.writeFileSync(outputFilePath, swiftCode);
  console.log(`Swift code generated successfully at ${outputFilePath}`);
}

export function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}
