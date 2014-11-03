'use strict';

/* App Module */

var app = angular.module('backendApp', [
	'ui.router',
	'ui.bootstrap',
	'ui.bootstrap.tpls',
	'backendControllers'
]);

app.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/login');

		$stateProvider.state('site', {
			'abstract': true,
			resolve: {
				authorize: ['authService',
					function() {
						return authService.authorize();
					}
				]
			}
		}).
		state('website', {
			parent: 'site',
			url: '/website',
			data: {},
			views: {
				'content@': {
					templateUrl: 'partials/site.html',
					controler: 'websiteCtrl'
				}
			}
		}).
		state('login', {
			//parent: 'site',
			url: '/login',
			data: {},
			views: {
				'content@': {
					templateUrl: 'partials/login.html',
					controler: 'loginCtrl'
				}
			}
		});
	}
]);


app.run(['$rootScope', '$state', '$stateParams', 'userService', 'sessionService', 'authService',
	function($rootScope, $state, $stateParams, userService, sessionService, authService) {
		$rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
			$rootScope.toState = toState;
			$rootScope.toStateParams = toStateParams;
			console.log('TEST!');
			//event.preventDefault();
			if (userService.isIdResolved()) {
				console.log('User ID is resolved!');
				authService.authorize();
			}
		});
	}
]);