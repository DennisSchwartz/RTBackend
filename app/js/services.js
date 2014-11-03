'use strict';

//Perform login operations

app.factory('loginService', function($http, $location, sessionService) {
	return {
		login: function(data, scope) {
			var $promise = $http.post('api/user.php', data); //send data to user.php
			$promise.then(function(msg) {
				var uid = msg.data;
				if (uid) {
					//scope.msgtxt='Correct information';
					sessionService.set('uid', uid);
					$location.path('/site');
				} else {
					scope.msgtxt = 'incorrect information';
					$location.path('/login');
				}
			});
		},
		logout: function() {
			sessionService.destroy('uid');
			$location.path('/login');
		},
		islogged: function() {
			var $checkSessionServer = $http.post('api/check_session.php');
			return $checkSessionServer;
			/*
			if(sessionService.get('user')) return true;
			else return false;
			*/
		}
	};

});


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