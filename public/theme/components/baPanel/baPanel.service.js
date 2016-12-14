/**
 * @author v.lugovsky
 * created on 23.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
      .factory('baPanel', baPanel);

  /** @ngInject */
  function baPanel() {

    /** Base baPanel directive */
    return {
      restrict: 'A',
      transclude: true,
      template: function(elem, attrs) {
        var res = '<div class="panel-body" ng-transclude></div>';

        if (attrs.baPanelTitle && attrs.baPanelTitle == "Applications") {

          var titleTpl = '<div class="panel-heading clearfix"><h3 class="panel-title">' + attrs.baPanelTitle + '</h3>' +
              '<button type="button" class="btn btn-default btn-icon" id="unflip-btn" style="float: left; margin-top: -25px; margin-left: -10px;"><i class="ion-arrow-left-c" style="color: red"></i></button></div>';

          res = titleTpl + res; // title should be before
        }

         else if (attrs.baPanelTitle && attrs.baPanelTitle == "Templated apps") {

              var titleTpl = '<div class="panel-heading clearfix"><h3 class="panel-title">' + attrs.baPanelTitle + '</h3>' +
                  '<button type="button" class="btn btn-default btn-icon" id="unflip-btn2" style="float: left; margin-top: -25px; margin-left: -10px;"><i class="ion-arrow-left-c" style="color: red"></i></button></div>';

              res = titleTpl + res; // title should be before
          }

        else if (attrs.baPanelTitle && attrs.baPanelTitle == "Completed Apps") {

            var titleTpl = '<div class="panel-heading clearfix"><h3 class="panel-title">' + attrs.baPanelTitle + '</h3>' +
                '<button type="button" class="btn btn-default btn-icon" id="unflip-btn3" style="float: left; margin-top: -25px; margin-left: -10px;"><i class="ion-arrow-left-c" style="color: red"></i></button></div>';

            res = titleTpl + res; // title should be before
        }

        else if (attrs.baPanelTitle && attrs.baPanelTitle == "Incomplete Apps") {

            var titleTpl = '<div class="panel-heading clearfix"><h3 class="panel-title">' + attrs.baPanelTitle + '</h3>' +
                '<button type="button" class="btn btn-default btn-icon" id="unflip-btn4" style="float: left; margin-top: -25px; margin-left: -10px;"><i class="ion-arrow-left-c" style="color: red"></i></button></div>';

            res = titleTpl + res; // title should be before
        }

        else if (attrs.baPanelTitle) {

            var titleTpl = '<div class="panel-heading clearfix"><h3 class="panel-title">' + attrs.baPanelTitle + '</h3></div>';

            res = titleTpl + res; // title should be before


        }

        return res;
      }
    };
  }

})();
