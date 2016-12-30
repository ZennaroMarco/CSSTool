(function () {
    'use strict';

    angular.module('BlurAdmin.pages.projects',[])
        .config(routeConfig);

    /** @ngInject */

    function routeConfig($stateProvider) {
        $stateProvider
            .state('projects', {
                url: '/projects',
                templateUrl: 'pages/projects/projects.html',
                abstract: true,
                title: 'Projects',
                sidebarMeta: {
                    icon: 'ion-ios-location-outline',
                    order: 500,
                },
            })

            .state('projects.new-project', {
                url: '/new-project',
                templateUrl: 'pages/projects/new-project/new-project.html',
                controller: 'NewProjectCtrl',
                title: 'New Project',
                sidebarMeta: {
                    order: 0,
                },
            })
    }

})();
