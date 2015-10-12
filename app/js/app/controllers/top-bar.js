angular.module('app.controllers').controller('topBar',function ($scope, mainMenu,topBar, $location, $rootScope, $window,$cacheFactory,homeCtrlParams) {
  
  $scope.data = topBar.getData();

  $scope.$watch(topBar.getData, function (newValue) {
    $scope.data = newValue;
  });

  $scope.homeCtrlParams = homeCtrlParams;

  
  $scope.back = function () {
    $window.history.back();
  };
  
  $scope.items = [];
  $scope.$watch(function () {
    return mainMenu.items;
  }, function (items) {
    $scope.items = items;
  });

  $scope.navigate = function (item) {
    item.navigate();
    $scope.closeMenu();
  };

  $scope.placeholders = {
    search: 'Search'
  };

  $scope.data = {
    search: 'Search'
  };

  $scope.cleanSearchCache = function () {
    $cacheFactory.get('searchController').removeAll();
  };

  $scope.$watch($rootScope.isMenuClosed, function (value) {
    if (!value) {
      $scope.$broadcast('scroll-content-changed');
    }
  });
}).controller('mainMenu',function ($scope, mainMenu, $location, $rootScope, $cacheFactory, homeCtrlParams) {
  $scope.items = [];
  $scope.$watch(function () {
    return mainMenu.items;
  }, function (items) {
    $scope.items = items;
  });

  $scope.navigate = function (item) {
    item.navigate();
    $scope.closeMenu();
  };

  $scope.navigateToProfile = function (item) {
    //console.log(item);
    $scope.path('/representative/' + (item.representative ? item.representative.id : 0) + '/' + item.storage_id);
  };

  $scope.placeholders = {
    search: 'Search'
  };

  $scope.data = {
    search: 'Search'
  };

  $scope.cleanSearchCache = function () {
    $cacheFactory.get('searchController').removeAll();
  };

  $scope.$watch($rootScope.isMenuClosed, function (value) {
    if (!value) {
      $scope.$broadcast('scroll-content-changed');
    }
  });

  $scope.homeCtrlParams = homeCtrlParams;
  
}).controller('notifications', function ($scope, socialActivityTabManager, $location, groupsInvites, invites, announcements, $route, homeCtrlParams) {

  $scope.homeCtrlParams = homeCtrlParams;

  $scope.SAState = socialActivityTabManager.getState();

  $scope.$watch(getMessagesCount, function (messagesCount) {
    $scope.messagesCount = messagesCount;
  });

  $scope.activity = function () {
    homeCtrlParams.loaded = false;
    homeCtrlParams.filter.selectedGroup = null;
    if ('/main' !== $location.path()) {
      $location.path('/main');
    } else {
      $route.reload();
    }
  };

  $scope.goToMessages = function () {
    announcements.setViewed();
    announcements.updateNumberOfNew();
    $scope.navigateTo('path', 'messages');
  };

  $scope.followersNotifications = function () {
    $scope.SAState.reload = true;
    if ('/influences/notifications' === $location.path()) {
      $route.reload();
    } else {
      $location.path('/influences/notifications');
    }
  };

  $scope.getClass = function (path) {
    return $scope.getActiveClass(path, $location.path());
  };

  function getMessagesCount() {
    
    return groupsInvites.get().length + announcements.getNumberOfNew() + invites.get().size();
  }
}).controller('rightBar', function ($scope, homeCtrlParams) {

  $scope.homeCtrlParams = homeCtrlParams;
});
