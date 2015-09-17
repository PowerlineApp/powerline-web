'use strict';

describe('Controller: PetitionCtrl', function () {

  beforeEach(module('app'));

  it('should load petition by id', inject(function ($controller, $rootScope, $q) {
    var petitions = {
      loadOne: function () {
        return $q.defer().promise;
      },
      loadComments: function () {
        return $q.defer().promise;
      }
    };
    var scope = new $rootScope.$new(true);
    $controller('PetitionCtrl', {
      $scope: scope,
      $routeParams: {id: 1},
      petitions: petitions
    });
  }));
});
