let app = angular.module("gravity", []);
app.controller("control-information", function($scope) {
    $scope.mass = 1;
    $scope.particleNumber = 0;
});


app.controller("cursor-information", function($scope) {
    $scope.x = 0;
    $scope.y = 0;
    $scope.mag = 0;
    
    $scope.setCoord = function(e) {
        $scope.x = e.clientX;
        $scope.y = e.clientY;
    }
})