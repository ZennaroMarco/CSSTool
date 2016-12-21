/**
 * Created by marcozennaro on 13/12/2016.
 */


(function () {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard')
        .directive('blurFeedIncomplete2', blurFeed);

    /** @ngInject */
    function blurFeed() {
        return {
            restrict: 'E',
            controller: 'BlurFeedCtrlIncomplete2',
            templateUrl: 'pages/dashboard/blurFeed/blurFeedIncomplete.html'
        };
    }
})();