const amqp = require('amqplib');

async function main() {
    let connection;
    try {
        connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = 'hello';

        await channel.assertQueue(queue, { durable: false });

        console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);
        channel.consume(queue, (msg) => {
            console.log(`[x] Received ${msg.content.toString()}`);
        }, { noAck: true });
    } catch (error) {
        console.log('Error trying to connect to Rabbit server');
        console.error(error)
    }
    // console.log('Program [receive.js] finished');
}

main();