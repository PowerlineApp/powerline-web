'use strict';

angular.module('app').config(function ($routeProvider) {
  $routeProvider
    .when('/admin-login', {
      templateUrl: 'views/admin-login.html',
      controller: [ 'layout',  function ( layout) {
        layout.header.isShowTop = false;
        layout.bodyClass = 'style-main info-page';
		

      }]
    });
    

});

