
//     Twitter Bootstrap jQuery Patches - Modal Responsive Fix
//     Copyright (c) 2012 Nick Baugh <niftylettuce@gmail.com>
//     MIT Licensed
//     Version 0.0.2

//
// * Author: [@niftylettuce](https://twitter.com/#!/niftylettuce)
// * Source: <https://github.com/niftylettuce/twitter-bootstrap-jquery-patches>
// * Resolves #407, #1017, #1339, #2130, #3361, #3362, #4283:
//  <https://github.com/twitter/bootstrap/issues/2130>
// * Built-in support for fullscreen Bootstrap Image Gallery
//  <https://github.com/blueimp/Bootstrap-Image-Gallery>
//
// **NOTE**: Include "touchscroll.js" before "modal-responsive-fix".
//  This fixes the mobile issue with Android/iPhone scrollabe `div`'s.
//  Simply download it from the "Source" link above and add the path:
//
//
// ```html
// <script type="text/javascript" src="/js/vendor/touchscroll.js"></script>
// ```
//
// **NOTE** You will need to patch "modal.css" as follows:
//
// ```css
// .modal-body {
//   overflow-y: auto;
//   // max-height: 400px; /* remove this */
//   padding: 15px;
// }
// ```
//
// **NOTE:** If you are using `.modal-fullscreen`, you will need
//  to add the following CSS to "bootstrap-image-gallery.css":
//
// ```js
// @media (max-width: 480px) {
//   .modal-fullscreen {
//     left: 0 !important;
//     right: 0 !important;
//     margin-top: 0 !important;
//     margin-left: 0 !important;
//   }
// }
// ```
//

// # modal-responsive-fix

$(function() {
  // TODO: bind touchScroll to newly created `.modal`'s
  $('.modal').touchScroll()
})

var adjustModal = function adjustModal($modal) {

  var top, maxHeight = $(window).height() - 20

  if ($(window).width() <= 480) {
    if ($modal.hasClass('modal-fullscreen')) {
      if ($modal.height() >= $(window).height()) {
        top = $(window).scrollTop()
      } else {
        top = $(window).scrollTop() + ($(window).height() - $modal.height()) / 2
      }
    } else if ($modal.height() >= $(window).height() - 10) {
      top = $(window).scrollTop() + 10
    } else {
      top = $(window).scrollTop() + ($(window).height() - $modal.height()) / 2
    }
  } else {
    top = '50%'
    if ($modal.hasClass('modal-fullscreen')) {
      $modal.stop().animate({
          marginTop  : -($modal.outerHeight() / 2)
        , marginLeft : -($modal.outerWidth() / 2)
        , top        : top
        , maxHeight  : maxHeight
      }, "fast")
      return
    }
  }

  $modal.stop().animate({ top: top, maxHeight: maxHeight }, "fast")

}

var show = function show() {
  var $modal = $(this)
  adjustModal($modal)
}

var checkShow = function checkShow() {
  $('.modal').each(function() {
    var $modal = $(this)
    if ($modal.css('display') !== 'block') return
    adjustModal($modal)
  });
}

var modalWindowResize = function modalWindowResize() {
  $('.modal').not('.modal-gallery').on('show', show)
  $('.modal-gallery').on('displayed', show)
  checkShow()
}

$(modalWindowResize)

$(window).resize(modalWindowResize)

$(window).scroll(checkShow)
