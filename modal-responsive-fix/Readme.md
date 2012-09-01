
# Twitter Bootstrap jQuery Plugins
## Modal Responsive Fix <sup>0.0.2</sup>

* Resolves Twitter Bootstrap issues [#407 #1017 #1339 #2130 #3361 #3362 #4283][1]
* Built-in support for fullscreen [Bootstrap Image Gallery][2]

# Quick Start

**1.** Include [touchscroll.js][3] (fixes mobile scrollable div issue):

```html
<script type="text/javascript" src="/js/vendor/touchscroll.min.js"></script>
```

**2.** Include [jquery.modal-responsive-fix.js][4] after the previous `<script>`:

```html
<script type="text/javascript" src="/js/vendor/modal-responsive-fix.min.js"></script>
```

**3.** Patch [modal.less][5] (or [bootstrap.css][6]) (fixes scrollable div heights on mobile):

```less
.modal-body {
  overflow-y: auto;
  /* #L69 of "modal.less" */
  /* max-height: 400px; // remove this line */
  padding: 15px;
}
```

**4.** **Optional**: Patch [bootstrap-image-gallery.css][7] (only if you are using `.modal-fullscreen` via [Bootstrap Image Gallery][2])

```css
/* #L137-140 of "bootstrap-image-gallery.css" */
@media (max-width: 480px) {
  .modal-gallery .btn span {
    display: none;
  }
  .modal-fullscreen {
    left: 0 !important;
    right: 0 !important;
    margin-top: 0 !important;
    margin-left: 0 !important;
  }
}
```

[1]: https://github.com/twitter/bootstrap/issues/2130
[2]: https://github.com/blueimp/Bootstrap-Image-Gallery
[3]: https://raw.github.com/niftylettuce/twitter-bootstrap-jquery-plugins/master/modal-responsive-fix/touchscroll.js
[4]: https://raw.github.com/niftylettuce/twitter-bootstrap-jquery-plugins/master/modal-responsive-fix/bootstrap.jquery.modal-responsive-fix.js
[5]: https://github.com/twitter/bootstrap/blob/master/less/modals.less#L69
[6]: http://twitter.github.com/bootstrap/assets/css/bootstrap.css
[7]: https://github.com/blueimp/Bootstrap-Image-Gallery/blob/master/css/bootstrap-image-gallery.css#L137-140
