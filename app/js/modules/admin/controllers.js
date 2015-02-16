'use strict';

/* Controllers */

angular.module('AdminSite')

.controller('SiteCtrl', ['$scope', '$state', '$stateParams', 'AuthenticationService', 'DatabaseService',
        function($scope, $state, $stateParams, AuthenticationService, DatabaseService) {
            $scope.title = "Adminbereich Home";
            $scope.logout = function() {
                AuthenticationService.clearCredentials();
            };
            /* &&&&&&& Get gigs from database  &&&&&&&
            DatabaseService.getGigs().then(function(data) {
                $scope.gigs = data.data;
                console.log($scope.gigs);
            });
            $scope.eventSources = DatabaseService.getEvents();
            $scope.quantity = 3;
            */
        }
    ])
    .controller('BookingCtrl', ['$scope', '$state',
        function($scope, $state) {
            $scope.title = "Booking";
        }
    ])
    .controller('GigCtrl', ['$scope', '$state', '$stateParams', 'DatabaseService',
        function($scope, $state, $stateParams, DatabaseService) {

            /* &&&&&&& Get gigs from database  &&&&&&& */
            DatabaseService.getGigs().then(function(data) {
                $scope.gigs = data.data;
                console.log($scope.gigs);
            });

            /* &&&&&&& How are gigs ordered? &&&&&&& */
            $scope.orderProp = '-terminpos';
            $scope.quantity = 3;


            /* &&&&&&& Dummy events for calendar &&&&&&& */
            $scope.eventSources = DatabaseService.getEvents();

            /* &&&&&&& Set gig ID &&&&&&& */
            $scope.gig = {};
            $scope.gig.name = $stateParams.gigId;
            //console.log($scope.gig);

        }
    ])
    .controller('DetailCtrl', ['$scope', '$state', '$stateParams', 'DatabaseService',
        function($scope, $state, $stateParams, DatabaseService) {

            $scope.gigId = $stateParams.gigId;

            var promise = DatabaseService.getGig($scope.gigId);

            promise.then(
                function(data) {
                    $scope.gig = data.data;
                    console.log('Success!');
                    console.log($scope.gig);
                },
                function(errorData) {
                    console.log(errorData);
                    console.log('Failure!');
                    $scope.error = "Error loading gig details!";
                });

            //Extraced Filter to use on arrays
            //Filter out empty key-value pairs
            $scope.filterEmpty = function(gig) {
                var result = {};
                angular.forEach(gig, function(value, key) {
                    if (value && value != "" && value != " " && key != "terminpos" && key != "id") {
                        switch(key) {
                            case "event2":
                                $scope.gigTitle = value;
                                break;
                            case "termin":
                                $scope.gigTermin = value;
                                break;
                            case "location":
                                $scope.gigLocation = value;
                                break;
                            case "bandtausch":
                                key = "Austausch Gig";
                                result[key] = value;
                                break;
                            case "kontakt":
                                key = "Datum Erstkontakt";
                                result[key] = value;
                                break;
                            case "status":
                                key = "Status";
                                result[key] = value;
                                break;
                            default:
                                result[key] = value;
                        }
                    }
                });
                return result;
            }

        }
    ])
    .controller('CalendarCtrl', ['$scope', '$compile', 'DatabaseService',
        function($scope, $compile, DatabaseService) {

            $scope.date = new Date();

            $scope.save = function (data) {
                console.log(data);
            };

            /* &&&&&&& Dummy events for calendar &&&&&&& */
            $scope.eventSources = DatabaseService.getEvents();

            /* config object */
            $scope.uiConfig = {
                calendar: {
                    height: 500,
                    editable: true,
                    header: {
                        left: 'month agendaWeek agendaDay',
                        center: 'title',
                        right: 'today prev,next'
                    },
                    titleFormat: {
                        month: 'MMMM yyyy', // September 2009
                        week: 'W', // Sep 7 - 13 2009
                        day: 'ddd, d MMM yy' //
                    },
                    timeFormat: 'H:mm',
                    dayClick: $scope.alertEventOnClick,
                    eventDrop: $scope.alertOnDrop,
                    eventResize: $scope.alertOnResize
                }
            };



            /* alert on eventClick */
            $scope.alertOnEventClick = function(date, jsEvent, view) {
                $scope.alertMessage = (date.title + ' was clicked ');
            };
            /* alert on Drop */
            $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view) {
                $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
            };
            /* alert on Resize */
            $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view) {
                $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
            };

            /* add new gig*/
            $scope.insertGig = function(newGig) {
                DatabaseService.insertEvent(newGig);
                $scope.eventSources.events.push(newGig);
            };
            $scope.back = function() {
                window.history.back();
            }
            /* remove event */
            $scope.remove = function(index) {
                $scope.events.splice(index, 1);
            };



        }
    ]);