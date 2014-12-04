// QLOCK-写経 2014/12/02

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

qlock.ClockView = function($clock, model) {
  "use strict";
  var that = {},
      $hh = $clock.find("#js-hh"),
      $mm = $clock.find("#js-mm"),
      $ss = $clock.find("#js-ss"),
      $hhInvert = $clock.find("#js-hh-invert"),
      $mmInvert = $clock.find("#js-mm-invert"),
      $ssInvert = $clock.find("#js-ss-invert");

  function construct() {
    $(model).on("update", render);
  }

  function render(e, data) {
    var c = data.current,
        p = data.past;

    renderText($hh, c.hh, p.hh);
    renderText($mm, c.mm, p.mm);
    renderText($ss, c.ss, p.ss);
    renderText($hhInvert, c.hh, p.hh);
    renderText($mmInvert, c.mm, p.mm);
    renderText($ssInvert, c.ss, p.ss);
  }

  function renderText($dom, current, past) {
    if(current !== past) {
      $dom.text(zeroFormat(current, 2));
    }
  }

  function zeroFormat(num, n) {
    var ret = "" + num;
    while(ret.length < n) {
      ret = "0" + ret;
    }
    return ret;
  }

  construct();
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
};

(function() {
  "use strict";
  var $window = $(window),
      $container = $(".container"),
      $clock = $(".clock"),
      timerModel = qlock.TimerModel();

      console.log(qlock);
  qlock.ContainerView($window, $container);
  // qlock.MaskView($window, $container, timerModel);
  qlock.ClockView($clock, timerModel);
  timerModel.start();
} ());
