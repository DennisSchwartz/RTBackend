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
			//Perform user authentication
			userService.login(data);

			//If saved, redirect to initially called route
			if ($scope.returnToState) {
				$q.when(angular.noop).then(function() {
					$state.go($scope.returnToState.name, $scope.returnToStateParams);
				});
			} else {
				$q.when(angular.noop).then(function() {
					$state.go('website');
				});
			}
		};
	}
]);