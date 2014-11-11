'use strict';

/* Controllers */

angular.module('Authentication')

.controller('LoginCtrl', ['$scope', '$state', '$rootScope', '$location', 'AuthenticationService',
	function ($scope, $state, $rootScope, $location, AuthenticationService) {
		//This resets the login status with every call of the controller:
		//AuthenticationService.ClearCredentials();
		console.log("LoginCtrl started!");
		$scope.login = function (data) {
			$scope.dataLoading = true;
			console.log("Login-data:");
			console.log(data);
			AuthenticationService.login(data, function(response) {
				if(response.status == "Success") {
					AuthenticationService.setCredentials(data.name, data.pass);
					$scope.dataLoading = false;
					$location.path('/');
					console.log("SUCCESS!");
				} else {
					$scope.error = response.message;
					$scope.dataLoading = false;
					console.log("FAILURE!");
				}
			});
		};
}]);
