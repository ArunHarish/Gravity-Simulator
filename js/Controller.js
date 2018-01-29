(function(document) {
    
    const app = angular.module("gravity", []);
    const NULL = "∅";
    const Render = new RenderObject();
    const PI = Math.PI;

    app.controller("information", function($scope, $window) {

        let massIndicator = document.getElementById("gravity-control-inner-view");
        let canvasList = document.getElementsByTagName("canvas");
        let mouse = {
            magnitude : 0,
            isDown: false,
            down: [0, 0],
            up: [0, 0],
            delta : {
                x : null,
                y : null
            },
            angle : null,
            angleLock: {
                deltaPosition : [void 0, void 0],
                set : false,
                magnitude : void 0
            },
            update : function(x, y) {
                mouse.up = [x, y];
                mouse.delta.x = mouse.up[0] - mouse.down[0];
                mouse.delta.y = mouse.up[1] - mouse.down[1];
            
                mouse.magnitude = (
                    (mouse.delta.x) ** 2 + (mouse.delta.y) ** 2
                ) ** 0.5;
            }
        }

        function resize() {
            let width = $window.innerWidth;
            let height = $window.innerHeight;

            angular.element(canvasList).attr({
                width: width + "px",
                height: height + "px"
            })

        }

        function angleLock() {
            let theta = Math.atan2(
                -mouse.angleLock.deltaPosition[1],
                mouse.angleLock.deltaPosition[0]
            );

            theta = (theta > 0) ? 2 * Math.PI - theta: theta * -1;;

            //unit circle thing

            mouse.up[0] = mouse.down[0] + mouse.magnitude * Math.cos(theta);
            mouse.up[1] = mouse.down[1] + mouse.magnitude * Math.sin(theta);

            console.log(
                (
                    (mouse.up[0] - mouse.down[0]) ** 2
                    +
                    (mouse.up[1] - mouse.down[1]) ** 2
                ) ** 0.5
            )

        }

        function gridLockAngle() {

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

            mouse.update(
                e.clientX, e.clientY
            );

            if(mouse.angleLock.set) {
                angleLock();
            }

            $scope.mag = mouse.magnitude;
            Render.setMagnitude(
                [mouse.down, mouse.up]
            )

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
                    mouse.angleLock.set = true;
                    //This is because we want to copy the value
                    //If set to the original array then it is
                    //referenced.
                    if(mouse.isDown) {
                        mouse.angleLock.deltaPosition[0] = (-mouse.down[0] + mouse.up[0]);
                        mouse.angleLock.deltaPosition[1] = (-mouse.down[1] + mouse.up[1]);
                    }
                    
                    break;

            }

            angular.element(massIndicator).css({
                width: $scope.mass + "%"
            });

            $scope.$apply();

        });

        angular.element($window).bind("keyup", (e) => {
            if (e.keyCode == 16) mouse.angleLock.set = false
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