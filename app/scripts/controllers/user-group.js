'use strict';

angular.module('app').controller('PopularGroupsCtrl', function($scope, $http) {

	var popularGroups = [];
	

	$http.get('https://api.powerli.ne/api/groups/popular')
	.success(function(response) {
		
		$scope.popularGroups = response;
		
		console.log('There are ' + $scope.popularGroups.length + ' activities');
		
		return popularGroups;
		
	});
	

});