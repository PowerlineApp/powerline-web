
'use strict';

angular.module('app').controller('loginController', [ '$scope', '$http' , function($scope, $http) {
    


	var token;
	function setToken(data) {
	    token = data;
	    $http.defaults.headers.common.Token = token;
	  }
	
	
	
	function loadProfile() {
		
		
		console.log($scope.loggedin);
		
	  return $http.get('https://api.powerli.ne/api/profile').success(function(data) {
			$scope.userProfile = data;
			$scope.loggedin = true;
			console.log($scope.loggedin);
			console.log($scope.userProfile.first_name);
		
		});
	
	}
	


	$scope.login = function(){
        
		var data = { 'username' : $scope.username, 'password': $scope.password  };
		
		console.log($scope.username);
		
		$http.post('https://api.powerli.ne/api/secure/login',
				angular.element.param(data),
				{headers: {
	      'Content-Type': 'application/x-www-form-urlencoded'
	    }}).then(function (response) {
				if (200 === response.status)
				{
					setToken(response.data.token);
					return loadProfile();
				} else {
					alert('Nah Bro');
				}
		  });
	

  };
}]);
