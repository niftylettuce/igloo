
// # boot - logger

var _ = require('underscore')
var mergeDefaults = require('merge-defaults')
var winston = require('winston')
var winstonMongoDB = require('winston-mongodb')
var winstonHipchat = require('winston-hipchat')
var slackWinston = require('slack-winston')

exports = module.exports = function(settings) {

  if (!_.isObject(settings.logger))
    throw new Error('Settings did not have a `logger` object')

  if (!_.isObject(settings.output))
    throw new Error('Settings did not have a `output` object')

  var transports = []

  if (settings.logger['console'])
    transports.push(
      new winston.transports.Console(
        settings.output
      )
    )

  if (settings.logger.mongo)
    transports.push(
      new winstonMongoDB.MongoDB(
        mergeDefaults(
          settings.output,
          settings.mongo
        )
      )
    )

  if (settings.logger.file)
    transports.push(
      new winston.transports.File(
        mergeDefaults(
          settings.output,
          settings.logger.file
        )
      )
    )

  if (settings.logger.hipchat)
    transports.push(
      new winstonHipchat.Hipchat(settings.hipchat)
    )

  if (settings.logger.slack)
    transports.push(
      new slackWinston.Slack(settings.slack)
    )

  var logger = new winston.Logger({
    transports: transports
  })

  if (settings.server.env === 'development')
    logger = expandErrors(logger)

  return logger

  // Extend a winston by making it expand errors when passed in as the
  // second argument (the first argument is the log level).
  // <https://gist.github.com/johndgiese/59bd96360ce411042294>
  // <https://gist.github.com/getvega/6211610>
  function expandErrors(logger) {
    var oldLogFunc = logger.log
    logger.log = function() {
      var args = Array.prototype.slice.call(arguments, 0)
      if (args.length >= 2 && args[1] instanceof Error) {
        args[1] = args[1].stack
      }
      return oldLogFunc.apply(this, args)
    };
    return logger
  }


}

exports['@singleton'] = true
exports['@require'] = [ 'igloo/settings' ]
