'use strict';

/* Controllers */

angular.module('AdminSite')

.controller('SiteCtrl', ['$scope', 'AuthenticationService',
	function($scope, AuthenticationService) {
		$scope.title = "Adminbereich Home";
		$scope.logout = function() {
			AuthenticationService.clearCredentials();
		};
	}
]);