var app=angular.module('lockers',[]);
app.controller('lockers',function($scope,$http,$interval){
load();
function load(){
$http.get('http://localhost:8000/load').success(function(data){
$scope.users=data;
});
};
});
