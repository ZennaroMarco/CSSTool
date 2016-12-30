/**
 * Created by marcozennaro on 13/12/2016.
 */


(function () {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard')
        .directive('blurFeedIncomplete', blurFeed);

    /** @ngInject */
    function blurFeed() {
        return {
            restrict: 'E',
            controller: 'BlurFeedCtrlIncomplete',
            templateUrl: 'pages/dashboard/blurFeed/blurFeed.html'
        };
    }
})();