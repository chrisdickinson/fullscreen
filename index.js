module.exports = fullscreen
fullscreen.available = available

var EE = require('events').EventEmitter

function available() {
  return !!shim(document.body)
}

function fullscreen(el) {
  var ael = el.addEventListener || el.attachEvent
    , doc = el.ownerDocument
    , body = doc.body
    , rfs = shim(el)
    , ee = new EE

  var vendors = ['', 'webkit', 'moz']

  for(var i = 0, len = vendors.length; i < len; ++i) {
    ael.call(doc, vendors[i] + 'fullscreenchange', onfullscreenchange)
    ael.call(doc, vendors[i] + 'fullscreenerror', onfullscreenerror)
  }
  // MS uses different casing:
  ael.call(doc, 'MSFullscreenChange', onfullscreenchange)
  ael.call(doc, 'MSFullscreenError', onfullscreenerror)

  ee.release = release
  ee.request = request
  ee.target = fullscreenelement

  if(!shim) {
    setTimeout(function() {
      ee.emit('error', new Error('fullscreen is not supported'))
    }, 0)
  }
  return ee

  function onfullscreenchange() {
    if(!fullscreenelement()) {
      return ee.emit('release')
    }
    ee.emit('attain')
  }

  function onfullscreenerror() {
    ee.emit('error')
  }

  function request() {
    return rfs.call(el)
  }

  function release() {

    var element_exit = (el.exitFullscreen ||
      el.webkitExitFullscreen ||
      el.mozCancelFullScreen ||
      el.mozExitFullScreen ||
      el.msExitFullscreen);

    if (element_exit) {
      element_exit.call(el);
      return;
    }

    var document_exit = (doc.exitFullscreen ||
      doc.webkitExitFullscreen ||
      doc.mozCancelFullscreen ||
      doc.mozExitFullScreen ||
      doc.msExitFullscreen);

    document_exit.call(doc);
  } 

  function fullscreenelement() {
    return (0 ||
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement ||
      null);
  }
}

function shim(el) {
  return (el.requestFullscreen ||
    el.webkitRequestFullscreen ||
    el.mozRequestFullscreen ||
    el.msRequestFullscreen);
}
