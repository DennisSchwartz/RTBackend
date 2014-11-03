'use strict';

/* Controllers */

var backendControllers = angular.module('backendControllers', []);

backendControllers.controller('websiteCtrl', ['$scope',
	function($scope) {
		$scope.title = "Website Pflege";
	}
]);

backendControllers.controller('loginCtrl', ['$scope', '$state', 'userService',
	function($scope, $state, userService) {
		$scope.login = function(data) {
			console.log('Login is called!');
			console.log(data);
			//Perform user authentication
			userService.login(data);

			//If saved, redirect to initially called route
			if ($scope.returnToState) {
					$state.go($scope.returnToState.name, $scope.returnToStateParams);
			} else {
					$state.go('website');
			}
		};
	}
]);