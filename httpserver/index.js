const http = require("http")
const fs = require('fs')

http.createServer(function (req, res) {
  let resStr = "Response from http server"
  try {
    const data = fs.readFileSync('../../appdata/thefile.txt', 'utf8');
    console.log(data);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write(data);
    res.end();
  } catch (err) {
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.write("Error");
    res.end();
  }

 }).listen(8080);
 console.log("Listening on port 8080");