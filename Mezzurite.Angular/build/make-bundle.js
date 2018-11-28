const { promisify } = require("util")
const fs = require("fs")
const path = require("path")
const uglifyEs = require("uglify-es")
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const readdir = promisify(fs.readdir)
const packageName = "index"
const compiledPath = path.join(__dirname, "compiled")
const typesPath = path.join(__dirname, "..", "aot/src")
const cjsPath = path.join(__dirname, "..", "dist")
const esmPath = path.join(__dirname, "..", "dist-esm")

async function makeDefinitionsCode() {
  let defs = [];
  readdir(typesPath, async function(err, files){
    if( err ) {
      console.error( "Could not list the directory.", err );
      process.exit( 1 );
    } 
    files.forEach(async function(file, index){
      let decFile = processDeclaration(file, (await readFile(path.join(typesPath, file), "utf-8")));
      defs.push(decFile);
      if (index === files.length - 1){
        let returnDefs = defs.join("\n\n");
        await writeFile(path.join(cjsPath, `${packageName}.d.ts`), returnDefs)
        await writeFile(path.join(esmPath, `${packageName}.d.ts`), returnDefs)
      }
    })
  }) 
}
function removeLocalImportsExports(code) {
  let localImportExport = /^\s*(import|export) .* from "\.\/.*"\s*;?\s*$/
  return code.split("\n").filter(line => {
    return !localImportExport.test(line)
  }).join("\n").trim()
}
function removeSemicolons(code) {
  return code.replace(/;/g, "")
}
function processDeclaration(file, code){
  if (file.indexOf(".d.ts") === -1){
    return null;
  }
  var _code = removeLocalImportsExports(code);
  return _code;
}

makeDefinitionsCode().then(() => {
  console.log("done");
})