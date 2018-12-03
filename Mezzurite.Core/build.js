"use strict";

const shell = require('shelljs');
const chalk = require('chalk');

const PACKAGE_NAME = `mezzurite-core`;
const NPM_DIR = `dist`;
const ESM2015_DIR = `${NPM_DIR}/esm2015`;
const ESM5_DIR = `${NPM_DIR}/esm5`;
const FESM2015_DIR = `${NPM_DIR}/fesm2015`;
const FESM5_DIR = `${NPM_DIR}/fesm5`;
const CJS_DIR = `${NPM_DIR}/cjs`;
const BUNDLES_DIR = `${NPM_DIR}/bundles`;
const OUT_DIR = `${NPM_DIR}/package`;
const OUT_DIR_ESM5 = `${NPM_DIR}/package/esm5`;

shell.echo(`Start building...`);

shell.rm(`-Rf`, `${NPM_DIR}/*`);
shell.mkdir(`-p`, `./${ESM2015_DIR}`);
shell.mkdir(`-p`, `./${ESM5_DIR}`);
shell.mkdir(`-p`, `./${FESM2015_DIR}`);
shell.mkdir(`-p`, `./${FESM5_DIR}`);
shell.mkdir(`-p`, `./${BUNDLES_DIR}`);
shell.mkdir(`-p`, `./${OUT_DIR}`);

/* TSLint with Codelyzer */
// https://github.com/palantir/tslint/blob/master/src/configs/recommended.ts
// https://github.com/mgechev/codelyzer
shell.echo(`Start TSLint`);
shell.exec(`tslint -p tsconfig.json -t stylish src/**/*.ts`);
shell.echo(chalk.green(`TSLint completed`));

shell.echo(`Start unit tests`);
shell.exec(`jest --verbose`);
shell.echo(chalk.green(`Unit tests completed`));

shell.cp(`-Rf`, [`src`, `*.ts`, `*.json`], `${OUT_DIR}`);

/* AoT compilation */
shell.echo(`Start AoT compilation`);
if (shell.exec(`ngc -p ${OUT_DIR}/tsconfig-build.json`).code !== 0) {
    shell.echo(chalk.red(`Error: AoT compilation failed`));
    shell.exit(1);
}
shell.echo(chalk.green(`AoT compilation completed`));

shell.echo(`Copy ES2015 for package`);
shell.cp(`-Rf`, [`${NPM_DIR}/src/`, `${NPM_DIR}/*.js`, `${NPM_DIR}/*.js.map`], `${ESM2015_DIR}`);

/* BUNDLING PACKAGE */
shell.echo(`Start bundling`);
shell.echo(`Rollup package`);
if (shell.exec(`rollup -c rollup.es.config.js -i ${NPM_DIR}/${PACKAGE_NAME}.js -o ${FESM2015_DIR}/${PACKAGE_NAME}.js`).code !== 0) {
    shell.echo(chalk.red(`Error: Rollup package failed`));
    shell.exit(1);
}

shell.echo(`Produce ESM5/FESM5 versions`);
shell.exec(`ngc -p ${OUT_DIR}/tsconfig-build.json --target es5 -d false --outDir ${OUT_DIR_ESM5} --sourceMap`);
shell.cp(`-Rf`, [`${OUT_DIR_ESM5}/src/`, `${OUT_DIR_ESM5}/*.js`, `${OUT_DIR_ESM5}/*.js.map`], `${ESM5_DIR}`);
if (shell.exec(`rollup -c rollup.es.config.js -i ${OUT_DIR_ESM5}/${PACKAGE_NAME}.js -o ${FESM5_DIR}/${PACKAGE_NAME}.js`).code !== 0) {
    shell.echo(chalk.red(`Error: FESM5 version failed`));
    shell.exit(1);
}

shell.echo(`Produce CJS version`);
if (shell.exec(`rollup -c rollup.cjs.config.js -i ${OUT_DIR_ESM5}/${PACKAGE_NAME}.js -o ${CJS_DIR}/${PACKAGE_NAME}.js`).code !== 0) {
    shell.echo(chalk.red(`Error: CJS version failed`));
    shell.exit(1);
}

shell.echo(`Run Rollup conversion on package`);
if (shell.exec(`rollup -c rollup.config.js -i ${FESM5_DIR}/${PACKAGE_NAME}.js -o ${BUNDLES_DIR}/${PACKAGE_NAME}.umd.js`).code !== 0) {
    shell.echo(chalk.red(`Error: Rollup conversion failed`));
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
shell.rm(`-Rf`, `${ESM2015_DIR}/src/**/*.d.ts`);

shell.cp(`-Rf`, [`package.json`, `../LICENSE`, `README.md`], `${NPM_DIR}`);

shell.sed('-i', `"private": true,`, `"private": false,`, `./${NPM_DIR}/package.json`);

shell.echo(chalk.green(`End building`));