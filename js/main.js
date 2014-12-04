//QLOCK-写経 2014/12/02

// namespace
var qlock = qlock || {};

(function() {
  "use strict";
  var $window = $(window),
      $container = $(".container");

  qlock.ContainerView($window, $container);
} ());
