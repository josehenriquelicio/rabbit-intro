const amqp = require('amqplib');

const timestamp = () => (new Date()).toISOString();
const stamp = msg => `[${timestamp()}] ${msg}`;
const yellow = msg => `\x1b[33m${msg}\x1b[0m`;
const red = msg => `\x1b[31m${msg}\x1b[0m`;

function logger(fn) {
    return function log(msg) {
        if(msg.content) {
            return fn(msg.content.toString());
        };        
    }
}

const loggers = {
    info: logger(msg => console.log(stamp(msg))),
    warning: logger(msg => console.log(yellow(stamp(msg)))),
    error: logger(msg => console.log(red(stamp(msg))))
};

async function main() {
  let connection;

  try {
      connection = await amqp.connect('amqp://localhost');
      const channel = await connection.createChannel();
      const exchange = 'direct_logs';

      await channel.assertExchange(exchange, 'direct', { durable: false });

      for(const level in loggers) {
        const q = await channel.assertQueue(level, { exclusive: true });
        await channel.bindQueue(q.queue, exchange, level);
        channel.consume(q.queue, loggers[level], { noAck: true });
      }
      console.log(`[*] Waiting for messages. To exit press CTRL+C`);
  } catch (error) {
      console.log('Error trying to connect to Rabbit server');
      console.error(error)
  }
  // console.log('Program [receive_logs_direct.js] finished');
}

main();