/**
 * Created by marcozennaro on 13/12/2016.
 */


(function () {
    'use strict';

    angular.module('BlurAdmin.pages.applications')
        .directive('templatedApplications', blurFeed);

    /** @ngInject */
    function blurFeed() {
        return {
            restrict: 'E',
            controller: 'BlurFeedCtrlTemplated2',
            templateUrl: 'pages/dashboard/blurFeed/blurFeedTemplated.html'
        };
    }
})();