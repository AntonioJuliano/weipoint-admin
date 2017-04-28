const dotenv = require('dotenv');
dotenv.load();

const express = require('express');
const app = express();
const port = process.env.PORT;
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const errors = require('./helpers/errors');
const logger = require('./helpers/logger');
const path = require('path');
const errorHandler = require('./helpers/errorHandler');

process.on('unhandledRejection', (reason, p) => {
  logger.error({
    at: 'errorHandler#unhandledRejection',
    message: 'Unhandled Promise Rejection',
    promise: p,
    error: reason
  });
});

app.get('/health', function(req, res) {
  res.status(200);
});

app.use(function(req, res, next) {
  if(process.env.NODE_ENV === 'production'
    && !req.secure
    && req.get('X-Forwarded-Proto') !== 'https') {
    res.redirect('https://' + req.get('Host') + req.url);
  } else {
    return next();
  }
});

app.use(bodyParser.json());
app.use(function(error, request, response, _next) {
  response.status(400).json({
    error: 'Invalid Request',
    errorCode: errors.errorCodes.invalidArguments
  });
});

app.use(expressValidator({
  customValidators: {
    isArray: value => Array.isArray(value),
    isArrayOfStrings: value => {
      return Array.isArray(value)
        && value.every(v => typeof v === 'string');
    },
    isString: value => typeof value === 'string',
    isBoolean: value => typeof value === 'boolean',
    optionalPositiveInteger: v => !v || (Number.isInteger(parseInt(v)) && v >= 0)
  }
}));

app.use(require('./middlewares/requestLogger'));

app.use('/api/v1', require('./controllers/index'));

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Error handler
app.use((error, request, response, _next) => {
  errorHandler.handle(error, response);
});

app.use(function(req, res) {
  res.status(404).json({
    error: "Not Found",
    errorCode: errors.errorCodes.notFound
  });
});

app.listen(port, (error) => {
  if (error) {
    logger.error({
      at: 'server#start',
      message: 'Server failed to start',
      error: error
    });
  } else {
    logger.info({
      at: 'server#start',
      message: `server is listening on ${port}`
    });
  }
});
