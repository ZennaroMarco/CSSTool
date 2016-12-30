/**
 * Created by marcozennaro on 13/12/2016.
 */

(function () {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard')
        .directive('dashboardPieChartApplicazioni', dashboardPieChart);

    /** @ngInject */
    function dashboardPieChart() {
        return {
            restrict: 'E',
            controller: 'DashboardPieChartCtrlApplicazioni',
            templateUrl: 'pages/dashboard/dashboardPieChart/dashboardPieChartNew.html'
        };
    }
})();