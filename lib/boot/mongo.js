
// # boot - mongo

var mongoose = require('mongoose')
var _ = require('underscore')

exports = module.exports = function(logger, settings) {

  var connection

  if (_.isString(settings.mongo.uri)) {
    connection = mongoose.createConnection(settings.mongo.uri, settings.mongo.opts)
  } else {
    connection = mongoose.createConnection(
      settings.mongo.host,
      settings.mongo.dbname,
      settings.mongo.port,
      settings.mongo.opts
    )
  }

  connection.on('error', function(err) {
    logger.error('mongo connection error: %s', err.message || err)
  })

  connection.on('open', function() {
    logger.info('mongo connection opened')
  })

  connection = _.defaults(connection, mongoose)

  return connection

}

exports['@singleton'] = true
exports['@require'] = [ 'igloo/logger', 'igloo/settings' ]
