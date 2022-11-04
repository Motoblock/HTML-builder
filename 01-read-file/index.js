let fs = require('fs');
const fileStream = fs.createReadStream(__dirname + '/text.txt', 'utf8');
fileStream.on("data", function(chunk){
  console.log(chunk);
});