const http = require("http")
const axios = require('axios').default;

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
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write('get the state'); 
      res.end();
      return
    } 
    else if(url === '/state' && req.method === 'PUT'){
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write('put the state'); 
      res.end();
      return
    } 
    else if(url === '/run-log'){
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write('something to run-log'); 
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