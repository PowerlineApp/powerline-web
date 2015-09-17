angular.module('app')
  .directive('cards', function () {
    return {
      restrict: 'E',
      scope: {
        cancel: '&',
        completed: '&'
      },
      templateUrl: 'views/session/cards.html',
      controller: function ($scope, cards, session) {
        $scope.cardsLoading = true;
        cards.load()
          .then(function (collection) {
            if (collection.size()) {
              $scope.completed();
            }
          })
          .finally(function () {
            $scope.cardsLoading = false;
          })
        ;
        var user = session.getUser();
        $scope.data = {
          name: user.full_name,
          number: '',
          cvv: '',
          expired_month: '',
          expired_year: '',
          address: {
            country_code: 'US',
            city: user.city,
            line1: user.address1,
            line2: user.address2,
            state: user.state,
            postal_code: user.zip
          }
        };

        $scope.submit = function () {
          $scope.cardsLoading = true;
          cards.create($scope.data)
            .then(function () {
              $scope.cardsLoading = false;
              $scope.completed();
            })
            .catch(function (error) {
              alert(error);
            })
            .finally(function () {
              $scope.cardsLoading = false;
            })
          ;
        };
      }
    };
  })
;
