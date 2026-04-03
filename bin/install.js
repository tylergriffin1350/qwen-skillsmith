#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const green = '\x1b[32m';
const cyan = '\x1b[36m';
const yellow = '\x1b[33m';
const dim = '\x1b[2m';
const reset = '\x1b[0m';

const pkg = require('../package.json');

const banner = `
${cyan}  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557
  \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255d
  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2557  
  \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u255d  
  \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255d\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557
  \u255a\u2550\u2550\u2550\u2550\u2550\u255d \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d\u255a\u2550\u255d  \u255a\u2550\u255d\u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d\u255a\u2550\u2550\u2550\u2550\u2550\u255d${reset}

  Skillsmith ${dim}v${pkg.version}${reset}
  Build consistent skills for Qwen Code
`;

const args = process.argv.slice(2);
const hasHelp = args.includes('--help') || args.includes('-h');
const hasLocal = args.includes('--local') || args.includes('-l');

function parseConfigDirArg() {
  const idx = args.findIndex(arg => arg === '--config-dir' || arg === '-c');
  if (idx !== -1) {
    const nextArg = args[idx + 1];
    if (!nextArg || nextArg.startsWith('-')) {
      console.error(`  ${yellow}--config-dir requires a path argument${reset}`);
      process.exit(1);
    }
    return nextArg;
  }
  const configDirArg = args.find(arg => arg.startsWith('--config-dir=') || arg.startsWith('-c='));
  if (configDirArg) return configDirArg.split('=')[1];
  return null;
}

function expandTilde(filePath) {
  if (filePath && filePath.startsWith('~/')) return path.join(os.homedir(), filePath.slice(2));
  return filePath;
}

function copyDir(srcDir, destDir, skipDirs = []) {
  fs.mkdirSync(destDir, { recursive: true });
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    if (skipDirs.includes(entry.name)) continue;
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath, skipDirs);
    else fs.copyFileSync(srcPath, destPath);
  }
}

function countFiles(dir, ext) {
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) count += countFiles(fullPath, ext);
    else if (!ext || entry.name.endsWith(ext)) count++;
  }
  return count;
}

console.log(banner);

if (hasHelp) {
  console.log(`  ${yellow}Usage:${reset} npx qwen-skillsmith [options]

  ${yellow}Options:${reset}
    ${cyan}-l, --local${reset}              Install to ./.qwen/commands/ instead of global
    ${cyan}-c, --config-dir <path>${reset}  Specify custom Qwen config directory
    ${cyan}-h, --help${reset}               Show this help message

  ${yellow}Examples:${reset}
    ${dim}# Install globally (default)${reset}
    npx qwen-skillsmith

    ${dim}# Install to current project only${reset}
    npx qwen-skillsmith --local

  ${yellow}What gets installed:${reset}
    ${cyan}commands/qwen-skillsmith/${reset}
      skillsmith.md        Entry point (meta-skill)
      tasks/               4 task files (discover, scaffold, distill, audit)
      rules/               6 rule files (syntax enforcement)
      templates/           Skill spec template
      specs/               7 syntax specs (entry-point, tasks, templates, etc.)
`);
  process.exit(0);
}

const explicitConfigDir = parseConfigDirArg();
const configDir = expandTilde(explicitConfigDir) || expandTilde(process.env.QWEN_CONFIG_DIR);
const globalDir = configDir || path.join(os.homedir(), '.qwen');
const qwenDir = hasLocal ? path.join(process.cwd(), '.qwen') : globalDir;
const smDest = path.join(qwenDir, 'commands', 'qwen-skillsmith');

const locationLabel = hasLocal
  ? smDest.replace(process.cwd(), '.')
  : smDest.replace(os.homedir(), '~');

if (fs.existsSync(smDest)) {
  console.log(`  ${yellow}Existing installation found at ${locationLabel}${reset}`);
  console.log(`  Updating...`);
  fs.rmSync(smDest, { recursive: true, force: true });
}

console.log(`  Installing to ${cyan}${locationLabel}${reset}\n`);

const src = path.join(__dirname, '..');

fs.mkdirSync(smDest, { recursive: true });

// Copy entry point
fs.copyFileSync(path.join(src, 'skillsmith', 'skillsmith.md'), path.join(smDest, 'skillsmith.md'));
console.log(`  ${green}+${reset} skillsmith.md ${dim}(meta-skill entry point)${reset}`);

// Copy tasks
const tasksSrc = path.join(src, 'skillsmith', 'tasks');
const tasksDest = path.join(smDest, 'tasks');
copyDir(tasksSrc, tasksDest);
const taskCount = countFiles(tasksSrc, '.md');
console.log(`  ${green}+${reset} tasks/ ${dim}(${taskCount} task files)${reset}`);

// Copy rules
const rulesSrc = path.join(src, 'skillsmith', 'rules');
const rulesDest = path.join(smDest, 'rules');
copyDir(rulesSrc, rulesDest);
const ruleCount = countFiles(rulesSrc, '.md');
console.log(`  ${green}+${reset} rules/ ${dim}(${ruleCount} rule files)${reset}`);

// Copy templates
const tplSrc = path.join(src, 'skillsmith', 'templates');
const tplDest = path.join(smDest, 'templates');
copyDir(tplSrc, tplDest);
console.log(`  ${green}+${reset} templates/ ${dim}(skill spec template)${reset}`);

// Copy specs
const specsSrc = path.join(src, 'specs');
const specsDest = path.join(smDest, 'specs');
copyDir(specsSrc, specsDest);
const specCount = countFiles(specsSrc, '.md');
console.log(`  ${green}+${reset} specs/ ${dim}(${specCount} syntax specs)${reset}`);

console.log(`
  ${green}Done!${reset} Open Qwen Code and type ${cyan}/skillsmith${reset} to start.
`);
