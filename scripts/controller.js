'use strict';

function NavCtrl(s) {
}


function RedditCtrl(s) {
}
function ReferenceCtrl(s) {
}
angular.module('Dashboard.dashboardcontroller',[])
.controller('NavCtrl', ['$scope', NavCtrl])
.controller('ReferenceCtrl', ['$scope', ReferenceCtrl])
.controller('RedditCtrl', ['$scope', RedditCtrl])
