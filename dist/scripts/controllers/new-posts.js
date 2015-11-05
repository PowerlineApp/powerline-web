'use strict';

angular.module('app').config(function ($routeProvider) {
  $routeProvider
    .when('/new-posts', {
      templateUrl: 'views/test/test-list.html',
      controller: ['$scope', 'layout', 'posts', 'others',   function ($scope, layout, posts, others) {
        layout.header.isShowTop = false;
        layout.bodyClass = 'style-main';
        $scope.posts = posts;
        posts.load();
				$scope.others = others;
				others.load();
      }]
    })

  ;
});