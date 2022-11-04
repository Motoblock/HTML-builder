 const path = require('path');
 const fs = require('fs');
 const fsp = require('fs/promises');
 const dirCreate = path.resolve(__dirname, 'project-dist');
 const dirAssets = path.resolve(__dirname, 'assets');
 const dirToCopy = path.join(dirCreate, 'assets');

async function concatHtml() {
  await fsp.rm(dirCreate,{ recursive: true, force: true });
  await fsp.mkdir(dirCreate, { recursive: true });
  replaceHtml();
  copyAsset(dirAssets, dirToCopy);

}

async function copyAsset(copyDir, copyToDir) {
  console.log(copyDir);
  await fsp.rm(copyToDir,{ recursive: true, force: true });
  await fsp.mkdir(copyToDir, { recursive: true });
  const files = await fsp.readdir(copyDir, { withFileTypes: true });
  console.log(files)
  for (const file of files) {
    console.log(file)
    if (file.isFile()) {
      fsp.copyFile(path.join(copyDir, `${file.name}`), path.join(copyToDir, `${file.name}`));
    } else {
      copyAsset(path.join(copyDir, `${file.name}`), path.join(copyToDir, `${file.name}`));
    }
  }
}

async function replaceHtml() {
  const dirComponents = path.resolve(__dirname, 'components');
  const readHtmlStream = fs.createReadStream(path.resolve(__dirname,'template.html'), 'utf8');
  const writeHtmlStream = fs.createWriteStream(path.resolve(dirCreate, 'index.html'));

  const components = await fsp.readdir(dirComponents, { withFileTypes: true });

  let htmlContent = '';
  readHtmlStream.on('data', chunk => htmlContent += chunk);
  readHtmlStream.on('end', () => {
    components.forEach(function(component, i) {
      if (component.isFile() && path.extname(path.join(dirComponents, `${component.name}`)) === '.html') {
      const readableStream = fs.createReadStream(path.resolve(dirComponents, component.name), 'utf-8');
      let result = '';
      let componentName = component.name.slice(0, -5);
      let strsNumber = htmlContent.split('\n').find(str => str.includes(`{{${componentName}}}`)).split('{');

      readableStream.on('data', chunk => result += chunk);
      readableStream.on('end', () => {
        result = result.split('\n').join(`\n${strsNumber[0]}`);
        htmlContent = htmlContent.replace(`{{${componentName}}}`, result);
        if (i == components.length - 1 ) {
          writeHtmlStream.write(htmlContent);
        }
      });
    }
    });
    
  });
}
concatHtml();
