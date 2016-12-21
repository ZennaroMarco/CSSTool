/**
 * Created by marcozennaro on 27/11/2016.
 */

var MyApp = angular.module('MyApp', []);

MyApp.controller('formCtrl', function($scope, $http, $filter) {

    var string;
    var json;
    var wait4file2load = 1000;


    $scope.formData =  [];


    $http.get('/api/v1/template').then(
        function successCallback(data) {

           //$scope.template = data.name

           // alert("Ecco i dati" + data[0].name );
        },

        function errorCallback(data) {

            alert("error" + JSON.stringify(data));
        }
    );

    $scope.parJson = function (json) {
        return JSON.parse(json);
    }

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

        alert(JSON.stringify($scope.formData));

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

    $scope.myCSVdata = [];

    $scope.handler=function(e,files){

        alert("ciao");


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

                        //alert('json global var has been set to parsed json of this file here it is unevaled = \n' + json);
                        addRo();

                    } catch (ex) {
                        alert('ex when trying to parse json = ' + ex);
                    }

                    // Here you can use `e.target.result` or `this.result`
                    // and `f.name`.
                };
            })(file);

            //calling to access the 'contents' variable
            reader.readAsText(file);
        }


    };

    function accessFileContents(){

        //setTimeout(function() { addRo(); }, wait4file2load);

    }

    function addRo() {

        json = json.replace(/\\n|\\r\\n|\\r/g, '');
        json = json.replace(/"/g, '');
        alert("ciao");

        var campi = json.split(",");

        for (var i = 0; i < campi.length;) {

            $scope.name=campi[i];
            i++;
            $scope.owner=campi[i];
            i++;
            $scope.technology=campi[i];
            i++;
            $scope.dato1=campi[i];
            i++;
            $scope.dato2=campi[i];
            i++;
            $scope.dato3=campi[i];
            i++;
            $scope.dato4=campi[i];
            i++;

            $scope.formData.push({
                'name': $scope.name,
                'owner': $scope.owner,
                'technology': $scope.technology,
                'dato1': $scope.dato1,
                'dato2': $scope.dato2,
                'dato3': $scope.dato3,
                'dato4': $scope.dato4
            });

        }

    }
});


MyApp.directive('fileChange',['$parse', function($parse){

    alert("BAM");
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



