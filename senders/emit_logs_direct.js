var amqp = require('amqplib');

async function main() {
  let connection;

  try {
      connection = await amqp.connect('amqp://localhost');
      const channel = await connection.createChannel();
      const exchange = 'direct_logs';

      await channel.assertExchange(exchange, 'direct', { durable: false });
      const msg = process.argv.slice(3).join(' ') || 'Hello World!';
      let level = process.argv[2] || 'info';
      channel.publish(exchange, level, Buffer.from(msg));
      console.log(` [x] Sent: [${msg}] with level ${level}`);
  } catch (error) {
      console.log('Error trying to connect to Rabbit server');
      console.error(error)
  } finally {
    if(connection) {
        await new Promise((res, rej) => setTimeout(async () => {
            await connection.close();
            res();
        }, 500));
        console.log('Program [emit_logs_direct.js] finished');
    }
  }
}

main();