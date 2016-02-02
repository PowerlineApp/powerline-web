'use strict';

angular.module('app').config(function ($routeProvider) {
  $routeProvider
    .when('/about', {
      templateUrl: 'views/about/index.html',
      controller: 'styles'
    })
    .when('/about/community-guidelines', {
      templateUrl: 'views/about/community-guidelines.html',
      controller: 'styles'
    })
    .when('/about/our-story', {
      templateUrl: 'views/about/our-history.html',
      controller: 'styles'
    })
	.when('/about/public-accountability', {
      templateUrl: 'views/about/public-accountability.html',
      controller: 'styles'
    })
    .when('/coming-soon', {
      templateUrl: 'views/coming-soon.html',
      controller: 'styles'
    })
  ;
});