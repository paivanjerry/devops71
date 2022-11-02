const amqplib = require('amqplib');
const fs = require('fs')

let messagesReceived = 0

const ensureEmptyFile = () => {
  const filePath = '../../appdata/thefile.txt'
  fs.closeSync(fs.openSync(filePath, 'w'))
  console.log("File emptied");
}
const writeRow = (msg) => {
  let topic = msg.fields.routingKey
  let dateStr = (new Date()).toISOString()
  let strToFile = `${dateStr} ${messagesReceived} ${msg.content.toString()} to ${topic}\n`
  console.log("writed: " + strToFile);
  // 2022-10-01T06:35:01.373Z 2 MSG_1 to compse140.o
  fs.appendFile('../../appdata/thefile.txt', strToFile, function (err) {
    
    if (err) throw err;
    console.log('Appended to file!');
  });
}

const init = async () => {
    console.log("OBSE Inited");
    const connection = await amqplib.connect("amqp://guest:guest@rabbitmq:5672");
    const channel = await connection.createChannel();
    const receiveExchange = 'compse140';
    await channel.assertExchange(receiveExchange, 'topic', {durable: true});
    const q = await channel.assertQueue('', {durable: true});
    channel.bindQueue(q.queue, receiveExchange, "#")


    await channel.consume(q.queue, async (msg) => {
      messagesReceived += 1
      console.log("OBSE Received message ", msg.content.toString());
      writeRow(msg)
    }, 
    {
      noAck: false,
      consumerTag: 'IMED'
    });
    
  }


ensureEmptyFile()

setTimeout(async () => {await init()}, 1000)


