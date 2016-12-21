/**
 * Created by marcozennaro on 13/12/2016.
 */


(function () {
    'use strict';

    angular.module('BlurAdmin.pages.projects')
        .directive('newProject', projectWizard);

    /** @ngInject */
    function projectWizard() {
        return {
            restrict: 'E',
            controller: 'NewProjectCtrl',
            templateUrl: 'pages/projects/new-project/new-project.html'
        };
    }
})();