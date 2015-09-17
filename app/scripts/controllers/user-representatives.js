'use strict';

angular.module('app').controller('userRepCtrl', function($scope, $http) {

	var userReps = [];
	
	var repNumber = {};

	$http.get('https://api.powerli.ne/api/representatives/')
	.success(function(response) {
		
		$scope.userReps = response;
		
		$scope.repNumber = $scope.userReps.length;
		
		//	var followNumber = $scope.userFollow.length;
		
		console.log($scope.repNumber);
	
		return {userReps: userReps, repNumber : repNumber};
		
		

		

		
	});
	
	

});