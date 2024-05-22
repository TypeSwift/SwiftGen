import { Project } from "ts-morph";
import path from 'path';
import fs from 'fs';
import { readConfig, writeSwiftCodeToFile, getAllFiles } from './utils/fileUtils';
import { extractFunctions } from './extract/functions';
import { extractVariables } from './extract/variables';
import { extractEnums } from './extract/enums';
import { extractTypeAliases } from './extract/typeAliases';
import { generateSwiftCode } from './gen/swiftCodeGen';

console.log("Starting SwiftGen...");

// Read configuration file
const configPath = path.join(__dirname, 'config/config.json');
const config = readConfig(configPath);

console.log("Configuration loaded:", config);

// Read package.json file
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageInfo = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

function initializeProject(filePath: string) {
  const project = new Project();
  return project.addSourceFileAtPath(filePath);
}

const inputDir = config.inputDir;
const debug = config.debug || false;
console.log("Input directory:", inputDir);
const inputFiles = getAllFiles(inputDir);
console.log("Input files:", inputFiles);

let combinedVariables: string[] = [];
let combinedFunctions: any[] = [];
let combinedEnums: any[] = [];
let combinedTypeAliases: any[] = [];

inputFiles.forEach((filePath: string) => {
  try {
    const sourceFile = initializeProject(filePath);
    combinedVariables = combinedVariables.concat(extractVariables(sourceFile));
    combinedFunctions = combinedFunctions.concat(extractFunctions(sourceFile, debug));
    combinedEnums = combinedEnums.concat(extractEnums(sourceFile));
    combinedTypeAliases = combinedTypeAliases.concat(extractTypeAliases(sourceFile));
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
});

const swiftCode = generateSwiftCode(combinedVariables, combinedFunctions, combinedEnums, combinedTypeAliases, packageInfo);
writeSwiftCodeToFile(swiftCode, config.outputDir, config.outputFileName, config.outputSuffix);

console.log("SwiftGen completed.");
