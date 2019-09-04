const amqp = require('amqplib');

async function main() {
    let connection;
    try {
        connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = 'task_queue';

        await channel.assertQueue(queue, { durable: true });

        console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);
        channel.consume(queue, (msg) => {
            const interval = msg.content.toString().split('.').length - 1;
            console.log(`[x] Received ${msg.content.toString()}`);
            setTimeout(() => {
                console.log('[x] Done');
            }, interval * 1000);
        }, { noAck: true });
    } catch (error) {
        console.log('Error trying to connect to Rabbit server');
        console.error(error)
    }
    // console.log('Program [receive.js] finished');
}

main();