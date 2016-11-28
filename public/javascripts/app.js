/**
 * Created by marcozennaro on 27/11/2016.
 */

angular.module('untitled', ['ngAnimate', 'ui.router'])

.config(function($stateProvider,$urlRouterProvider) {

    $stateProvider

        .state('form', {

            url: '/form',
            templateUrl: 'form.html',
            controller: 'formCtrl'
        })

        .state('form.instructions', {

            url: '/instructions',
            templateUrl: 'form-instructions.html'
        })

        .state('form.applications', {

            url: '/applications',
            templateUrl: 'form-applications.html'

        })

        .state('form.models' , {


            url: '/models',
            templateUrl: 'form-models.html'

        });


    $urlRouterProvider.otherwise('/form');


    })

.controller('formCtrl', function($scope) {

    $scope.formData = {};
    $scope.processForm = function() {

        alert("Awesome!");
    };

});