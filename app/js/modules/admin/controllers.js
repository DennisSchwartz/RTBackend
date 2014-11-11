'use strict';

/* Controllers */

angular.module('AdminSite')

.controller('SiteCtrl', ['$scope', '$state', 'AuthenticationService',
	function($scope, $state, AuthenticationService) {
		$scope.title = "Adminbereich Home";
		$scope.logout = function() {
			AuthenticationService.clearCredentials();
		};
	}
])
.controller('EventCtrl', ['$scope', '$state', 
	function ($scope, $state) {
	$scope.title = "Events";
	$scope.gigs = ['Test', 'Rock am Ring', 'Wacken'];
}]);