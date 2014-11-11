'use strict';

/* App Modules */

angular.module('Authentication', []);
angular.module('AdminSite', []);

angular.module('BackendApp', [
	'Authentication',
	'AdminSite',
	'ui.router',
	'ngCookies'
])

.config(['$stateProvider', '$urlRouterProvider', 
	function($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/login');
		$stateProvider
			.state('common', {
				templateUrl: 'partials/tpl/tpl.common.html',
				controller: 'SiteCtrl',
				abstract: true
			})
			.state('login', {
				url: '/login',
				templateUrl: 'partials/modules/auth/login.html',
				controller: 'LoginCtrl'
			})
			.state('home', {
				url: '/',
				parent: 'common',
				templateUrl: 'partials/modules/admin/site.html',
				controller: 'SiteCtrl'
			})
			.state('events', {
				url: '/events',
				parent: 'common',
				templateUrl: 'partials/modules/admin/events.html',
				controller: 'EventCtrl'
			})
			.state('events.gigs', {
				url: '/gigs',
				templateUrl: 'partials/modules/admin/events-gigs.html',
				controller: 'EventCtrl'
			})
			.state('events.bands', {
				url: '/bands',
				templateUrl: 'partials/modules/admin/events-bands.html',
				controller: 'EventCtrl'
			});
	}
])

.run(['$rootScope', '$state', '$location', '$cookieStore', '$http',
	function($rootScope, $state, $location, $cookieStore, $http) {
		//store users in rootScope (--> Safe?)
		$rootScope.globals = $cookieStore.get($http.defaults.headers.common.Authorization) || {};
		$rootScope.$on('$stateChangeStart', function(event, next, current) {
			//If user not logged in redirect to login
			if ($location.path() !== '/login' && !$rootScope.globals) {
				$location.path('/login');
			}
		});
		if ($rootScope.globals.currentUser) {
			$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
		}
	}
]);