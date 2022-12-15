const amqplib = require('amqplib');
const fs = require('fs')


let runs = 0
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const init = async () => {
  const connection = await amqplib.connect("amqp://guest:guest@rabbitmq:5672");
  const channel = await connection.createChannel();
  // RabbitMQ ok, sleep 5 sec to allow others to listen first
  if(runs == 0){
    console.log("ORIG SLEEP 5");
    await sleep(5000)
    console.log("ORIG SLEPT");
    const stateFilePath = '../../appdata/thestate.txt'
    let dateStr = (new Date()).toISOString()
    console.log("ORIG APPENDING");

    fs.appendFileSync(stateFilePath, "\n" + dateStr + " " + "RUNNING" );
    console.log("ORIG APPENDED");

  }
  // TODO READ FILE SYNC AND IF ITS NOT RUNNING, CALL THIS FUNC WITH DELAY AND RETURN CURRENT EXEC 
  const data = fs.readFileSync('../../appdata/thestate.txt', 'utf8');
  let splitted = data.split("\n")
  if(!splitted[splitted.length -1].includes("RUNNING")){
    console.log("System not running-state, no messages will be sent");
    setTimeout(async () => {await init()}, 3000)
    return
  }

  try {
    runs += 1
    const exchange = 'compse140';
    const routingKey = 'compse140.o';

    await channel.assertExchange(exchange, 'topic', {durable: true});
    const msg = "MSG_" + runs;
    channel.publish(exchange, routingKey, Buffer.from(msg));
    console.log('Message published', msg);
    
  } catch(e) {
    console.error('Error while publishing', e);
  } finally {
    await channel.close();
    await connection.close();
    console.log('Connection closed');
  }
  
  setTimeout(async () => {await init()}, 3000)

  
}



setTimeout( async () => { await init() }, 1000 )
