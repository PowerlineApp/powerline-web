'use strict';

angular.module('app').filter('elapsed', function () {

  function str(value, item, showZero) {
    if (value) {
      return value + ' ' + item + ' ';
    } else if (showZero) {
      return value + ' ' + item + ' ';
    }
    return '';
  }

  return function (input) {
    if (input) {
      var current = new Date();
      var elapsed = new Date(current - new Date(input));
      var days = Math.floor(elapsed.getTime() / 86400000);
      if (days) {
        return str(days, 'd') + str(elapsed.getUTCHours(), 'h');
      } else {
        return str(elapsed.getUTCHours(), 'h') + str(elapsed.getUTCMinutes(), 'm', true);
      }
    }
    return '';
  };
});
