const amqplib = require('amqplib');


let runs = 0
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const init = async () => {
  const connection = await amqplib.connect("amqp://guest:guest@rabbitmq:5672");
  const channel = await connection.createChannel();
  // RabbitMQ ok, sleep 5 sec to allow others to listen first
  if(runs == 0){
    await sleep(5000)
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
      if(runs < 3){
        setTimeout(async () => {await init()}, 3000)
      }
      else{
        console.log("ORIG's job here is done!")

      }
      
  }



setTimeout( async () => { await init() }, 1000 )
