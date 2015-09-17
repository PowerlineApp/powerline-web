'use strict';

angular.module('app').controller('namesCtrl', function($scope, $http) {
    $http.get('http://www.w3schools.com/angular/customers.php')
    .success(function(response) {
			$scope.names = response.records;
		});
	});







