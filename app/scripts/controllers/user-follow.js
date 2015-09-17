'use strict';

angular.module('app').controller('userFollowCtrl', function($scope, $http) {

	var userFollow = [];
	
	var followNumber = {};

	$http.get('https://api.powerli.ne/api/follow/')
	.success(function(response) {
		
		$scope.userFollow = response;
		
		$scope.followNumber = $scope.userFollow.length;
		
	//	var followNumber = $scope.userFollow.length;
		
	//	console.log(followNumber);
	
		return {userFollow: userFollow, followNumber : followNumber};
		
		

		

		
	});
	
	

});