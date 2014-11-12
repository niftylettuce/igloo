
// # knox client

var _ = require('underscore');
var util = require('util');
var knox = require('knox');

exports = module.exports = function(settings) {

  if (!_.isObject(settings.knox))
    throw new Error('Settings did not have a `knox` object');

  // bucket, key, and secret
  _.each(['bucket', 'key', 'secret'], function(str) {
    if (!_.isString(settings.knox[str]))
      throw new Error(util.format('Settings did not have a `settings.knox.%s` string', str));
  });

  return knox.createClient(settings.knox);

};

exports['@singleton'] = true;
exports['@require'] = [ 'igloo/settings' ];
