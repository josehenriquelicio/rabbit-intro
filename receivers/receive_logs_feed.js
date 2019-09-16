const amqp = require('amqplib');
const config = require('../config');
const { host, port, default_queue } = config.rabbit;

const baseName = "b2w_product";
const actions = ["insert", "update", "delete"];
const brands = ["ACOM", "SUBA", "SHOP"]
let queues = ["productFeed"];

let attempts = 11;

for (const action of actions) {
    for (const brand of brands) {
        queues.push(baseName + "_" + action + "-" + brand);
    }
}

async function main() {
    let connection;
  
    try {
        connection = await amqp.connect(`amqp://${host}:${port}`);
        const channel = await connection.createChannel();
  
        for(const queue of queues) {
          const q = await channel.assertQueue(queue, { exclusive: true });
          console.log(`Queue ${q.queue} asserted`);
          channel.consume(q.queue, (msg) => {
              if (msg.content) {
                  console.log(` ---------- ${q.queue}: ---------- \n[x] ${msg.content.toString()}`);
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
    // console.log('Program [receive_logs_feed.js] finished');
  }
  
  main();