const http = require("http")
const fs = require('fs')

let dateStr = (new Date()).toISOString()
const stateFilePath = '../../appdata/thestate.txt'
fs.closeSync(fs.openSync(stateFilePath, 'w'))
fs.writeFileSync(stateFilePath, dateStr + " INIT");
console.log("State INIT");

http.createServer(function (req, res) {
  try {
    const url = req.url
    
    if(url === "/messages"){
      const data = fs.readFileSync('../../appdata/thefile.txt', 'utf8');
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write(data);
      res.end();
      return
    }
    
  } catch (err) {
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.write("Error");
    res.end();
  }

 }).listen(8080);
 console.log("HTTPSERV Listening on port 8080");