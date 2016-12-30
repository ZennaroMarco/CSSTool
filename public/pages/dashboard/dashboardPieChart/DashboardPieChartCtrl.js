/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
      .controller('DashboardPieChartCtrl', DashboardPieChartCtrl);

  /** @ngInject */
  function DashboardPieChartCtrl($scope, $timeout, baConfig, baUtil) {
    var pieColor = baUtil.hexToRGB(baConfig.colors.defaultText, 0.2);

    $scope.charts = [ {
      color: pieColor,
      description: 'Completed',
      stats: '# 50',
      icon: 'face',
    }, {
      color: pieColor,
      description: 'Incomplete',
      stats: '# 400',
      icon: 'refresh',
    }
    ];

      $scope.charts2 = [{
          description: 'Applications',
          stats: '# 570',
          icon: 'person'
      },

    ];

    function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }



      $scope.flip2 = function(id) {

          $(id).flip({
              axis: 'y',
              trigger: 'click'
          });


      }


    function loadPieCharts() {
      $('.chart').each(function () {
        var chart = $(this);
        chart.easyPieChart({
          easing: 'easeOutBounce',
          onStep: function (from, to, percent) {
            $(this.el).find('.percent').text(Math.round(percent));
          },
          barColor: chart.attr('rel'),
          trackColor: 'rgba(0,0,0,0)',
          size: 84,
          scaleLength: 0,
          animation: 2000,
          lineWidth: 9,
          lineCap: 'round',
        });
      });

      $('.refresh-data').on('click', function () {
        updatePieCharts();
      });
    }

   /* function updatePieCharts() {
      $('.pie-charts .chart').each(function(index, chart) {
        $(chart).data('easyPieChart').update(getRandomArbitrary(55, 90));
      });
    } */

    $timeout(function () {
      loadPieCharts();
      updatePieCharts();
    }, 1000);
  }
})();