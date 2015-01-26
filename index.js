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

  var vendors = ['', 'webkit', 'moz', 'ms', 'o']

  for(var i = 0, len = vendors.length; i < len; ++i) {
    ael.call(doc, vendors[i]+'fullscreenchange', onfullscreenchange)
    ael.call(doc, vendors[i]+'fullscreenerror', onfullscreenerror)
  }

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

    var element_exit = 
    (el.exitFullscreen ||
    el.exitFullscreen ||
    el.webkitExitFullScreen ||
    el.webkitExitFullscreen ||
    el.mozCancelFullScreen ||
    el.mozCancelFullscreen ||
    el.mozExitFullScreen ||
    el.mozExitFullscreen ||
    el.msExitFullScreen ||
    el.msExitFullscreen ||
    el.oExitFullScreen ||
    el.oExitFullscreen);

    if(element_exit) {
      element_exit.call(el);
      return;
    }

    var document_exit = 
    (doc.exitFullscreen ||
    doc.exitFullscreen ||
    doc.webkitExitFullScreen ||
    doc.webkitExitFullscreen ||
    doc.mozCancelFullScreen ||
    doc.mozCancelFullscreen ||
    doc.mozExitFullScreen ||
    doc.mozExitFullscreen ||
    doc.msExitFullScreen ||
    doc.msExitFullscreen ||
    doc.oExitFullScreen ||
    doc.oExitFullscreen);

    document_exit.call(doc);


  } 

  function fullscreenelement() {
    return 0 ||
      doc.fullScreenElement ||
      doc.fullscreenElement ||
      doc.webkitFullScreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.mozFullscreenElement ||
      doc.msFullScreenElement ||
      doc.msFullscreenElement ||
      doc.oFullScreenElement ||
      doc.oFullscreenElement ||
      null
  }
}

function shim(el) {
  return (el.requestFullscreen ||
    el.webkitRequestFullscreen ||
    el.webkitRequestFullScreen ||
    el.mozRequestFullscreen ||
    el.mozRequestFullScreen ||
    el.msRequestFullscreen ||
    el.msRequestFullScreen ||
    el.oRequestFullscreen ||
    el.oRequestFullScreen)
}
