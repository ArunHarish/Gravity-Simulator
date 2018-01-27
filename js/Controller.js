(function(document) {
    const app = angular.module("gravity", []),
    NULL = "∅",
    Render = new RenderObject(),
    PI = Math.PI,
    anglePreset = [
        -3 * Math.PI / 4 ,-Math.PI / 2, -Math.PI / 4, 0, 
        Math.PI / 4,  Math.PI / 2, 3 * Math.PI / 4, Math.PI
    ];

    app.controller("information", function($scope, $window) {

        let massIndicator = document.getElementById("gravity-control-inner-view");
        let canvasList = document.getElementsByTagName("canvas");
        let mouse = {
            isDown: false,
            down: [0, 0],
            up: [0, 0],
            angleLock: false
        }

        function resize() {
            let width = $window.innerWidth;
            let height = $window.innerHeight;

            angular.element(canvasList).attr({
                width: width + "px",
                height: height + "px"
            })

        }

        function angleLock(delta, magnitude, coord) {
            const angle = Math.atan2(-delta.y, -delta.x);
            coord.up[0] = magnitude * Math.cos(angle);
            coord.up[1] = magnitude * Math.sin(angle);
        }

        function gridLockAngle(delta, magnitude) {

            //Find the closest angle
            let angle = Math.atan2(-delta.y, -delta.x);
            

            for(let x = 0; x < anglePreset.length; x++) {
                let boundaryAngle = anglePreset[x];
                if(angle <= boundaryAngle)
                {
                    let theta = boundaryAngle - Math.PI;
                    return [x1 + magnitude * Math.cos(theta), y1 + magnitude * Math.sin(theta)];
                }
            }


            return [x2, y2];
        }

        $scope.mass = 1;
        $scope.particleNumber = 0;

        $scope.x = NULL;
        $scope.y = NULL;
        $scope.mag = 0;

        $scope.options = [{
                name: "Red",
                value: 0
            },
            {
                name: "Green",
                value: 1
            },
            {
                name: "Blue",
                value: 2
            }
        ]

        $scope.setEnd = function(e) {
            mouse.isDown = false;
            $scope.mag = 0;
            //Rendering stuff here
            Render.removeMagnitude();
        }

        $scope.setStart = function(e) {
            mouse.down[0] = e.clientX;
            mouse.down[1] = e.clientY;
            mouse.isDown = true;
        }

        $scope.setPoint = function(e) {

            $scope.x = e.clientX;
            $scope.y = e.clientY;

            if(!mouse.isDown) {
                $scope.mag = 0;
                return ;
            }

            mouse.up = [e.clientX, e.clientY];


            let delta = {
                x : mouse.up[0] - mouse.down[0],
                y : mouse.up[1] - mouse.down[1]
            }
            let magnitude = (
                (delta.x) ** 2 + (delta.y) ** 2
            ) ** 0.5;

            if(mouse.angleLock) {
                
                console.log(mouse.up);
                //angleLock(delta, magnitude, mouse);
            }
            
            $scope.mag = magnitude
            // Rendering stuff here
            Render.setMagnitude([mouse.down, mouse.up])
        }

        $scope.setSelect = function(e) {
            //Do whatever necessary to change the rendering
        }

        $scope.setTrackOption = function() {
            //Do whatever necessary here to change the rendering
        }

        angular.element($window).bind("resize load", resize);
        angular.element($window).bind("keydown", (e) => {

            switch (e.keyCode) {
                case 87:
                    if (($scope.mass + 1) <= 100)
                        $scope.mass++;
                    break;

                case 83:
                    if (($scope.mass - 1) >= 1)
                        $scope.mass--;
                    break;

                case 16:
                    mouse.angleLock = true;
                    break;

            }

            angular.element(massIndicator).css({
                width: $scope.mass + "%"
            });

            $scope.$apply();

        });
        angular.element($window).bind("keyup", (e) => {
            if (e.keyCode == 16) mouse.angleLock = false
        });


        angular.element($window).bind("DOMContentLoaded", () => {
            //Test case. The controller utilises the following
            Render.set({
                magnitudeRender: document.getElementById("magnitude-view"),
                particleRender: document.getElementById("particle-view"),
                trackRender: document.getElementById("track-view")
            });

        })

    });
})(document);