'use strict';

angular.module('Authentication')

.factory('AuthenticationService', ['Base64', '$http', '$cookieStore', '$rootScope', '$timeout',
	function(Base64, $http, $cookieStore, $rootScope, $timeout) {
		var service = {};
		service.login = function(data, callback) {

			var username = data.name;
			var password = data.pass;

			/* Temp solution */
			/* Dummy authentication for testing, uses $timeout to simulate api call ----------------------------------------------*/
			//$timeout(function() {
			//	var response = {
			//		success: username === 'test' && password === 'test'
			//	};
			//	if (!response.success) {
			//		response.message = 'Username or password is incorrect';
			//	}
			//	callback(response);
			//}, 1000);


			/* Use this for real authentication ----------------------------------------------------------------------------------*/

			$http.post('api/login', data)
				.success(function (response) {
					console.log(response);
					callback(response);
				}).error(function (response) {
					console.log(response);
					callback(response);
				});


			/* TODO: Add .error in case the auth fails --*/
		};

		service.setCredentials = function(username, password) {
			var authdata = Base64.encode(username + ':' + password);

			$rootScope.globals = {
				currentUser: {
					username: username,
					authdata: authdata
				}
			};

			$http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
			$cookieStore.put('globals', $rootScope.globals);
		};

		service.clearCredentials = function () {
			delete $rootScope.globals;
			$cookieStore.remove('globals');
			$http.defaults.headers.common.Authorization = 'Basic';
		};

		return service;
	}
])


.factory('DatabaseService', ['$http',
	function ($http) {
		var serviceBase = 'api/';
		var service = {};

		service.getEvents = function () {
			return $http.get(serviceBase + 'events');
		};

		service.getEvent = function (eventID) {
			return $http.get(serviceBase + 'event?id=' + eventID);
		};

		service.insertEvent = function (event) {
			return $http.post(serviceBase + 'insertEvent', event)
				.then(function (results) {
					return results;
			});
		};

		service.updateEvent = function (id, event) {
			return $http.post(serviceBase + 'updateEvent', {id:id, customer:customer})
				.then(function (status) {
					return status.data;
				});
		};

		service.deleteEvent = function (id) {
			return $http.post(serviceBase + 'deleteEvent?id=' + id)
				.then(function (status) {
					return status.data;
				});
		};

	return service;
}])


.factory('Base64', function() {
	/* jshint ignore:start */

	var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

	return {
		encode: function(input) {
			var output = "";
			var chr1, chr2, chr3 = "";
			var enc1, enc2, enc3, enc4 = "";
			var i = 0;

			do {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);

				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;

				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}

				output = output +
					keyStr.charAt(enc1) +
					keyStr.charAt(enc2) +
					keyStr.charAt(enc3) +
					keyStr.charAt(enc4);
				chr1 = chr2 = chr3 = "";
				enc1 = enc2 = enc3 = enc4 = "";
			} while (i < input.length);

			return output;
		},

		decode: function(input) {
			var output = "";
			var chr1, chr2, chr3 = "";
			var enc1, enc2, enc3, enc4 = "";
			var i = 0;

			// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
			var base64test = /[^A-Za-z0-9\+\/\=]/g;
			if (base64test.exec(input)) {
				window.alert("There were invalid base64 characters in the input text.\n" +
					"Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
					"Expect errors in decoding.");
			}
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

			do {
				enc1 = keyStr.indexOf(input.charAt(i++));
				enc2 = keyStr.indexOf(input.charAt(i++));
				enc3 = keyStr.indexOf(input.charAt(i++));
				enc4 = keyStr.indexOf(input.charAt(i++));

				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;

				output = output + String.fromCharCode(chr1);

				if (enc3 != 64) {
					output = output + String.fromCharCode(chr2);
				}
				if (enc4 != 64) {
					output = output + String.fromCharCode(chr3);
				}

				chr1 = chr2 = chr3 = "";
				enc1 = enc2 = enc3 = enc4 = "";

			} while (i < input.length);

			return output;
		}
	};

	/* jshint ignore:end */
});