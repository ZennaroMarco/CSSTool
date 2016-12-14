/**
 * Created by marcozennaro on 27/11/2016.
 */

var MyApp = angular.module('MyApp', []);

MyApp.controller('formCtrl', function($scope, $http, $filter) {

    var string;
    var json;
    var wait4file2load = 1000;


    $scope.formData =  [];


    $http.get('http://localhost:3000/api/v1/template').then(
        function successCallback(data) {
            alert("ok");
        },
        function errorCallback(data) {

            alert("error" + JSON.stringify(data));
        }
    );



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


                    var appElement = document.querySelector('[ng-app=MyApp]');
                    var $scope = angular.element(appElement).scope();

                    $scope.$apply(function() {


                        $scope.addRow();

                    });

                    alert("ciao");
                    alert("ciao");


                }
            });
        }
    };
});


$scope.$watch("excelData", function() {
    var lines, lineNumber, data, length;
    $scope.inviteList = [];
    lines = $scope.excelData.split('\n');
    lineNumber = 0;
    for (var i = lines.length - 1; i >= 0; i--) {
        l = lines[i];

        lineNumber++;
        data = l.split(',');

        var name = data[0];
        var email = data[1];

        $scope.inviteList.push({

            $scope:formData.push({ 'name':$scope.name, 'owner': $scope.owner, 'technology':$scope.technology, 'dato1':$scope.dato1, 'dato2':$scope.dato2, 'dato3':$scope.dato3, 'dato4':$scope.dato4 })

    });
    }
});

function StringBuilder(value)
{
    this.strings = new Array("");
    this.append(value);
}

// Appends the given value to the end of this instance.
StringBuilder.prototype.append = function (value)
{
    if (value)
    {
        this.strings.push(value);
    }
}

// Clears the string buffer
StringBuilder.prototype.clear = function ()
{
    this.strings.length = 1;
}

// Converts this instance to a String.
StringBuilder.prototype.toString = function ()
{
    return this.strings.join("");
}


function csvJSON(csv){

    var lines=csv.split("\n");

    var result = [];

    var headers=lines[0].split(",");

    for(var i=1;i<lines.length;i++){

        var obj = {};
        var currentline=lines[i].split(",");

        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);

    }

    //return result; //JavaScript object
    return JSON.stringify(result); //JSON

}

/*var app = angular.module('MyApp',[]);

app.controller('formCtrl', function($scope, $http) {
    $scope.data = [];

    $http.get('http://localhost:3000/api/v1/template').then(
        function successCallback(data) {
            $scope.data = data;
            alert("okkkkk");
        },
        function errorCallback(data) {
            alert("error: " + data);
        }
    );
});*/
