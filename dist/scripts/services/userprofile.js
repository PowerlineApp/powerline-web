'use strict';

angular.module('app').controller('userCtrl', function($scope, $http) {

	var userInfo = [];
	
	

	$http.get('https://api.powerli.ne/api/profile')
	.success(function(response) {


		$scope.userInfo = response;


		console.log('Welcome Mrs.' + $scope.userInfo.full_name);

		return userInfo;
	});
		
		
	
		

});







