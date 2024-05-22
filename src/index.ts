import { runSwiftGen } from './swiftgen';
import path from 'path';
import { readJsonFile, resolveDir } from './utils/fileUtils';
import { Command } from 'commander';
import fs from 'fs';

const program = new Command();

program
  .option('-c, --config <path>', 'set config path', 'config.json')
  .parse(process.argv);

const options = program.opts();
let configPath = options.config;

console.log("Received config path:", configPath);

// Resolve the config path: if the provided path is not absolute, resolve it relative to the current working directory
if (!path.isAbsolute(configPath)) {
  configPath = path.resolve(process.cwd(), configPath);
}

console.log("Resolved config path:", configPath);

// Check if the config file exists in the specified path, otherwise fall back to the default config file in the package directory
if (!fs.existsSync(configPath)) {
  console.log(`Config file not found at ${configPath}, falling back to default config.`);
  configPath = path.join(__dirname, 'config/config.json');
} else {
  console.log(`Config file found at ${configPath}`);
}

const config = readJsonFile(configPath);
console.log("Loaded config:", config);

config.inputDir = resolveDir(config.inputDir);
config.outputDir = resolveDir(config.outputDir);

runSwiftGen(config);
