const amqp = require('amqplib');
const config = require('../config');
const { host, port, default_exchange } = config.rabbit;

const main_topic = 'app';
const topics = ['update', 'insert', 'delete'];

let attempts = 11;

async function main() {
  let connection;

  try {
      connection = await amqp.connect(`amqp://${host}:${port}`);
      const channel = await connection.createChannel();
      const exchange = default_exchange;

      await channel.assertExchange(exchange, 'topic', { durable: true });

      for(const topic in topics) {
        const q = await channel.assertQueue(topic, { exclusive: true });
        console.log(`Queue ${q.queue} created`);
        await channel.bindQueue(q.queue, exchange, `${main_topic}.${topic}`).then(res => console.log(`Queue ${q.queue} bound to "${main_topic}.${topic}"`));
        channel.consume(q.queue, (msg) => {
            if (msg.content) {
                console.log(` ---------- ${msg.fields.routingKey}: ---------- \n[x] ${msg.content.toString()}`);
            }
          }, { noAck: true });  
      }
      console.log(`[*] Waiting for messages. To exit press CTRL+C`);
  } catch (error) {
      console.log('Error trying to connect to Rabbit server');
        if (attempts) {
            attempts--;
            setTimeout(main, 2000);
        } else {
            console.error('Max number of attempts exceeded. Exiting.');
        }
      console.error(error)
  }
  // console.log('Program [receive_logs_direct.js] finished');
}

main();