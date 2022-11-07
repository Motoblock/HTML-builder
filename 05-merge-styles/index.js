const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');

async function concatFiles() {
  const bundel = 'bundle.css';
  dirSourse = path.resolve(__dirname, 'styles');
  dirOutput = path.resolve(__dirname, 'project-dist');

  await fsp.rm(dirOutput,{ recursive: true, force: true });
  await fsp.mkdir(dirOutput, { recursive: true });

  dirOutputFiles = path.resolve(dirOutput, bundel);
  const writeStream = fs.createWriteStream(dirOutputFiles, { encoding: "utf-8" });

  const files = await fsp.readdir(dirSourse, { withFileTypes: true });

  try {
    for(let file of files) {
      if(file.isFile() && path.extname(file.name) == '.css') {
        filesSourse = path.resolve(dirSourse, file.name);
        const contentFiles = await fsp.readFile(filesSourse, { encoding: "utf-8" });
        writeStream.write(contentFiles + '\n');
      }
    }
    console.log("Merging files was successful!");
  } catch {
    console.log("Don't merge files (");
  }
  writeStream.close();
}
concatFiles();