'use strict';

/* Controllers */

angular.module('AdminSite')

.controller('SiteCtrl', ['$scope', '$state', 'AuthenticationService',
	function($scope, $state, AuthenticationService) {
		$scope.title = "Adminbereich Home";
		$scope.logout = function() {
			AuthenticationService.clearCredentials();
		};
	}
])
.controller('BookingCtrl', ['$scope', '$state', 
	function ($scope, $state) {
	$scope.title = "Booking";
}])
.controller('GigCtrl', ['$scope', '$state', '$stateParams',
	function ($scope, $state, $stateParams) {
	var data = {  "gigs":[{
      "id": 1,
      "title": "Contest SRH",
      "items": [
        {
          "id": "a",
          "type": "phone number",
          "value": "555-1234-1234"
        },
        {
          "id": "b",
          "type": "email",
          "value": "alice@mailinator.com"
        }
      ]
    },
    {
      "id": 42,
      "title": "Rock am Ring",
      "items": [
        {
          "id": "a",
          "type": "blog",
          "value": "http://bob.blogger.com"
        },
        {
          "id": "b",
          "type": "fax",
          "value": "555-999-9999"
        }
      ]
    },
    {
      "id": 22,
      "title": "Rock im Park",
      "items": [
        {
          "id": "a",
          "type": "blog",
          "value": "http://bob.blogger.com"
        },
        {
          "id": "b",
          "type": "fax",
          "value": "555-999-9999"
        }
      ]
    },
    {
      "id": 123,
      "title": "Wacken",
      "items": [
        {
          "id": "a",
          "type": "full name",
          "value": "Eve Adamsdottir"
        }
      ]
    }
  ]
};
	$scope.gigs = data.gigs;
}]);