'use strict';

angular.module('app').controller('ResetPasswordCtrl', function ($scope, $routeParams, resetpassword) {
  $scope.loading = true;
  $scope.user = {};
  resetpassword.checkResetToken($routeParams.token).then(function () {
    $scope.loading = false;
    $scope.user.resetToken = $routeParams.token;
  }, function (response) {
    if (404 === response.status) {
      $scope.path('/404');
    }
  });
    
  $scope.changePassword = function() {
    $scope.error = '';
    if (!$scope.user.password || !$scope.user.passwordConfirm) {
      $scope.error = 'All fields required';
      return;
    }
    if ($scope.user.password !== $scope.user.passwordConfirm) {
      $scope.error = 'Passwords entered do not match';
      return;
    }
    $scope.loading = true;
    resetpassword.saveNewPassword($routeParams.token, $scope.user).then(function () {
      $scope.loading = false;
      $scope.path('/thank');
    }, function (response) {
      if (404 === response.status) {
        $scope.error = 'Incorrect token value';
      }
      if (400 === response.status) {
        $scope.error = response.data.errors[0].message;
      }
      $scope.loading = false;
    });
  };
});
