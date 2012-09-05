
//     Twitter Bootstrap jQuery Plugins - Modal Responsive Fix
//     Copyright (c) 2012 Nick Baugh <niftylettuce@gmail.com>
//     MIT Licensed
//     v0.0.3

// * Author: [@niftylettuce](https://twitter.com/#!/niftylettuce)
// * Source: <https://github.com/niftylettuce/twitter-bootstrap-jquery-plugins>

// # modal-responsive-fix

(function($) {

  $.fn.modalResponsiveFix = function(opts) {

    // set default options
    opts            = opts            || {}
    opts.spacing    = opts.spacing    || 10
    opts.fullscreen = opts.fullscreen || false
    opts.override   = opts.override   || false
    opts.debug      = opts.debug      || false
    opts.event      = opts.event      || 'show'

    // loop through given modals
    var $modals = $(this)
    $modals.each(loop)

    function loop() {
      var $that = $(this)

      //
      // we have to delay because modal isn't shown yet
      //  and we're trying to prevent double scrollbar
      //  on phones and tables (see below)
      //
      // if we didn't delay, then we wouldn't get proper
      //  values for $header/$body/$footer outerHeight's
      //
      $that.on(opts.event, function() {
        setTimeout(adjust($that), 1)
      })

      // when we scroll down we want it stick on mobile
      $(window).scroll(adjust($that))

      // when we resize we want it to adjust accordingly
      //  (this adds support for orientation change too)
      $(window).resize(adjust($that))
    }

    function adjust($el) {

      return function(ev) {

        if (typeof ev !== 'undefined')
          ev.preventDefault()

        // set the window once
        var $w = $(window)

        // set basic data like width and height
        var data = {
            width     : $w.width()
          , height    : $w.height()
          , scrollTop : $w.scrollTop()
        }

        // set max height using data.height
        data.maxHeight = data.height - (opts.spacing * 2)

        // adjust max height for tablets
        if (data.width > 480 && data.width <= 767)
          data.maxHeight = data.maxHeight - 20

        var $modal  = $el || $(this)
          , $header = $modal.find('.modal-header')
          , $body   = $modal.find('.modal-body')
          , $footer = $modal.find('.modal-footer')

        var modal = {
            width  : $modal.width()
          , height : $modal.height()
        }

        // detect if we're in full screen mode
        var hasFullscreen = $modal.hasClass('modal-fullscreen')

        // set default fullscreen option
        if (!opts.override && (opts.fullscreen || hasFullscreen))
          opts.fullscreen = true

        // prevent the modal from overflowing on phones and tablets
        if (!opts.fullscreen) {

          if (data.width <= 767 && modal.height >= data.maxHeight) {
            $modal.css({ maxHeight: data.maxHeight })
          } else {
            $modal.css({ maxHeight: 'none' })
          }

          // prevent double scrollbar on phones and tablets
          if (data.width <= 767) {
            // take data.maxHeight and subtract the height footer/header/body padding
            var difference = data.maxHeight
            difference = difference - $header.outerHeight(true)
            difference = difference - $footer.outerHeight(true)
            difference = difference - ($body.outerHeight(true) - $body.height())
            if (difference > 400) difference = 400
            $body.css('max-height', difference)
          } else if (!opts.fullscreen) {
            $body.css('max-height', 400)
          }

        }

        if (data.width <= 767) {

          // ## phone and tablet support
          if (opts.fullscreen) {
            if (modal.height >= data.height)
              modal.top = data.scrollTop
            else
              modal.top = data.scrollTop + (data.height - modal.height) / 2
          } else if (modal.height >= data.maxHeight) {
            modal.top = data.scrollTop + opts.spacing
          } else {
            modal.top = data.scrollTop + (data.height - modal.height) / 2
          }
          $modal.css({ position: 'absolute', top: modal.top, marginLeft: 0, marginTop: 0 })

        } else {

          // ## desktop support
          $modal.css({
              position: 'fixed'
            , top: '50%'
          })
          if (opts.fullscreen) {
            $modal.css({
                marginTop  : -($modal.outerHeight() / 2)
              , marginLeft : -($modal.outerWidth() / 2)
            })
          }

        }

        // ## debug info
        if (opts.debug) {
          var output = {
              options : opts
            , data    : data
            , modal   : modal
          }
          console.log('modalResponsiveFix', output)
        }

      }
    }
  }
})(jQuery)
