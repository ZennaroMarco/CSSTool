(function () {
    'use strict';

    angular.module('BlurAdmin.pages.projects')
        .controller('NewProjectCtrl', WizardCtrl);

    /** @ngInject */
    function WizardCtrl($scope, $http, $filter) {

        var vm = this;
        var string;
        var json;
        var wait4file2load = 1000;

        vm.personalInfo = {};
        vm.productInfo = {};
        vm.shipment = {};



        vm.arePersonalInfoPasswordsEqual = function () {
            return vm.personalInfo.confirmPassword && vm.personalInfo.password == vm.personalInfo.confirmPassword;
        };

        $scope.formData = [];

        $scope.accept = function(idx){
            $scope.showacceptation[idx] = true;
            $scope.showdenied[idx] = false;
        }

        $scope.trasformation = function() {

                var table = $('#app2').tableToJSON({ignoreColumns: [4]});

                var parameter = JSON.stringify(table);


            /*$http.post('/api/v1/project', parameter)
                .success(function(data, status) {
                    // this callback will be called asynchronously
                    // when the response is available
                   // alert("Project created successfully");
                }).
            error(function(data, status, headers, config) {
                //alert("Error: Project not created");
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            }); */

            $http.post('/api/v1/applications', parameter)
                .success(function(data, status) {
                // this callback will be called asynchronously
                // when the response is available
                alert("Project created successfully");
            }).
            error(function(data, status, headers, config) {
                alert("Error: Project not created");
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });

        }

        $scope.templates = [];

        $http.get("/api/v1/template")
            .then(function(response) {

                $scope.templates = (response.data);

                //alert(JSON.stringify($scope.templates[0]));

                $scope.selected = 'No Template';



            });

        $scope.addRow = function(formData){

            alert(JSON.stringify($scope.formData));

            $scope.formData.push({ 'name': formData.name, 'description': formData.description, 'owner': formData.owner, 'technology':formData.technology, 'dato1':formData.dato1, 'dato2':formData.dato2, 'dato3':formData.dato3, 'dato4':formData.dato4 });
            formData.name='';
            formData.owner='';
            formData.technology='';
            formData.dato1='';

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

        $scope.myCSVdata = [];

        $scope.handler=function(e,files){

            var files = e.target.files;

            for (var i = 0, len = files.length; i < len; i++) {
                var file = files[i];

                var reader = new FileReader();

                reader.onload = (function(f) {
                    return function(e) {

                        console.log('e readAsText = ', e);
                        console.log('e readAsText target = ', e.target);
                        try {
                            json = JSON.stringify(e.target.result);

                           // alert('json global var has been set to parsed json of this file here it is unevaled = \n' + json);
                            addRo();

                        } catch (ex) {
                            alert('ex when trying to parse json = ' + ex);
                        }

                    };
                })(file);

                reader.readAsText(file);
            }


        };

        function addRo() {

            json = json.replace(/\\n|\\r\\n|\\r/g, '');
            json = json.replace(/"/g, '');

            var campi = json.split(",");

            for (var i = 0; i < campi.length;) {

                $scope.name=campi[i];
                i++;

                $scope.description = campi[i];
                i++;

                $scope.owner=campi[i];
                i++;
                $scope.technology=campi[i];
                i++;
                $scope.dato1=campi[i];
                i++;

                $scope.formData.push({
                    'name': $scope.name,
                    'description': $scope.description,
                    'owner': $scope.owner,
                    'technology': $scope.technology,
                    'dato1': $scope.dato1

                });

            }

        }

    }

})();

angular.module('BlurAdmin.pages.projects')
    .directive('fileChange', ['$parse', function($parse) {

    return{

        require:'ngModel',

        restrict:'A',

        link:function($scope,element,attrs,ngModel){

            var attrHandler=$parse(attrs['fileChange']);

            var handler=function(e){

                $scope.$apply(function(){

                    attrHandler($scope,{$event:e,files:e.target.files});

                });
            };

            element[0].addEventListener('change',handler,false);
        }
    }
}]);

