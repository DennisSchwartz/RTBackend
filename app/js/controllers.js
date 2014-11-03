'use strict';

/* Controllers */

var backendControllers = angular.module('backendControllers', []);

backendControllers.controller('loginCtrl', ['$scope', 'loginService', function($scope, loginService) {
	$scope.login=function(data) {
		loginService.login(data, $scope);
	};
}]);

backendControllers.controller('siteCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.title = "Website Pflege";
}]);

backendControllers.controller('eventsCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.title = "Events";
}]);

backendControllers.controller('socialCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.title = "Social Media";
}]);
