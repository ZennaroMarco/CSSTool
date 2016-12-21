/**
 * Created by marcozennaro on 13/12/2016.
 */


(function () {
    'use strict';

    angular.module('BlurAdmin.pages.applications')
        .directive('incompleteApplications', blurFeed);

    /** @ngInject */
    function blurFeed() {
        return {
            restrict: 'E',
            controller: 'IncompleteApplicationsCtrl',
            templateUrl: 'pages/applications/incomplete-applications/incomplete-applications.html'
        };
    }
})();