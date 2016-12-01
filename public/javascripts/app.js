/**
 * Created by marcozennaro on 27/11/2016.
 */

var MyApp = angular.module('MyApp', []);

MyApp.controller('formCtrl', function($scope, $http) {

    $scope.formData =  [];

    $scope.processForm = function() {
        $http.post('/api/todos', $scope.formData)
            .success(function(data) {
                $scope.formData = {};
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.accept = function(idx){
        $scope.showacceptation[idx] = true;
        $scope.showdenied[idx] = false;
    }

    $scope.addRow = function(){
        $scope.formData.push({ 'name':$scope.name, 'owner': $scope.owner, 'technology':$scope.technology, 'dato1':$scope.dato1, 'dato2':$scope.dato2, 'dato3':$scope.dato3, 'dato4':$scope.dato4 });
        $scope.name='';
        $scope.owner='';
        $scope.technology='';
        $scope.dato1='';
        $scope.dato2='';
        $scope.dato3='';
        $scope.dato4='';
    };

    $scope.checkAll = function () {
        if (!$scope.selectedAll) {
            $scope.selectedAll = true;
        } else {
            $scope.selectedAll = false;
        }
        angular.forEach($scope.formData, function (formData) {
            formData.selected = $scope.selectedAll;
        });
    };

    $scope.remove = function(){
        var newDataList=[];
        $scope.selectedAll = false;
        angular.forEach($scope.formData, function(selected){
            if(!selected.selected){
                newDataList.push(selected);
            }
        });
        $scope.formData = newDataList;
    };
});


MyApp.directive('fileReader', function() {
    return {
        scope: {
            fileReader:"="
        },
        link: function(scope, element) {
            $(element).on('change', function(changeEvent) {
                var files = changeEvent.target.files;
                if (files.length) {
                    var r = new FileReader();
                    r.onload = function(e) {
                        var contents = e.target.result;
                        scope.$apply(function () {
                            scope.fileReader = contents;
                        });
                    };

                    r.readAsText(files[0]);
                }
            });
        }
    };
});



