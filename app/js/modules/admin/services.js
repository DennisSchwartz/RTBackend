'use strict';

/* AdminSite services */


angular.module('AdminSite')

.factory('DatabaseService', ['$http',
	function($http) {
		var serviceBase = 'api/';
		var service = {};

		service.getGigs = function() {
			return $http.get('api/gigs');
		};

		service.getGig = function(gigId) {
			return $http.get('api/gig?id=' + gigId);
		};

		service.getEvents = function() {
			//return $http.get(serviceBase + 'events');

			var eventSources = [{
				events: [{
					title: 'Event1',
					start: '2014-11-08'
				}, {
					title: 'Event2',
					start: '2014-12-05'
				}],
				color: 'yellow', // an option!
				textColor: 'black' // an option!
			}];

			return eventSources;

		};

		service.getEvent = function(eventID) {
			return $http.get(serviceBase + 'event?id=' + eventID);
		};

		service.insertEvent = function(event) {
			return $http.post(serviceBase + 'insertEvent', event)
				.then(function(results) {
					return results;
				});
		};

		service.updateEvent = function(id, event) {
			return $http.post(serviceBase + 'updateEvent', {
					id: id,
					customer: customer
				})
				.then(function(status) {
					return status.data;
				});
		};

		service.deleteEvent = function(id) {
			return $http.post(serviceBase + 'deleteEvent?id=' + id)
				.then(function(status) {
					return status.data;
				});
		};

		return service;
	}
]);