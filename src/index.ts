import { runSwiftGen } from './swiftgen';
import path from 'path';
import { readJsonFile, resolveDir } from './utils/fileUtils';
import { Command } from 'commander';

const program = new Command();

program
  .option('-c, --config <path>', 'set config path', path.join(__dirname, 'config/config.json'))
  .parse(process.argv);

const options = program.opts();
const configPath = options.config;
const config = readJsonFile(configPath);

config.inputDir = resolveDir(config.inputDir);
config.outputDir = resolveDir(config.outputDir);

runSwiftGen(config);
