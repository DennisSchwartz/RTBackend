'use strict';

/* Controllers */

var backendControllers = angular.module('backendControllers', []);

backendControllers.controller('loginCtrl', ['$scope', '$state', 'principal', function($scope, $state, principal) {
	$scope.login=function(user) {
		principal.authenticate(user);
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
