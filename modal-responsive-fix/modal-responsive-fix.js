//     Twitter Bootstrap jQuery Plugins - Modal Responsive Fix
//     Copyright (c) 2012 Nick Baugh <niftylettuce@gmail.com>
//     MIT Licensed
//     v0.0.4

// * Author: [@niftylettuce](https://twitter.com/#!/niftylettuce)
// * Source: <https://github.com/niftylettuce/twitter-bootstrap-jquery-plugins>

// # modal-responsive-fix

;(function($, window) {

  $.fn.modalResponsiveFix = function(opts) {

    // set default options
    opts            = opts            || {}
    opts.spacing    = opts.spacing    || 10
    opts.debug      = opts.debug      || false
    opts.event      = opts.event      || 'show'

    // loop through given modals
    var $modals = $(this)
    $modals.each(loop)

    function loop() {

      var $that = $(this)

      // support for bootstrap-image-gallery
      var gallery    = $that.hasClass('modal-gallery')
        , fullscreen = $that.hasClass('modal-fullscreen')
        , stretch    = $that.hasClass('modal-fullscreen-stretch')

      //
      // we have to delay because modal isn't shown yet
      //  and we're trying to prevent double scrollbar
      //  on phones and tablets (see below)
      //
      // if we didn't delay, then we wouldn't get proper
      //  values for $header/$body/$footer outerHeight's
      //
      $that.on(opts.event, function(ev) {
        setTimeout(adjust($that, gallery, fullscreen, stretch), 1)
        // when we resize we want it to adjust accordingly
        $(window).on('resize.mrf', adjust($that, gallery, fullscreen, stretch))
        if(gallery) $that.on('displayed', adjust($that, gallery, fullscreen, stretch))
      })

      $that.on('hide', function() {
        $(window).off('resize.mrf', gallery, fullscreen, stretch);
      })

    }

    function adjust($el, gallery, fullscreen, stretch) {

      return function(ev) {

        var $modal  = $el || $(this)
          , $header = $modal.find('.modal-header')
          , $body   = $modal.find('.modal-body')
          , $footer = $modal.find('.modal-footer')

        // set the window once
        var $w = $(window)

        // set basic data like width and height
        var data = {
            width  : $w.width()
          , height : $w.height()
        }

        if (gallery && $modal.data().modal._loadImageOptions && typeof ev === 'object' && ev.type === 'resize') {
          var options = $modal.data().modal._loadImageOptions
          if (fullscreen) {
            options.maxWidth = data.width
            options.maxHeight = data.height
            if (stretch) {
              options.minWidth = data.width
              options.minHeight = data.height
            }
          } else {
            options.maxWidth = data.width - $modal.data().modal._loadOptions.offsetWidth
            options.maxHeight = data.height - $modal.data().modal._loadOptions.offsetHeight
          }
          if (data.width > 480) {
            $modal.css({
                marginTop  : -($modal.outerHeight() / 2)
              , marginLeft : -($modal.outerWidth() / 2)
            })
          }

          var original = {
              width  : $modal.data().modal.img.width
            , height : $modal.data().modal.img.height
          }

          var img = $modal.data().modal._loadingImage = window.loadImage.scale(original, options)

          $modal.find('.modal-image').css(img)
          $modal.find('.modal-image img').attr('width', img.width)
          $modal.find('.modal-image img').attr('height', img.height)

        }

        data.scrollTop = $w.scrollTop()

        // set max height using data.height
        data.maxHeight = data.height - (opts.spacing * 2)

        // adjust max height for tablets
        if (data.width > 480 && data.width <= 767)
          data.maxHeight = data.maxHeight - 20

        var modal = {
            width  : $modal.width()
          , height : $modal.height()
        }

        // take data.maxHeight and subtract the height footer/header/body padding
        if (!gallery) {
          var difference = data.maxHeight
          difference = difference - $header.outerHeight(true)
          difference = difference - $footer.outerHeight(true)
          difference = difference - ($body.outerHeight(true) - $body.height())
          if (difference > 400 && data.width > 480 && data.width <= 767)
              difference = 400
          else 
              difference = difference - 50
          $body.css('max-height', difference)
        }

        if (modal.height >= data.maxHeight) {
          modal.top = (gallery && fullscreen) ? data.scrollTop : data.scrollTop + opts.spacing
        } else {
          modal.top = data.scrollTop + (data.height - modal.height) / 2
        }
        $modal.css({ top: modal.top, position: 'absolute', marginTop: 0 })

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
})(jQuery, window)
