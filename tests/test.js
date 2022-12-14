const axios = require('axios').default;
//import axios from 'axios';

let runs = 0
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const testMessagesRoute = async () => {
  console.log("Test 1: get messages");
    try{
      let res = await axios.get("http://apigateway:8083/messages")
      if(res.status !== 200){
        console.log("ERROR, STATUS NOT OK");
      }
      else if(res.headers['content-type'] !== "text/plain"){
        console.log("ERROR, CONTENT NOT TEXT/PLAIN");
      }
      else{
        console.log("Test 1 succeeded, data:", res.data);
        return true
      }
      
    }
    catch(e){
      console.log("ERROR", e);
    }
    return false
}

const testGetStateRoute = async (expectedStatus) => {
  console.log("Test 1: get state");
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
        console.log("Test 2 succeeded, data:", res.data);
        return true
      }
    }
    catch(e){
      console.log("ERROR", e);
    }
    return false
}

const testPutStateRoute = async (newState) => {
  console.log("Test 1: put state");
    try{
      let res = await axios.put("http://apigateway:8083/state",{ newState})
      if(res.status !== 200){
        console.log("ERROR, STATUS NOT OK");
      }
      else{
        console.log("Put state succeeded, data:", res.data);
        return true
      }
    }
    catch(e){
      console.log("ERROR", e);
    }
    return false
}


const testGetRunLog = async (expectedWords) => {
  console.log("Test 1: get messages");
    try{
      let res = await axios.get("http://apigateway:8083/state")
      if(res.status !== 200){
        console.log("ERROR, STATUS NOT OK");
        return false
      }
      else if(res.headers['content-type'] !== "text/plain"){
        console.log("ERROR, CONTENT NOT TEXT/PLAIN");
        return false
      }
      for(let word of  expectedWords){
        if(!res.data.includes(word)){
          console.logg("State", word, "not included in run log:",res.data)
          return false
        }
      }

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
    if(!(await testGetStateRoute("RUNNING"))){
      failedTestAmount += 1
    }
    if(!(await testPutStateRoute("PAUSED"))){
      failedTestAmount += 1
    }
    if(!(await testGetStateRoute("PAUSED"))){
      failedTestAmount += 1
    }
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



setTimeout( async () => { await init() }, 15000 )
