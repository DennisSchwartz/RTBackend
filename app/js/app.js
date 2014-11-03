'use strict';

//// Declare app level module which depends on views, and components
//angular.module('myApp', [
//	'ngRoute',
//	'myApp.view1',
//	'myApp.view2',
//	'myApp.version'
//]).
//config(['$routeProvider',
//	function($routeProvider) {
//		$routeProvider.otherwise({
//			redirectTo: '/view1'
//		});
//	}
//]);

var app = angular.module('backendApp', [
	'ui.bootstrap',
	'ui.bootstrap.tpls',
	'ui.router',
	'backendControllers'
]);

app.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
		$stateProvider.
			state('site', {
			url: "/",
			templateUrl: 'partials/site.html',
			controller: 'siteCtrl',
			data: {},
		}).
			state('events', {
			url: "/events",
			templateUrl: 'partials/events.html',
			controller: 'eventsCtrl',
			data: {}
		}).
			state('social', {
			url: "/social",
			templateUrl: 'partials/social.html',
			controller: 'socialCtrl',
			data: {}
		}).
			state('login', {
			url: "/login",
			templateUrl: 'partials/login.html',
			controller: 'loginCtrl',
			data: {}
		});
	}
]);

app.run(function($rootScope, $location, loginService) {
	var routespermission = ['/site', '/events', '/social']; //routes that require login
	$rootScope.$on('$stateChangeStart', function(event, next) {
		if (true) {				//routespermission.indexOf(next) != -1) {
			if (!loginService.islogged()) {
				event.preventDefault();
			}
		}
	});
});