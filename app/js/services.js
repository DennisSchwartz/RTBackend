'use strict';

//Perform login operations

//app.factory('loginService', function($http, $location, sessionService) {
//	return {
//		login: function(data, scope) {
//			var $promise = $http.post('api/user.php', data); //send data to user.php
//			$promise.then(function(msg) {
//				var uid = msg.data;
//				if (uid) {
//					//scope.msgtxt='Correct information';
//					sessionService.set('uid', uid);
//					$location.path('/site');
//				} else {
//					scope.msgtxt = 'incorrect information';
//					$location.path('/login');
//				}
//			});
//		},
//		logout: function() {
//			sessionService.destroy('uid');
//			$location.path('/login');
//		},
//		islogged: function() {
//			var $checkSessionServer = $http.post('api/check_session.php');
//			return $checkSessionServer;
//			/*
//			if(sessionService.get('user')) return true;
//			else return false;
//			*/
//		}
//	};
//
//});

// principal is a service that tracks the user's identity. 
// calling identity() returns a promise while it does what you need it to do
// to look up the signed-in user's identity info. for example, it could make an 
// HTTP request to a rest endpoint which returns the user's name, roles, etc.
// after validating an auth token in a cookie. it will only do this identity lookup
// once, when the application first runs. you can force re-request it by calling identity(true)
app.factory('principal', ['$q', '$http', '$timeout', 'sessionService',
  function($q, $http, $timeout, sessionService) {
    var _identity = undefined,
      _authenticated = false;

    return {
      isIdentityResolved: function() {
        return angular.isDefined(_identity);
      },
      isAuthenticated: function() {
        return _authenticated;
      },
      isInRole: function(role) {
        if (!_authenticated || !_identity.roles) return false;

        return _identity.roles.indexOf(role) != -1;
      },
      isInAnyRole: function(roles) {
        if (!_authenticated || !_identity.roles) return false;

        for (var i = 0; i < roles.length; i++) {
          if (this.isInRole(roles[i])) return true;
        }

        return false;
      },
      authenticate: function(identity) {
        _identity = identity;
        _authenticated = identity != null;
        

        var $promise = $http.post('api/user.php', identity); //send data to user.php
			$promise.then(function(msg) {
				var uid = msg.data;
				if (uid) {
					sessionService.set('uid', uid);
				}
			});

        // for this demo, we'll store the identity in localStorage. For you, it could be a cookie, sessionStorage, whatever
        //if (identity) localStorage.setItem("backendApp.identity", angular.toJson(identity));
        //else localStorage.removeItem("demo.identity");
      },
      identity: function(force) {
        var deferred = $q.defer();

        if (force === true) _identity = undefined;

        // check and see if we have retrieved the identity data from the server. if we have, reuse it by immediately resolving
        if (angular.isDefined(_identity)) {
          deferred.resolve(_identity);

          return deferred.promise;
        }

        // otherwise, retrieve the identity data from the server, update the identity object, and then resolve.
        //                   $http.get('/svc/account/identity', { ignoreErrors: true })
        //                        .success(function(data) {
        //                            _identity = data;
        //                            _authenticated = true;
        //                            deferred.resolve(_identity);
        //                        })
        //                        .error(function () {
        //                            _identity = null;
        //                            _authenticated = false;
        //                            deferred.resolve(_identity);
        //                        });

        // for the sake of the demo, we'll attempt to read the identity from localStorage. the example above might be a way if you use cookies or need to retrieve the latest identity from an api
        // i put it in a timeout to illustrate deferred resolution
        var self = this;
        $timeout(function() {
          _identity = sessionService.get(WAS?);
          self.authenticate(_identity);
          deferred.resolve(_identity);
        }, 1000);

        return deferred.promise;
      }
    };
  }
]);


// authorization service's purpose is to wrap up authorize functionality
// it basically just checks to see if the principal is authenticated and checks the root state 
// to see if there is a state that needs to be authorized. if so, it does a role check.
// this is used by the state resolver to make sure when you refresh, hard navigate, or drop onto a
// route, the app resolves your identity before it does an authorize check. after that,
// authorize is called from $stateChangeStart to make sure the principal is allowed to change to
// the desired state
app.factory('authorization', ['$rootScope', '$state', 'principal',
  function($rootScope, $state, principal) {
    return {
      authorize: function() {
        return principal.identity()
          .then(function() {
            var isAuthenticated = principal.isAuthenticated();

            if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && !principal.isInAnyRole($rootScope.toState.data.roles)) {
              if (isAuthenticated) $state.go('login'); // user is signed in but not authorized for desired state
              else {
                // user is not authenticated. stow the state they wanted before you
                // send them to the signin state, so you can return them when you're done
                $rootScope.returnToState = $rootScope.toState;
                $rootScope.returnToStateParams = $rootScope.toStateParams;

                // now, send them to the signin state so they can log in
                $state.go('login');
              }
            }
          });
      }
    };
  }
]);


//modify sessionService

app.factory('sessionService', ['$http', function($http){
	return{
		set:function(key,value){
			return sessionStorage.setItem(key,value);
		},
		get:function(key){
			return sessionStorage.getItem(key);
		},
		destroy:function(key){
			$http.post('api/destroy_session.php');
			return sessionStorage.removeItem(key);
		}
	};
}])