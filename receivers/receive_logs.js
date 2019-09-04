const amqp = require('amqplib');

async function main() {
  let connection;

  try {
      connection = await amqp.connect('amqp://localhost');
      const channel = await connection.createChannel();
      const exchange = 'logs';

      await channel.assertExchange(exchange, 'fanout', { durable: false });
      const q = await channel.assertQueue('', { exclusive: true });

      console.log(`[*] Waiting for messages. To exit press CTRL+C`);
      channel.bindQueue(q.queue, exchange, '');
      channel.consume(q.queue, (msg) => {
          if (msg.content) {
            console.log(`[x] ${msg.content.toString()}`);
          }
      }, { noAck: true });
  } catch (error) {
      console.log('Error trying to connect to Rabbit server');
      console.error(error)
  }
  // console.log('Program [receive.js] finished');
}

main()