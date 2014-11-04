'use strict';

/* App Modules */

angular.module('Authentication', []);
angular.module('AdminSite', []);

angular.module('BackendApp', [
	'Authentication',
	'AdminSite',
	'ngRoute',
	'ngCookies'
])

.config(['$routeProvider',
	function($routeProvider) {

		$routeProvider
			.when('/login', {
				templateUrl: 'js/modules/auth/partials/login.html',
				controller: 'LoginCtrl',
				hideMenus: true
			})
			.when('/', {
				templateUrl: 'js/modules/admin/partials/site.html',
				controller: 'SiteCtrl'
			})
			.otherwise({
				redirectTo: '/login'
			});
	}
])

.run(['$rootScope', '$location', '$cookieStore', '$http',
	function($rootScope, $location, $cookieStore, $http) {
		//store users in rootScope (--> Safe?)
		$rootScope.globals = $cookieStore.get('globals') || {};
		$rootScope.$on('$routeChangeStart', function(event, next, current) {
			//If user not logged in redirect to login
			if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
				$location.path('/login');
			}
		});
		if ($rootScope.globals.currentUser) {
			$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
		}
	}
]);