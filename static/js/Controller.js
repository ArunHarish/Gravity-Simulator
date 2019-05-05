(function(document) {

    const App = angular.module("gravity", []);
    const Render = new RenderObject();
    const PI = Math.PI;

    App.controller("information", function($scope, $window) {

        let massIndicator = document.getElementById("gravity-control-inner-view");
        let canvasList = document.getElementsByTagName("canvas");
        let mouseModel = new Mouse();

        function resize() {
            let width = $window.innerWidth;
            let height = $window.innerHeight;

            angular.element(canvasList).attr({
                width: width + "px",
                height: height + "px"
            })

        }

        //Function to make the angle understandable as in normal coordinate system
        function humanTheta(theta) {
            return 2 * PI - theta;
        }

        $scope.mass = 1;
        $scope.particleNumber = 0;
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

        $scope.setEnd = function setEnd(e) {
            mouseModel.setMousePress(false);
            $scope.mag = 0;
            $scope.theta = void 0;

            //Remove the magnitude line
            Render.removeMagnitude();
            // Add a particle
            Render.addParticle();
        }

        $scope.setStart = function setStart(e) {
            mouseModel.setMousePress(true);
            mouseModel.setDown(e.clientX, e.clientY);
        }

        $scope.setPoint = function setPoint(e) {

            $scope.x = e.clientX;
            $scope.y = e.clientY;

            if (!mouseModel.getMousePress()) {
                return ;
            }

            mouseModel.update(
                e.clientX,
                e.clientY
            );

            $scope.mag = mouseModel.getMag().toFixed(3);
            $scope.theta = humanTheta(mouseModel.getAngle()).toFixed(3);
            Render.setMagnitude(
                [mouseModel.getDown(), mouseModel.getUp()]
            );

        }

        $scope.setSelect = function setSelect(e) {
            //Do whatever necessary to change the rendering
        }

        $scope.setTrackOption = function setTrackOption() {
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
                    mouseModel.setAngleLock(true);
                    //This is because we want to copy the value
                    //If set to the original array then it is
                    //referenced.
                    if (mouseModel.getMousePress()) {
                        let down = mouseModel.getDown(),
                            up = mouseModel.getUp();

                        mouseModel.setAngleLockDelta(
                            -down[0] + up[0],
                            -down[1] + up[1]
                        );
                    }

                break;

                case 17:
                    mouseModel.setGridLock(true);
                break;
            }

            angular.element(massIndicator).css({
                width: $scope.mass + "%"
            });

            $scope.$apply();

        });

        angular.element($window).bind("keyup", (e) => {
            if (e.keyCode == 16)
                mouseModel.setAngleLock(false);
                // mouse.angleLock.set = false;
            if (e.keyCode == 17) 
                mouseModel.setGridLock(false);
                // mouse.gridLock.set = false;
        });

        angular.element($window).bind("DOMContentLoaded", () => {
            //Test case. The controller utilises the following
            Render.set({
                magnitudeRender: document.getElementById("magnitude-view"),
                particleRender: document.getElementById("particle-view"),
                trackRender: document.getElementById("track-view")
            });

            Render.setParticleList();

        })

    });
})(document);