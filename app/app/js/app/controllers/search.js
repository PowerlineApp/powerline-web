angular.module('app.controllers').controller('search', function ($scope, topBar, search, layout, $cacheFactory, flurry, $routeParams) {
  topBar.setHomeBar();
  topBar.set('right', null);
  var cache = $cacheFactory.get('searchController');

  flurry.log('search');

  if($routeParams.q){
    $scope.query = $routeParams.q;
  }else{
    $scope.query = cache.get('query');
  }

  $scope.data = cache.get('data');

  $scope.search = function (query) {
    $scope.loading = true;
    $scope.data = null;
    search.load(query).then(function (data) {
      $scope.data = data;
      $scope.loading = false;
      cache.put('query', query);
      cache.put('data', data);
    }, function () {
      $scope.loading = false;
    });
  };

  if ($scope.query && !$scope.data) {
    $scope.search($scope.query);
  }

  layout.setContainerClass('search-screen');
});
