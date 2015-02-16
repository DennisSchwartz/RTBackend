'use strict';

/* App Modules */

angular.module('Authentication', []);
angular.module('AdminSite', []);

angular.module('BackendApp', [
	'Authentication',
	'AdminSite',
	'ui.router',
	'ui.calendar',
	'ui.bootstrap',
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
				templateUrl: 'partials/modules/admin/gigs.list.html'
			})
			.state('gigs.add', {
				url: '/add',
				templateUrl: 'partials/modules/admin/gigs.add.html',
				controller: 'CalendarCtrl'
			})
			.state('gigs.details', {
				url: '/:gigId',
				templateUrl: 'partials/modules/admin/gigs.details.html',
				controller: 'DetailCtrl'
				//controller: function ($scope, $stateParams) {
				//	$scope.gig = {};
				//	$scope.gig.name = $stateParams.gigId;
				//}
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