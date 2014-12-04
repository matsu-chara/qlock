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

qlock.MaskView = function($window, $container, model) {
  "use strict";
  var $maskA = $("#js-mask-clock"),
      $maskB = $("#js-mask-clock-invert"),
      count = 0;

  var MASK_STATE = {
    NONE: 0,
    VERTICAL_BAR: 1,
    HOLIZONTAL_BAR: 2,
    FULL: 3
  };

  function construct() {
    $(model).on("update", function(e, sec) {
      changeView();
    });
  }

  function changeView() {
    switch(++count) {
      case 1:
        setZindex($maskB, $maskA);
        resetState($maskA, MASK_STATE.FULL);
        swipeRight($maskB);
        break;
      case 2:
        setZindex($maskA, $maskB);
        resetState($maskB, MASK_STATE.FULL);
        swipeDown($maskA);
       break;
      case 3:
        setZindex($maskA, $maskB);
        resetState($maskB, MASK_STATE.FULL);
        swipeLeft($maskA);
        break;
      case 4:
        setZindex($maskB, $maskA);
        resetState($maskA, MASK_STATE.FULL);
        swipeUp($maskB);
        count = 0;
        break;
      default:
        break;
    }
  }

  function swipeRight($mask) {
    resetState($mask, MASK_STATE.FULL);
    anim($mask, {"width": "0%"});
  }

  function swipeDown($mask) {
    resetState($mask, MASK_STATE.FULL);
    anim($mask, {"height": "0%"});
  }

  function swipeLeft($mask) {
    resetState($mask, MASK_STATE.VERTICAL_BAR);
    anim($mask, {"width": "100%"});
  }

  function swipeUp($mask) {
    resetState($mask, MASK_STATE.HOLIZONTAL_BAR);
    anim($mask, {"height": "100%"});
  }

  function anim($mask, css) {
    var time = 500;

    if(css.hasOwnProperty("height")) {
      time = time / $window.width() * $window.height();
    }

    $mask.stop()
         .animate(css, time, "easeOutExpo");
  }

  function setZindex($topMask, $bottomMask) {
    var top = 10,
        bottom = 5;
        changeZ($topMask,    top);
        changeZ($bottomMask, bottom);
  }

  function changeZ($current, index) {
    $(".z" + index).removeClass("z" + index);
    $current.addClass("z" + index);
  }

  function resetState($mask, state) {
    var width, height;

    switch(state) {
      case MASK_STATE.NONE:
        width = "0%";
        height = "0%";
        break;
      case MASK_STATE.VERTICAL_BAR:
        width = "0%";
        height = "100%";
        break;
      case MASK_STATE.HOLIZONTAL_BAR:
        width = "100%";
        height = "0%";
        break;
      case MASK_STATE.FULL:
        width = "100%";
        height = "100%";
        break;
    }
    reset($mask, {"width":  width});
    reset($mask, {"height": height});
  }

  function reset($mask, css) {
    $mask.stop();
    $mask.css(css);
  }

  construct();
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

  qlock.ContainerView($window, $container);
  qlock.MaskView($window, $container, timerModel);
  qlock.ClockView($clock, timerModel);
  timerModel.start();
} ());
