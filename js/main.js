let app = angular.module("gravity", []);

app.controller("information", function($scope) {

    let massIndicator = document.getElementById("gravity-control-inner-view");
    let mouse = {
        isDown : false,
        down : [0, 0],
        up : [0, 0]
    }


    $scope.mass = 1;
    $scope.particleNumber = 0;

    $scope.x = "∅";
    $scope.y = "∅";
    $scope.mag = "∅";
    
    $scope.options = [
        {name : "Red", value : 0},
        {name : "Green", value : 1},
        {name : "Blue", value : 2}
    ]

    $scope.onKeyPress = function(e) {

        switch(String.fromCharCode(e.keyCode)) {
            case "W":
            case "w":
            if(($scope.mass + 1) <= 100) {
                $scope.mass++;
            }
            break;

            case "S":
            case "s":
            if(($scope.mass - 1) >= 1) {
                $scope.mass--;
            }
            break;
        }

        angular.element(massIndicator).css({
            width : $scope.mass + "%"
        })

    }


    $scope.setEnd = function(e) {
        mouse.isDown = false;
        $scope.mag = 0;
        //Rendering stuff here

    }

    $scope.setStart = function(e) {
        mouse.down[0] = e.clientX;
        mouse.down[1] = e.clientY;
        mouse.isDown = true;
    }

    $scope.setPoint = function(e) {
        
        let x = e.clientX;
        let y = e.clientY;

        $scope.x = x; 
        $scope.y = y;

        if(mouse.isDown)
        {
            mouse.up[0] = x;
            mouse.up[1] = y;
            $scope.mag = Math.sqrt(
                Math.pow(mouse.up[0] - mouse.down[0], 2) + 
                Math.pow(mouse.up[1] - mouse.down[1], 2)
            );
            // Rendering stuff here
        }
        else {
            $scope.mag = 0;
        }
    }

    $scope.setSelect = function(e) {
        //Do whatever necessary to change the rendering
    }

    $scope.setTrackOption = function() {
        //Do whatever necessary here to change the rendering
    }

});