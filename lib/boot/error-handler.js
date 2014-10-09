
// # boot - error handler

var mergeDefaults = require('merge-defaults')
var _ = require('underscore')
var _str = require('underscore.string')
_.mixin(_str.exports())
var util = require('util')

exports = module.exports = function(logger, settings) {

  return function(err, req, res, next) {

    // set default error status code
    res.statusCode = (_.isNumber(err.status)) ? err.status : 500

    if (!_.isString(err.message))
      err.message = 'An unknown error has occured, please try again'

    if (_.isObject(err) && _.isNumber(err.code) && err.code === 11000) {
      // <https://github.com/LearnBoost/mongoose/issues/2129>
      var field = err.message.split('index: ')[1].split('.$')[1]
      // now we have `email_1 dup key`
      field = field.split(' dup key')[0]
      field = field.substring(0, field.lastIndexOf('_'))
      err.message = util.format('Duplicate %s already exists in database, try making a more unique value', field)
      err.param = field
    }

    // if we pass an error object, then we want to simply return the message...
    // if we pass an object, then we want to do a stack trace, and then return the object + stack
    var error = {}

    // set error type
    error.type = res.statusCode < 500 ? 'invalid_request_error' : 'api_error'

    if (_.isString(err.param)) {
      error.type = 'invalid_request_error'
      if (res.statusCode === 500)
        res.statusCode = 400
    }

    /*
    error.type = _.isString(err.param) ? 'invalid_request_error' : 'api_error'

    if (error.type === 'invalid_request_error' && res.statusCode === 500)
      res.statusCode = 400
    */

    // set error message and stack trace
    if (util.isError(err)) {
      error.message = err.message
    } else {
      _.extend(error, err)
    }

    // set status code for BadRequestError
    if (_.isString(error.name) && error.name === 'BadRequestError') {
      error.type = 'invalid_request_error'
      res.statusCode = 400
      delete error.name
    }

    if (settings.showStack)
      error.stack = _.isUndefined(err.stack) ? new Error(err.message).stack : err.stack

    // set error level
    var level = (res.statusCode < 500) ? 'warn' : 'error'

    // if we have a mongoose validation err
    // then we know to output all the errors
    if (_.isObject(err.errors) && !_.isEmpty(err.errors)) {
      var messages = []
      _.each(err.errors, function(errMsg) {
        // <https://github.com/syntagma/mongoose-error-helper/blob/master/lib/mongoose-error-helper.js>
        // TODO: add support for enum, min, and max?
        if (_.isString(errMsg.type) && errMsg.type === 'required' && _.isString(errMsg.path)) {
          messages.push(util.format('%s is required', _.humanize(errMsg.path)))
        } else if (_.isString(errMsg.message)) {
          messages.push(errMsg.message)
        }
      })
      if (!_.isEmpty(messages)) {
        error.message = messages.join(', ')
      }
    }

    res.format({
      text: function() {
        res.send(error.message)
      },
      html: function() {
        // set error back to warning if it was warn
        // logger level type = "warn"
        // req.flash messages type = "warning"
        req.flash(level === 'warn' ? 'warning' : level, error.message)
        res.redirect('back')
      },
      json: function() {
        res.json({ error: error })
      }
    })

    if (_.isObject(req.log)) {
      req.log.response_time = new Date().getTime() - req.log.response_time
      req.log.status = res.statusCode
      req.log.response_type = res.get('Content-Type')
      req.log.response_body = error
    } else {
      req.log = error
    }

    logger[level](error.message, req.log)

  }

}

exports['@singleton'] = true
exports['@require'] = [ 'igloo/logger', 'igloo/settings' ]
