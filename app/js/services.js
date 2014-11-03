'use strict';

//Store user identity

app.factory('userService', ['$q', '$http', '$state', '$timeout', 'sessionService',
	function($q, $http, $state, $timeout, sessionService) {
		var _identity = null,
			_authenticated = false;

		return {
			isIdResolved: function() {
				return angular.isDefined(_identity);
			},
			isAuthenticated: function() {
				return _authenticated;
			},
			authenticate: function(uid) {
				_identity = uid;
				_authenticated = uid != null;

				if (uid) {
					//save user id to sessionStorage
					sessionService.set('uid', uid);
				}
			},
			login: function(data) {
				var deferred = $q.defer();
				console.log(data);
				console.log("Login Function of userService called!");
				$setTimeout(function() {
					console.log('TIMEOUT');
				}, 10000);
				//if user is already logged in, return promise
				if (angular.isDefined(_identity)) {
					deferred.resolve(_identity);
					return deferred.promise;
				}

				$http.post('api/user.php', data)
					.then(function(msg) {
						var uid = msg.data;
						console.log("Response from user.php:");
						console.log(msg);
						if (uid) {
							_identity = uid;
							_authenticated = true;
							deferred.resolve(_identity);
						} else {
							_identity = null;
							_authenticated = false;
							deferred.resolve(_identity);
						}
					});

				$setTimeout(function() {}, 10000);
				var self = this;	
				//self.authenticate(_identity);
				return deferred.promise;
			},
			logout: function() {
				sessionService.destroy(_identity);
				_identity = null;
				_authenticated = false;
			}
		};
	}
]);


app.factory('authService', ['$rootScope', '$state', 'userService',
	function($rootScope, $state, userService) {
		return {
			authorize: function() {
				return userService.login()
					.then(function() {
						var isAuthenticated = userService.isAuthenticated();
						if (!isAuthenticated) {
							$state.go('login');
						}
					});
			}
		};
	}
]);

app.factory('sessionService', ['$http',
	function($http) {
		return {
			set: function(key, value) {
				return sessionStorage.setItem(key, value);
			},
			get: function(key) {
				return sessionStorage.getItem(key);
			},
			destroy: function(key) {
				$http.post('api/destroy_session.php');
				return sessionStorage.removeItem(key);
			}
		};
	}
]);