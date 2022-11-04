const resolve = require('path');
const fs = require('fs/promises');

async function getFiles(dir) {

    const dirres = await fs.readdir(dir, { withFileTypes: true });
    for(let file of dirres) {
      if(file.isFile()) {
        const link = resolve.resolve(dir, file.name);
        fs.stat(link).then((stats) => {
          console.log(file.name + ' - ' +  resolve.extname(file.name).slice(1) + ' - ' +  stats.size/1024 + 'kb');
        })
      }
    }
  }

dir = resolve.resolve(__dirname, 'secret-folder');
getFiles(dir)