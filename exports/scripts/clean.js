const path = require("path");
const fs = require("fs");

const bin = path.join(__dirname, "../../bin/");
if (fs.existsSync(bin)){
  console.log(`${bin} exist, clean it up ...`);
  fs.rmdirSync(bin, {recursive: true});
  console.log('... done');
} else{
  console.log(`${bin} does not yet exist, create it ...`);
  
}
fs.mkdirSync(bin)
console.log('... done');
console.log(`${bin} is clean`);