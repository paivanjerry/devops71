const amqplib = require('amqplib');
const init = async () => {
    const connection = await amqplib.connect("amqp://guest:guest@rabbitmq:5672");
    const channel = await connection.createChannel();
    channel.prefetch(10);;
    const receiveExchange = 'compse140';

    await channel.assertExchange(receiveExchange, 'topic', {durable: true});

    const q = await channel.assertQueue('', {durable: true});
    channel.bindQueue(q.queue, receiveExchange, "compse140.o")
    await channel.consume(q.queue, async (msg) => {
      console.log("Received message, wait for second ", msg.content.toString());
      setTimeout(async () => {
        const sendExchange = 'compse140';
        const routingKey = 'compse140.i';
        const sendChannel = await connection.createChannel();
        await sendChannel.assertExchange(sendExchange, 'topic', {durable: true});
        const sendMsg = "Got_" + msg.content.toString();
        sendChannel.publish(sendExchange, routingKey, Buffer.from(sendMsg));
        console.log('Message resended ', sendMsg);


      }, 1000)
      
    }, 
    {
      noAck: false,
      consumerTag: 'IMED'
    });
    
  }



setTimeout(async () => {await init()}, 1000)

