'use strict';

angular.module('app').factory('flurry', function ($window) {

  var flurry;
  angular.element.getScript('https://cdn.flurry.com/js/flurry.js', function () {
    flurry = $window.FlurryAgent;
    flurry.startSession('4P28JMKMTJ2HKRNSRMQS');
  });

  return {
    log: function (event, params) {
      if (!flurry) {
        return;
      }
      if (params) {
        flurry.logEvent(event, params);
      } else {
        flurry.logEvent(event);
      }
    },
    setUserId: function (userId) {
      if (!flurry) {
        return;
      }
      flurry.setUserId(userId);
    }
  };
});