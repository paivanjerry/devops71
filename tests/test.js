const axios = require('axios').default;
//import axios from 'axios';

let runs = 0
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const testMessagesRoute = async () => {
  console.log("Test 1: get messages");
    try{
      let res = await axios.get("http://httpserver:8083/messages")
      if(res.status !== 200){
        console.log("ERROR, STATUS NOT OK");
      }
      else if(res.headers['content-type'] !== "text/plain"){
        console.log("ERROR, CONTENT NOT TEXT/PLAIN");
      }
      console.log("Test 1 succeeded, data:", res.data);
      return true
    }
    catch(e){
      console.log("ERROR", e);
    }
    return false
}

const init = async () => {
    let failedTestAmount = 0
    console.log("Starting to run the tests")
    if(!(await testMessagesRoute())){
      failedTestAmount += 1
    }
    

    if(failedTestAmount){
      throw Error(failedTestAmount + " test failed")
    }
    else{
      console.log("All tests succeeded");
    }

  }



setTimeout( async () => { await init() }, 15000 )
