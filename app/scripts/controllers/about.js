'use strict';

angular.module('app').config(function ($routeProvider) {
  $routeProvider
    .when('/about', {
      templateUrl: 'views/about/index.html',
      controller: ['layout', function (layout) {
        layout.header.isShowTop = false;
        layout.bodyClass = 'style-main info-page';
      }]
    })
    .when('/about/community-guidelines', {
      templateUrl: 'views/about/community-guidelines.html',
      controller: ['layout', function (layout) {
        layout.header.isShowTop = false;
        layout.bodyClass = 'style-main info-page';
      }]
    })
    .when('/about/our-story', {
      templateUrl: 'views/about/our-history.html',
      controller: ['layout', function (layout) {
        layout.header.isShowTop = false;
        layout.bodyClass = 'style-main info-page';
      }]
    })
	.when('/about/public-accountability', {
      templateUrl: 'views/about/public-accountability.html',
      controller: ['layout', function (layout) {
        layout.header.isShowTop = false;
        layout.bodyClass = 'style-main info-page';
      }]
    })
    .when('/coming-soon', {
      templateUrl: 'views/coming-soon.html',
      controller: ['layout', function (layout) {
        layout.header.isShowTop = false;
        layout.bodyClass = 'style-main';
      }]
    })
  ;
});