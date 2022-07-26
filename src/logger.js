const graylog2 = require('graylog2');

const logger = new graylog2.graylog({
  servers: [{ host: '127.0.0.1', port: 12201 }],
});

logger.on('error', function (error) {
  console.error('Error while trying to write to graylog2:', error);
});

module.exports = { logger };
