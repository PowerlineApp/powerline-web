'use strict';

angular.module('app').controller('MainCtrl', function ($scope, layout, posts) {
  layout.header.isShowTop = false;
  layout.bodyClass = 'style-main';

  posts.load();

  $scope.posts = posts;


	


});



