const http = require("http")
const axios = require('axios').default;
const fs = require('fs')

http.createServer( async function (req, res) {
  const url = req.url
  try {
    
    if(url === '/messages'){
      let axiosRes = await axios.get("http://httpserver:8080")
      console.log("API GAY TAY WAY DATA", axiosRes.data);
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write(axiosRes.data); 
      res.end();
      return
    } 
    else if(url === '/state' && req.method === 'GET'){
      const data = fs.readFileSync('../../appdata/thestate.txt', 'utf8');
      let splitted = data.split("\n")
      let lastLine = splitted[splitted.length -1]
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write(lastLine.split(" ")[1]);
      res.end();
      return
    } 
    else if(url === '/state' && req.method === 'PUT'){
      
      const stateFilePath = '../../appdata/thestate.txt'
      let dateStr = (new Date()).toISOString()
      let body = "";
      req.on('error', (err) => {
      }).on('data', (chunk) => {
        body += chunk;
      }).on('end', () => {
        //body = Buffer.concat(body).toString();
        // At this point, we have the headers, method, url and body, and can now
        // do whatever we need to in order to respond to this request.
        fs.appendFileSync(stateFilePath, "\n" + dateStr + " " + body );
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write('OK');
        res.end();
        
      });
      return
    } 
    else if(url === '/run-log'){
      const data = fs.readFileSync('../../appdata/thestate.txt', 'utf8');
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write(data);
      res.end();
      return
    } 
    else{
      res.writeHead(500, {'Content-Type': 'text/plain'})
      res.write('Not implemented'); //write a response
      res.end();
      return
    }

  } catch (err) {
    res.write("Error", err);
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end();
    return
  }

 }).listen(8083);
 console.log("Listening on port 8083");