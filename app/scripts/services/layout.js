'use strict';

angular.module('app').factory('layout', function ($document) {

  var service = {
    header: {},

    reset: function () {
      service.bodyClass = 'app-page';
      service.header = {};
      service.header.isShowTop = true;
      $document.scrollTop(0);
    }
  };

  return service;
});