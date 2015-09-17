'use strict';

angular.module('app').factory('resetpassword', function ($http, serverUrl) {
  return {
    checkResetToken: function (token) {
      return $http.get(serverUrl + '/api/secure/resettoken/'+token);
    },

    saveNewPassword: function(token, user) {
      var data = {'token':token, 'password':user.password, 'password_confirm':user.passwordConfirm};
      return $http.post(serverUrl + '/api/secure/resettoken/'+token, data);
    }
  };
});
