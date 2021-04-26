console.log("// COMBINER // \n");
const path = require("path");
const data = require("./files.json");
const npm = require("../../package.json");
const fs = require("fs");
let fullFile = "";

const prev = function (txt, size = 300) {
  let s = txt.length;
  return txt.slice(0, size) + "\n[...]\n" + txt.slice(s - size, s - 1);
};
const formatInfos = function() {
  let i = `
  /**
   * ${npm.title.toUpperCase()}
   * 
   * @author ${npm.author}
   * @description ${npm.description}
   * @version ${npm.version}
   * @license ${npm.license}
   * 
   * @see ${npm.homepage}
   * 
   */
  
  `;
  return i
}
fullFile += formatInfos();
console.log("// LOADING SOURCE FILES:");
data.files.forEach((file) => {
  let fileUrl = path.join(__dirname, file)
  let fParts = file.split('/');
  let fileName = fParts[fParts.length-1]
  console.log(fileUrl);
  fullFile += `\n// ${fileName} \n`
  let s = fs.readFileSync(fileUrl, { encoding: "utf-8" });
  fullFile += s;
  fullFile += "\n/* added by combiner */\n";
});

console.log("\nDATA PREV");
console.log(prev(fullFile));
const binDir = path.join(__dirname, "../../bin/");


let nfp = path.join(binDir, `${data.name}.js`);

if (!fs.existsSync(binDir)){
  console.log(`${binDir} not exist create it ...`);
  fs.mkdirSync(binDir);
  console.log('... done');
}
console.log('save source in the new file ...');
fs.writeFile(nfp, fullFile, () => {
  console.log('... done\n');
  console.log("your file is saved to ", nfp);
});


