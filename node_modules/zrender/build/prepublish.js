const fs = require('fs-extra');
const chalk = require('chalk');
const ignore = require('ignore');
const { execSync } = require('node:child_process');

console.log();
console.log(chalk.yellowBright(`⚠️ You should have run ${chalk.bold('`npm run release`')} before running this script!`));
console.log();

// check versions in key dist files

console.log(chalk.yellow('🔎 Checking versions in dist files...'));

const fileVersions = [
    'package.json',
    'package-lock.json',
    'dist/zrender.js',
    'dist/zrender.min.js'
].map(filePath => ({
    file: filePath,
    version: require('../' + filePath).version
}));

['lib/zrender.js', 'src/zrender.ts'].forEach(filePath => {
    const version = fs.readFileSync(filePath, 'utf-8').match(/export (?:var|const) version = '(\S+)'/)[1];
    fileVersions.push({
        file: filePath,
        version: version
    });
});

const versions = fileVersions.map(({ file, version }) => {
    console.log(`  ∟ The version in [${chalk.blueBright(file)}] is ${chalk.cyanBright.bold(version)}`);
    return version;
});

if (new Set(versions).size !== 1) {
    console.log();
    console.error(chalk.red('❌ Version does not match! Please check and rerun the release script via:'));
    console.log();
    console.error(chalk.yellow('     npm run release'));
    console.log();
    process.exit(-1);
}

console.log();
console.log(chalk.green('✔️ Versions are all the same.'));
console.log();

console.log(chalk.yellow('🔎 Checking unexpected files that probably shouldn\'t be published...\n'));

// check if there are unexpected files that not in .npmignore
const npmignore = fs.readFileSync('.npmignore', 'utf-8');
const npmignorePatterns = npmignore
    .split(/\r?\n/)
    .filter(item => item && !item.startsWith('#'));

const untrackedFiles = execSync('git ls-files --others --exclude-standard', { encoding: 'utf-8' })
    .trim()
    .split('\n')
    .map(escapeOctal);

if (untrackedFiles.length) {
    const maybeUnexpectedFiles = ignore().add(npmignorePatterns).filter(untrackedFiles);
    if (maybeUnexpectedFiles.length) {
        console.error(chalk.red(`❌ Found ${maybeUnexpectedFiles.length} file(s) that are neither tracked by git nor ignored by .npmignore! Please double-check before publishing them to npm.`));
        maybeUnexpectedFiles.forEach(filePath => {
            console.log('  ∟ ' + filePath);
        });
        console.log();
        process.exit(-1);
    }
}

console.log(chalk.green('✔️ No unexpected files found.'));
console.log();

function escapeOctal(str) {
    const matches = str.match(/(\\\d{3}){3}/g);
    if (matches) {
        matches.forEach(match => {
            let encoded = '';
            match.split('\\').forEach(code => !code || (encoded += '%' + parseInt(code, 8).toString(16)));
            str = str.replace(match, decodeURI(encoded));
        });
    }
    return str;
}