'use strict';

angular.module('app').controller('userActivityCtrl', function($scope, $http) {

	var userActivities = [];

	$http.get('https://api.powerli.ne/api/activities/')
	.success(function(response) {
		
		$scope.userActivities = response;
		
		console.log('There are ' + $scope.userActivities.length + ' activities');
		
		return userActivities;
		
	});
	

});