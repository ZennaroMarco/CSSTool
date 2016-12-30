/**
 * Created by marcozennaro on 13/12/2016.
 */


(function () {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard')
        .directive('blurFeedCompleted2', blurFeed);

    /** @ngInject */
    function blurFeed() {
        return {
            restrict: 'E',
            controller: 'BlurFeedCtrlCompleted2',
            templateUrl: 'pages/dashboard/blurFeed/blurFeedCompleted.html'
        };
    }
})();