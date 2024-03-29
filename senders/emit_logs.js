var amqp = require('amqplib');

async function main() {
  let connection;

  try {
      connection = await amqp.connect('amqp://localhost');
      const channel = await connection.createChannel();
      const exchange = 'logs';

      await channel.assertExchange(exchange, 'fanout', { durable: false });
      const msg = process.argv.slice(2).join(' ') || 'Hello World!';
      channel.publish(exchange, '', Buffer.from(msg));
      console.log(` [x] Sent: ${msg}`);
  } catch (error) {
      console.log('Error trying to connect to Rabbit server');
      console.error(error)
  } finally {
    if(connection) {
        await new Promise((res, rej) => setTimeout(async () => {
            await connection.close();
            res();
        }, 500));
        console.log('Program [emit_logs.js] finished');
    }
  }
}

main();