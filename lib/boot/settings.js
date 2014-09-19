
// # boot - settings

var _ = require('underscore')
var util = require('util')
var mergeDefaults = require('merge-defaults')

exports = module.exports = function(IoC, config) {

  var settings = {}

  var env = process.env.NODE_ENV || 'development'

  if (!_.isObject(config[env]))
    throw new Error(util.format('Unknown environment %s', env))

  if (env === 'development') {
    try {
      var local = IoC.create('local')
      if (_.isObject(local))
        mergeDefaults(settings, local)
    } catch(e) {
    }
  }

  mergeDefaults(settings, config[env], config.defaults)

  return settings

}

exports['@singleton'] = true
exports['@require'] = [ '$container', 'config' ]
