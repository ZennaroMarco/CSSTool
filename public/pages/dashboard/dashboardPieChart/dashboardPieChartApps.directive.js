/**
 * Created by marcozennaro on 14/12/2016.
 */

(function () {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard')
        .directive('dashboardPieChartApps', dashboardPieChart);

    /** @ngInject */
    function dashboardPieChart() {
        return {
            restrict: 'E',
            controller: 'DashboardPieChartCtrlApps',
            templateUrl: 'pages/dashboard/dashboardPieChart/dashboardPieChartNew.html'
        };
    }
})();