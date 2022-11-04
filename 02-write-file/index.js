let fs = require('fs');
const path = require('path');
const readline = require('readline');

dir = path.resolve(__dirname, 'text.txt');

fs.open(dir, 'w', (err) => {
    if(err) throw err;
});

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Enter something, please \n> '
});
rl.prompt();

rl.on('line', (input) => {
  if(input !== 'exit') {
    fs.appendFile(dir, input + "\n", (err) => {
        if(err) throw err;
    });
  } else {
    return rl.close();
  }
});

rl.on('SIGINT', () => {
  rl.close();
});

rl.on('close', () => {
  console.log("We'll still write off, bye-bye!");
});

