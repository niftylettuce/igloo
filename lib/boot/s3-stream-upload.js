
// # Amazon S3 Stream Upload

var mergeDefaults = require('merge-defaults');
var _ = require('underscore');
var util = require('util');
var AWS = require('aws-sdk');
var s3UploadStream = require('s3-upload-stream');

exports = module.exports = function(settings, logger) {

  if (!_.isObject(settings.aws))
    throw new Error('Settings did not have an `aws` object');

  // accessKeyId, secretAccessKey, bucket
  _.each([ 'accessKeyId', 'secretAccessKey', 'bucket' ], function(str) {
    if (!_.isString(settings.aws[str]))
      throw new Error(util.format('Settings did not have a `settings.aws.%s` string', str));
  });

  AWS.config.update(settings.aws);
  AWS.config.update({ logger: logger });

  function setHeaders(headers) {

    if (!_.isObject(headers))
      headers = {};

    headers = mergeDefaults({
      Bucket: settings.aws.bucket
    }, headers);

    var s3Stream = s3UploadStream(new AWS.S3());

    var upload = s3Stream.upload(headers);

    return upload;

  }

  return setHeaders;

};

exports['@singleton'] = true;
exports['@require'] = [ 'igloo/settings', 'igloo/logger' ];
