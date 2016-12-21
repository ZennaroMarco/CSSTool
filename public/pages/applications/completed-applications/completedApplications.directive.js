/**
 * Created by marcozennaro on 13/12/2016.
 */


(function () {
    'use strict';

    angular.module('BlurAdmin.pages.applications')
        .directive('completedApplications', blurFeed);

    /** @ngInject */
    function blurFeed() {
        return {
            restrict: 'E',
            controller: 'CompletedApplicationsCtrl',
            templateUrl: 'pages/applications/completed-applications/completed-applications.html'
        };
    }
})();