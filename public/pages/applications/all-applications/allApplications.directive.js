/**
 * Created by Marco on 16/12/2016.
 */


(function () {
    'use strict';

    angular.module('BlurAdmin.pages.applications')
        .directive('appApplication', appApplication);

    /** @ngInject */
    function appApplication() {
        return {
            restrict: 'E',
            controller: 'AllApplicationCtrl',
            templateUrl: 'pages/applications/all-applications/all-applications.html'
        };
    }
})();