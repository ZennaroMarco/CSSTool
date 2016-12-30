(function () {
    'use strict';

    angular.module('BlurAdmin.pages.applications', [])
        .config(routeConfig);

    /** @ngInject */

    function routeConfig($stateProvider) {
     $stateProvider
     .state('applications', {
     url: '/applications',
     templateUrl: 'pages/applications/applications.html',
     abstract: true,
     title: 'Applications',
     sidebarMeta: {
     icon: 'ion-ios-location-outline',
     order: 500,
     },
     })
     .state('applications.all-applications', {
     url: '/all-applications',
     templateUrl: 'pages/applications/all-applications/all-applications.html',
     controller: 'AllApplicationsCtrl',
     title: 'Applications',
     sidebarMeta: {
     order: 0,
     },
     })
     .state('applications.templated-applications', {
     url: '/templated-applications',
     templateUrl: 'pages/applications/templated-applications/templated-applications.html',
     controller: 'TemplatedApplicationsCtrl',
     title: 'Templated Apps',
     sidebarMeta: {
     order: 100,
     },
     })
         .state('applications.completed-applications', {
             url: '/completed-applications',
             templateUrl: 'pages/applications/completed-applications/completed-applications.html',
             controller: 'CompletedApplicationsCtrl',
             title: 'Completed Apps',
             sidebarMeta: {
     order: 200,
     },
     })
     .state('applications.incomplete-applications', {
     url: '/incomplete-applications',
     templateUrl: 'pages/applications/incomplete-applications/incomplete-applications.html',
     controller: 'IncompleteApplicationsCtrl',
     title: 'Incomplete Apps',
     sidebarMeta: {
     order: 300,
     },
     });
     }

})();
