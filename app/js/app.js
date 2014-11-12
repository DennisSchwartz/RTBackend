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
			.state('booking', {
				url: '/booking',
				parent: 'common',
				templateUrl: 'partials/modules/admin/booking.html',
				controller: 'BookingCtrl'
			})
			.state('gigs', {
				url: '/gigs',
				parent: 'common',
				templateUrl: 'partials/modules/admin/gigs.html',
				controller: 'GigCtrl'
			})
			.state('gigs.list', {
				url: '/list',
				parent: 'common',
				views: {

					'menu@': {
						templateUrl: 'partials/modules/admin/gigs.menu.html',
						controller: 'GigCtrl'	
					},

					'content@': {
						templateUrl: 'partials/modules/admin/gigs.list.html',
						controller: 'GigCtrl'
					}
				}
			})
			.state('gigs.details', {
				url: '/details',
				parent: 'common',
				views: {

					'menu@': {
						templateUrl: 'partials/modules/admin/gigs.menu.html'
					},

					'content@': {
						templateUrl: 'partials/modules/admin/gigs.details.html'
					}
				}
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