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
		state('root', {
			'abstract': true,
			resolve: {
				authorize: ['authorization',
					function(authorization) {
						return authorization.authorize();
					}
				]
			}
		}).
		state('site', {
			parent: 'root',
			url: "/",
			data: {},
			views: {
				'content@': {
					templateUrl: 'partials/site.html',
					controller: 'siteCtrl'
				}
			}
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

app.run(function($rootScope, $location, principal, authorization) {
	var routespermission = ['/site', '/events', '/social']; //routes that require login
	$rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
		$rootScope.toState = toState;
		$rootScope.toStateParams = toStateParams;

		if (principal.isIdentityResolved()) authorization.authorize();
	});
});