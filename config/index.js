const { RABBITMQ_HOST, RABBITMQ_PORT, RABBITMQ_DEFAULT_QUEUE, RABBITMQ_DEFAULT_EXCHANGE } = process.env;

const config = {
    rabbit: {
        host: RABBITMQ_HOST || 'rabbit',
        port: RABBITMQ_PORT || '5672',
        default_queue: RABBITMQ_DEFAULT_QUEUE || 'test',
        default_exchange: RABBITMQ_DEFAULT_EXCHANGE || 'test'
    }
};

module.exports = config;