const { connect } = require('amqplib');

const amqpServer = async () => {
  const conn = await connect('amqp://root:root@rabbitmq:5672');
  const channel = await conn.createChannel();

  const publicInQueue = async (queue, message) => {
    return channel.sendToQueue(queue, Buffer.from(message));
  };

  const publishInExchange = async (exchange, routingKey, message) => {
    return channel.publish(exchange, routingKey, Buffer.from(message));
  };

  const consume = async (queue, callback) => {
    return channel.consume(queue, (message) => {
      callback(message);
      channel.ack(message);
    });
  };

  return { publicInQueue, publishInExchange, consume };
};

module.exports = { amqpServer };
