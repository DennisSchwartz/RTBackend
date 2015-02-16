'use strict';

/* Filters */

angular.module('AdminSite')

.filter('filterEmpty',function(){
    return function(gig) {
        var dataToBePushed = {};
        angular.forEach(gig, function(key, value) {
        	if (value && value != "" && value != " ") {
        		dataToBePushed[key] = value;
        	}
        });
        return dataToBePushed;
    }
});