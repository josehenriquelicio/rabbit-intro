const amqp = require('amqplib');
const config = require('../config');
const { host, port, default_queue } = config.rabbit;
let attempts = 11;

async function main() {
    let connection;
    try {
        connection = await amqp.connect(`amqp://${host}:${port}`);
        const channel = await connection.createChannel();
        const queue = default_queue;

        await channel.assertQueue(queue, { durable: false });

        console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);
        channel.consume(queue, (msg) => {
            console.log(`[x] Received ${msg.content.toString()}`);
        }, { noAck: true });
    } catch (error) {
        console.log('Error trying to connect to Rabbit server');
        console.log(`Server address: \namqp://${host}:${port}`);
        if (attempts) {
            attempts--;
            setTimeout(main, 2000);
        } else {
            console.error('Max number of attempts exceeded. Exiting.');
        }
        console.error(error)
    }
    // console.log('Program [receive.js] finished');
}

main();