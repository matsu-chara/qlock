//QLOCK-写経 2014/12/02

/*global $, _ */

// namespace
var qlock = qlock || {};

qlock.TimerModel = function() {
  "use strict";
  var that = {},
      d    = new Date(),
      hh,
      mm,
      ss;

  function update() {
    d = new Date();
    var _hh = d.getHours(),
        _mm = d.getMinutes(),
        _ss = d.getSeconds();

    if(_ss !== ss) {
      $(that).trigger("update", [{
        current: {
          hh:_hh,
          mm:_mm,
          ss:_ss
        },
        past: {
          hh:hh,
          mm:mm,
          ss:ss
        }
      }]);
    }
    hh = _hh;
    mm = _mm;
    ss = _ss;
  }

  that.start = function() {
    // start loop
    (function loop() {
      window.requestAnimationFrame(loop);
      update();
    } ());
  };

  return that;
};

qlock.ContainerView = function($window, $container) {
  "use strict";
  var $resizeContainer;

  function construct() {
    $resizeContainer = $container.find(".js-full-resize");
    $window
      .resize(_.throttle(resize, 100))
      .trigger("resize");
  }

  function resize() {
    var w = $window.width(),
        h = $window.height();
    var size = {
          width:  w + "px",
          height: h + "px"
        };

    $resizeContainer.css(size);
  }

  $(construct);
}

(function() {
  "use strict";
  var $window = $(window),
      $container = $(".container");
      timerModel = qlock.Timermodel();

  qlock.ContainerView($window, $container);
} ());
