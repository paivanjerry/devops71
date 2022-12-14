const axios = require('axios').default;
//import axios from 'axios';

let runs = 0
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let testMode = process.env.TESTMODE
console.log("Test container arg first " + testMode);
console.log("Test container arg second", testMode === "1");

//--build-arg TESTMODE=1

const testMessagesRoute = async () => {
    try{
      let res = await axios.get("http://apigateway:8083/messages")
      if(res.status !== 200){
        console.log("ERROR, STATUS NOT OK");
      }
      else if(res.headers['content-type'] !== "text/plain"){
        console.log("ERROR, CONTENT NOT TEXT/PLAIN");
      }
      else{
        console.log("testMessagesRoute succeeded, data:", res.data);
        return true
      }
      
    }
    catch(e){
      console.log("ERROR", e);
    }
    return false
}

const testGetStateRoute = async (expectedStatus) => {
    try{
      let res = await axios.get("http://apigateway:8083/state")
      if(res.status !== 200){
        console.log("ERROR, STATUS NOT OK");
      }
      else if(res.headers['content-type'] !== "text/plain"){
        console.log("ERROR, CONTENT NOT TEXT/PLAIN");
      }
      else if(res.data !== expectedStatus){
        console.log("Wrong state, expected", expectedStatus, "got", res.data)
      }
      else{
        console.log("testGetStateRoute succeeded, data:", res.data);
        return true
      }
    }
    catch(e){
      console.log("ERROR", e);
    }
    return false
}

const testPutStateRoute = async (newState) => {
    try{
      let res = await axios.put("http://apigateway:8083/state", newState)
      if(res.status !== 200){
        console.log("ERROR, STATUS NOT OK");
      }
      else{
        console.log("testPutStateRoute succeeded, data:", res.data);
        return true
      }
    }
    catch(e){
      console.log("ERROR", e);
    }
    return false
}


const testGetRunLog = async (expectedWords) => {
  
    try{
      let res = await axios.get("http://apigateway:8083/run-log")
      if(res.status !== 200){
        console.log("ERROR, STATUS NOT OK");
        return false
      }
      else if(res.headers['content-type'] !== "text/plain"){
        console.log("ERROR, CONTENT NOT TEXT/PLAIN");
        return false
      }
      for(let word of expectedWords){
        if(!res.data.includes(word)){
          console.log("State", word, "not included in run log:",res.data)
          return false
        }
      }
      console.log("testGetRunLog succeeded, data:", res.data);

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
    console.log("Test 1: testMessagesRoute");
    if(!(await testMessagesRoute())){
      failedTestAmount += 1
    }
    console.log("Test 2: testGetStateRoute");
    if(!(await testGetStateRoute("RUNNING"))){
      failedTestAmount += 1
    }
    console.log("Test 3: testPutStateRoute");
    if(!(await testPutStateRoute("PAUSED"))){
      failedTestAmount += 1
    }
    console.log("Test 4: testGetStateRoute");
    if(!(await testGetStateRoute("PAUSED"))){
      failedTestAmount += 1
    }
    console.log("Test 5: testGetRunLog");

    if(!(await testGetRunLog(["INIT", "RUNNING", "PAUSED"]))){
      failedTestAmount += 1
    }

    if(failedTestAmount){
      throw Error(failedTestAmount + " test failed")
    }
    else{
      console.log("All tests succeeded");
    }

  }



setTimeout( async () => { await init() }, 25000 )
