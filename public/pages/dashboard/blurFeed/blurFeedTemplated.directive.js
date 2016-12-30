/**
 * Created by marcozennaro on 13/12/2016.
 */


(function () {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard')
        .directive('blurFeedTemplated', blurFeed);

    /** @ngInject */
    function blurFeed() {
        return {
            restrict: 'E',
            controller: 'BlurFeedCtrlTemplated',
            templateUrl: 'pages/dashboard/blurFeed/blurFeed.html'
        };
    }
})();