'use strict';

angular.module('app').config(function ($routeProvider) {
  $routeProvider
    .when('/posts', {
      templateUrl: 'views/blog/posts.html',
      controller: ['$scope', 'layout', 'posts', function ($scope, layout, posts) {
        layout.header.isShowTop = false;
        layout.bodyClass = 'style-main';
        $scope.posts = posts;
        posts.load();
      }]
    })
    .when('/posts/:id', {
      templateUrl: 'views/blog/post.html',
      controller: ['$scope', 'layout', 'posts', '$routeParams', 'flurry', function ($scope, layout, posts, $routeParams, flurry) {
        layout.header.isShowTop = false;
        layout.bodyClass = 'style-main';
        $scope.post = posts.get($routeParams.id);
        $scope.$watch(function () {
          return posts.get($routeParams.id);
        }, function (post) {
          $scope.post = post;
          if (post) {
            flurry.log('blog post page', {id: $scope.post.get('id')});
          }
        });
        if (!$scope.post) {
          posts.load();
        }
      }]
    })
  ;
});