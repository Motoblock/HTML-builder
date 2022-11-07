 const path = require('path');
 const fs = require('fs');
 const fsp = require('fs/promises');
 const dirCreate = path.resolve(__dirname, 'project-dist');
 const dirAssets = path.resolve(__dirname, 'assets');
 const dirToCopy = path.join(dirCreate, 'assets');

async function concatHtml() {
  await fsp.rm(dirCreate,{ recursive: true, force: true });
  
  await fsp.mkdir(dirCreate, { recursive: true });
  console.log('Create dir');
  await replaceHtml();
  console.log("Create tamplate");
  await copyAsset(dirAssets, dirToCopy);
  console.log("Copy");
  await concatFilesCss();
  console.log("Create CSS");
}

async function copyAsset(copyDir, copyToDir) {
  await fsp.rm(copyToDir,{ recursive: true, force: true });
  await fsp.mkdir(copyToDir, { recursive: true });
  const files = await fsp.readdir(copyDir, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile()) {
      fsp.copyFile(path.join(copyDir, `${file.name}`), path.join(copyToDir, `${file.name}`));
    } else {
      copyAsset(path.join(copyDir, `${file.name}`), path.join(copyToDir, `${file.name}`));
    }
  }
}

async function concatFilesCss() {
  const style = 'style.css';
  dirSourse = path.resolve(__dirname, 'styles');
  dirOutputFiles = path.resolve(dirCreate, style);
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
  } catch {
    console.log("Don't merge files (");
  }
  writeStream.close();
}

async function replaceHtml() {
  const dirComponents = path.resolve(__dirname, 'components');
  const html = await fsp.readFile(path.resolve(__dirname,'template.html'));
  const components = await fsp.readdir(dirComponents, { withFileTypes: true });
  let htmlContent = html.toString();

  for(let component of components) {
    if (component.isFile() && path.extname(path.resolve(dirComponents, `${component.name}`)) == '.html') {
      let componentName = component.name.slice(0, -5);
      let componentContent = await fsp.readFile(path.resolve(dirComponents, component.name));
      htmlContent = htmlContent.replaceAll(`{{${componentName}}}`,`\n${componentContent}\n`);
    }
  }
  await fsp.writeFile(path.resolve(dirCreate, 'index.html'), htmlContent);
}
concatHtml();
