const amqp = require('amqplib');

async function main() {
    let connection;
    try {
        connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = 'task_queue';
        const msg = process.argv.slice(2).join(' ') || 'Hello, world!';

        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
        console.log(` [o] Sent "${msg}" to ${queue}`);
        
    } catch (error) {
        console.log('Error trying to connect to Rabbit server');
        console.error(error)
    } finally {
        if(connection) {
            await new Promise((res, rej) => setTimeout(async () => {
                await connection.close();
                res();
            }, 500));
        }
    }
    console.log('Program [send.js] finished');
}

main();