const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;

const logger = createLogger({
    defaultMeta: { service: 'user-service' },
    format: combine(
        timestamp(),
        prettyPrint()
    ),
    transports: [
    new transports.Console(),
    new transports.File({ filename: 'info.log', level: 'info' }),
    new transports.File({ filename: 'error.log', level: 'error' })
  ]
});

module.exports = logger;