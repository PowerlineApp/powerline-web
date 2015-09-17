angular.module('app')
  .factory('cards', function ($http, serverUrl, JsCollection, balanced, $q) {
    return {
      load: function () {
        return $http.get(serverUrl + '/api/cards/').then(function (reponse) {
          return new JsCollection(reponse.data);
        });
      },
      create: function (data) {
        return balanced.createCard(data).then(function (response) {
          return $http.post(serverUrl + '/api/cards/', {
            name: data.name,
            balanced_uri: response.uri
          }).catch(function () {
            return $q.reject('Server Error');
          });
        });
      }
    };
  })
  .factory('balanced', function ($q, $window, $rootScope, marketplaceToken) {

    var balanced;

    $rootScope.is_balanced_loaded = false;
    angular.element.getScript('https://js.balancedpayments.com/v1/balanced.js', function (){
      balanced = $window.balanced;
      balanced.init('/v1/marketplaces/' + marketplaceToken);
      $rootScope.is_balanced_loaded = true;
      $rootScope.execApply();
    });

    return {
      createCard: function (data) {
        var deferred = $q.defer();
        balanced.card.create(data, function (response) {
          if(response.status === 201 && response.data.uri) {
            deferred.resolve(response.data);
          } else {
            var error = '';
            _.each(response.error, function (value) {
              error += String(value) + ' \n';
            });

            deferred.reject(error);
          }

          $rootScope.execApply();
        });

        return deferred.promise;
      }
    };
  })
;