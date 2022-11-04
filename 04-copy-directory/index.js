const path = require('path');
const fs = require('fs/promises');

async function copyFiles() {
  dirToCopy = path.resolve(__dirname, 'files-copy');
  dirCopy = path.resolve(__dirname, 'files');
  await fs.rm(dirToCopy,{ recursive: true, force: true });
  await fs.mkdir(dirToCopy, { recursive: true })
  console.log('Create directory ' + dirToCopy);

  const files = await fs.readdir(dirCopy);

  //console.log(files);
  try {
    for(let file of files) {
      dirCopyOut = path.resolve(dirCopy, file);
      dirCopyTo = path.resolve(dirToCopy, file);
      await fs.copyFile(dirCopyOut, dirCopyTo);
      console.log('Copy file: ' + file);
    }
  } catch {
      console.log('The file could not be copied');
  }
}

copyFiles();