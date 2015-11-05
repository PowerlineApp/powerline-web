'use strict';

angular.module('app').directive('loginForm', function (session) {

  return {
    restrict: 'EA',
    scope: {
      onSuccess: '&'
    },
    templateUrl: 'views/session/login-form.html',
    link: function (scope) {
      var data = scope.login_data = {};
      scope.loading = false;
      scope.login = function () {
        scope.error = '';
        if (!data.username || !data.password) {
          scope.error = 'All fields required';
          return;
        }
        scope.loading = true;
        session.login(data).then(function () {
          scope.onSuccess({loginFormScope: scope});
        }, function (response) {
          if (400 === response.status) {
            scope.error = 'Incorrect login or password';
          }
          scope.loading = false;
        });
      };

      scope.loginWithFacebook = function () {
        scope.is_overlay_visible = true;
        scope.loading = true;
        session.loginWithFacebook().then(function () {
          scope.onSuccess({loginFormScope: scope});
        }, function (error) {
          scope.error = 'Incorrect login';
          scope.loading = false;
        });
      };
    }
  };
});
