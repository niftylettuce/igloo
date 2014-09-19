
// # boot - email

var nodemailer = require('nodemailer')
var emailTemplates = require('email-templates')
var _ = require('underscore')

exports = module.exports = function(settings) {

  // check to make sure we defined a default email object
  if (!_.isObject(settings.email))
    throw new Error('Settings did not have an `email` object')

  // check to make sure settings.email.templates is defined
  if (!_.isObject(settings.email.templates))
    throw new Error('Settings did not have a `settings.email.templates` object')

  // check to make sure settings.email.templates.dir is defined
  if (!_.isString(settings.email.templates.dir))
    throw new Error('Settings did not have a `settings.email.templates.dir` string')

  var templateName, locals, headers, callback, transporter

  function renderTemplate(_templateName, _locals, _headers, transport, _callback) {

    templateName = _templateName
    locals = _locals
    headers = _headers
    callback = _callback

    // add ability to override default transport defined in settings
    if (_.isFunction(transport)) {

      // check to make sure we defined a default transport object
      if (!_.isObject(settings.email.transport))
        throw new Error('Settings did not have an `email.transport` object')

      callback = transport

      //
      // if the transport defined in settings is an actual transport
      // (as opposed to just a config object) then we need to use that
      // instead of creating a transport - to do so we'll look for the
      // `.transporter` property that gets added to all transport objects
      // <https://github.com/andris9/Nodemailer/blob/master/src/nodemailer.js#L39>
      //
      // the reason we have this support added is in case users add plugins to
      // their transporter, for example the `nodemailer-html-to-text` plugin
      // <https://github.com/andris9/nodemailer-html-to-text>
      //
      if (_.has(settings.email.transport, 'transporter'))
        transporter = settings.email.transport
      else
        transporter = nodemailer.createTransport(settings.email.transport)

    } else {
      transporter = nodemailer.createTransport(transport)
    }

    if (_.isObject(settings.email.templates.options))
      return emailTemplates(settings.email.templates.dir, settings.email.templates.options, createTemplate)

    emailTemplates(settings.email.templates.dir, createTemplate)

  }

  function createTemplate(err, template) {
    if (err) throw err
    template(templateName, locals, createEmail(headers))
  }

  function createEmail(headers) {
    return function(err, html, text) {
      if (err) return callback(err)
      // if we defined a default headers object, then inherit it here
      // but only if we didn't set `useDefaults` to false in the headers
      if (_.isObject(settings.email.headers) && !headers.useDefaults)
        headers = _.defaults(headers, settings.email.headers)
      if (_.isString(html))
        headers.html = html
      if (_.isString(text))
        headers.text = text
      transporter.sendMail(headers, callback)
    }
  }

  return renderTemplate

}

exports['@singleton'] = true
exports['@require'] = [ 'igloo/settings' ]
