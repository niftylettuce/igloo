
//     Twitter Bootstrap jQuery Plugins - Modal Responsive Fix
//     Copyright (c) 2012 Nick Baugh <niftylettuce@gmail.com>
//     MIT Licensed
//     v0.0.2

// * Author: [@niftylettuce](https://twitter.com/#!/niftylettuce)
// * Source: <https://github.com/niftylettuce/twitter-bootstrap-jquery-plugins>

// # modal-responsive-fix

$(function() {
  // TODO: bind touchScroll to newly created `.modal`'s
  $('.modal').not('.modal-gallery').touchScroll();
});

var adjustModal = function adjustModal($modal) {

  var top,
    maxHeight = $(window).height() - 20,
    fullscreen = $modal.hasClass('modal-fullscreen');

  if (!fullscreen && $modal.css('display') !== 'block')
    $modal.css('max-height', maxHeight)
  else
    $modal.find('.modal-body').css('max-height', 400)

  // TODO: add fix for when $modal.width() > $(window).width()

  if ($(window).width() <= 480) {
    if (fullscreen) {
      if ($modal.height() >= $(window).height()) {
        top = $(window).scrollTop();
      } else {
        top = $(window).scrollTop() + ($(window).height() - $modal.height()) / 2;
      }
    } else if ($modal.height() >= $(window).height() - 10) {
      top = $(window).scrollTop() + 10;
    } else {
      top = $(window).scrollTop() + ($(window).height() - $modal.height()) / 2;
    }
  } else {
    top = '50%';
    $modal.css('display', 'block')
    if (fullscreen) {
      $modal.stop().animate({
        marginTop  : -($modal.outerHeight() / 2),
        marginLeft : -($modal.outerWidth() / 2),
        top        : top
      }, "fast");
      return;
    }
  }

  $modal.stop().animate({ top: top }, "fast");

};

var show = function show() {
  var $modal = $(this);
  adjustModal($modal);
};

var checkShow = function checkShow() {
  $('.modal').each(function() {
    var $modal = $(this);
    if ($modal.css('display') !== 'block') return;
    adjustModal($modal);
  });
};

var modalWindowResize = function modalWindowResize() {
  $('.modal').not('.modal-gallery').on('show', show);
  $('.modal-gallery').on('displayed', show);
  checkShow();
};

$(modalWindowResize);

$(window).resize(modalWindowResize);

$(window).scroll(checkShow);
