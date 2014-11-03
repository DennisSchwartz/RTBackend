'use strict';

//Store user identity

app.factory('userService', ['$q', '$http', '$state', '$timeout',
	function($q, $http, $state, $timeout) {
		var _identity = undefined,
			_authenticated = false;

		return {
			isIdResolved: function() {
				return angular.isDefined(_identity);
			},
			isAuthenticated: function() {
				return _authenticated;
			},
			login: function(data) {
				var deferred = $q.defer();

				//if user is already logged in, return promise
				if (angular.isDefined(data)) {
					deferred.resolve(_identity);
					return deferred.promise;
				}

				$http.post('api/user.php', data)
					.then(function(msg) {
						var uid = msg.data;
						if (uid) {
							//save user id to sessionStorage
							sessionService.set(uid);
							_identity = uid;
							_authenticated = true;
							deferred.resolve(_identity);
						} else {
							_identity = null;
							_authenticated = false;
							deferred.resolve(_identity);
						}
					});
				return deferred.promise;
			},
			logout: function() {
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
				return userService.identity()
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