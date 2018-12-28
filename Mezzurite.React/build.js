"use strict";

const shell = require('shelljs');
const chalk = require('chalk');

const PACKAGE_NAME = `mezzurite-react`;
const NPM_DIR = `dist`;
const ESM2015_DIR = `${NPM_DIR}/esm2015`;
const ESM5_DIR = `${NPM_DIR}/esm5`;
const FESM2015_DIR = `${NPM_DIR}/fesm2015`;
const FESM5_DIR = `${NPM_DIR}/fesm5`;
const BUNDLES_DIR = `${NPM_DIR}/bundles`;
const OUT_DIR = `${NPM_DIR}/package`;
const OUT_DIR_ESM5 = `${NPM_DIR}/package/esm5`;
const TYPES_DIR = `${NPM_DIR}/types`;

shell.echo(`Start building...`);

shell.rm(`-Rf`, `${NPM_DIR}/*`);
shell.mkdir(`-p`, `./${BUNDLES_DIR}`);
shell.mkdir(`-p`, `./${OUT_DIR}`);

/* TSLint with Codelyzer */
// https://github.com/palantir/tslint/blob/master/src/configs/recommended.ts
// https://github.com/mgechev/codelyzer
shell.echo(`Start TSLint`);
shell.exec(`tslint -p tsconfig.json -t stylish src/**/*.ts`);
shell.echo(chalk.green(`TSLint completed`));

shell.cp(`-Rf`, [`src`, `*.js`, `*.json`], `${OUT_DIR}`);

/* BUNDLING PACKAGE */
shell.echo(`Start bundling`);
shell.echo(`Rollup package`);
if (shell.exec(`rollup -c`).code !== 0) {
    shell.echo(chalk.red(`Error: Rollup package failed`));
    shell.exit(1);
}

shell.echo(`Minifying`);
shell.cd(`${BUNDLES_DIR}`);
if (shell.exec(`uglifyjs ${PACKAGE_NAME}.umd.js -c --comments -o ${PACKAGE_NAME}.umd.min.js --source-map "includeSources=true,content='${PACKAGE_NAME}.umd.js.map',filename='${PACKAGE_NAME}.umd.min.js.map'"`).code !== 0) {
    shell.echo(chalk.red(`Error: Minifying failed`));
    shell.exit(1);
}
shell.cd(`..`);
shell.cd(`..`);
shell.echo(chalk.green(`Bundling completed`));

shell.rm(`-Rf`, `${NPM_DIR}/package`);
shell.rm(`-Rf`, `${NPM_DIR}/*.js`);
shell.rm(`-Rf`, `${NPM_DIR}/*.js.map`);
shell.rm(`-Rf`, `${NPM_DIR}/src/**/*.js`);
shell.rm(`-Rf`, `${NPM_DIR}/src/**/*.js.map`);

shell.cp(`-Rf`, [`package.json`, `../LICENSE`, `README.md`], `${NPM_DIR}`);
shell.exec(`tsc --p tsconfig.json --outDir "dist/tsc" --declaration true --declarationDir "dist/typings"`);
shell.rm(`-Rf`, `${NPM_DIR}/tsc`);

shell.sed('-i', `"private": true,`, `"private": false,`, `./${NPM_DIR}/package.json`);
shell.echo(chalk.green(`End building`));