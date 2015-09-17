'use strict';

angular.module('app').factory('session', function ($http, serverUrl, facebook, $q, flurry) {

  var token, user;
  function setToken(data) {
    token = data;
    $http.defaults.headers.common.Token = token;
  }

  function loadProfile() {
    return $http.get(serverUrl + '/api/profile').then(function (response) {
      user = response.data;
      flurry.setUserId(user.id);
    });
  }

  return {
    login: function (data) {
      return $http.post(serverUrl + '/api/secure/login', angular.element.param(data), {headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }}).then(function (response) {
        setToken(response.data.token);
        flurry.log('logged in');
        return loadProfile();
      });
    },

    getUser: function () {
      return user;
    },

    loginWithFacebook: function () {
      var deferred = $q.defer();
      facebook.login().then(function (data) {
        $http.post(serverUrl + '/api/secure/facebook/login', angular.element.param(data), {headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }}).then(function (response) {
          setToken(response.data.token);
          flurry.log('logged in with facebook');
          deferred.resolve();
        }, function (response) {
          if (302 === response.status) {
            facebook.getRegistrationData(data).then(function (data) {
              $http.post(serverUrl + '/api/secure/registration-facebook',  angular.element.param(data), {headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }}).then(function (response) {
                setToken(response.data.token);
                flurry.log('registered with facebook');
                deferred.resolve();
              }, function () {
                deferred.reject('Registration failed');
              });
            });
          } else {
            deferred.reject('Error occurred');
          }
        });
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    },

    getToken: function () {
      return token;
    }
  };
}).factory('api', function (session) {
  var publicPaths = {
    petition: '/api-public/petition/',
    paymentRequest: '/api-public/payment-request/'
  };

  var privatePaths = {
    petition: '/api/poll/question/',
    paymentRequest: '/api/poll/question/'
  };

  return {
    getUriPath: function (key) {
      return session.getToken() ? privatePaths[key] : publicPaths[key];
    }
  };
}).factory('facebook', function ($q, $rootScope, stateAbbreviations, $window) {
  var FB, uid;
  $rootScope.is_facebook_loaded = false;
  angular.element.getScript('//connect.facebook.net/en_US/all.js', function (){
    FB = $window.FB;
    FB.init({
      appId: '244141112405524'
    });
    $rootScope.is_facebook_loaded = true;
    $rootScope.execApply();
  });
  return {
    login: function () {
      var deferred = $q.defer();

      FB.login(function(response) {
        if (response.status === 'connected') {
          uid = response.authResponse.userId || response.authResponse.userID;
          deferred.resolve({
            facebook_token: response.authResponse.accessToken,
            facebook_id: uid
          });
        } else {
          deferred.reject('Facebook login failed');
        }
        $rootScope.execApply();
      }, { scope: 'email,user_birthday'});

      return deferred.promise;
    },

    getRegistrationData: function (params) {
      var deferred = $q.defer();

      FB.api({
        method: 'fql.query',
        query: 'select username, email, first_name, last_name, pic, sex, current_location, birthday_date, profile_url from user where uid =' + uid,
        return_ssl_resources: 1
      }, function(response) {
        var fu = response[0];
        var data = {
          facebook_id: params.facebook_id,
          facebook_token: params.facebook_token,
          country: 'US',
          username : fu.username,
          email : fu.email,
          first_name : fu.first_name,
          last_name : fu.last_name,
          avatar_file_name : fu.pic,
          sex: fu.sex ? fu.sex[0].toUpperCase() + fu.sex.slice(1, fu.sex.length) : '',
          facebook_link: fu.profile_url
        };

        if (fu.current_location) {
          data.address1 = fu.current_location.street;
          data.city = fu.current_location.city;
          data.state = stateAbbreviations.US[fu.current_location.state];
          data.zip = fu.current_location.zip;
        }
        if (fu.birthday_date) {
          data.birth = fu.birthday_date;
        }
        deferred.resolve(data);
        $rootScope.execApply();
      });
      return deferred.promise;
    }
  };
});
