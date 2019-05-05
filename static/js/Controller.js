(function(document) {

    const App = angular.module("gravity", []);
    const PI = Math.PI;

    App.controller("information", function($scope, $window) {

        let massIndicator = document.getElementById("gravity-control-inner-view");
        let canvasList = document.getElementsByTagName("canvas");
        
        const mouseModel = new Mouse();
        const simulator = new Simulation(mouseModel);
        const render = new RenderObject(simulator);

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
            render.removeMagnitude();
            // Add a particle
            if (simulator.addParticle()) {
                $scope.particleNumber++;
            }
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
            render.setMagnitude(
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
                    if (mouseModel.getMass() + 1 <= 100)
                        mouseModel.incrementMass();
                        $scope.mass = mouseModel.getMass()
                        $scope.$apply();
                break;
                case 83:
                    if (mouseModel.getMass() - 1 >= 1)
                        mouseModel.decrementMass();
                        $scope.mass = mouseModel.getMass();
                        $scope.$apply();
                break;
                case 16:
                    mouseModel.setAngleLock(true);
                    mouseModel.setAngleLockDelta();
                break;
                case 17:
                    mouseModel.setGridLock(true);
                break;
            }

            angular.element(massIndicator).css({
                width: $scope.mass + "%"
            });

        });

        angular.element($window).bind("keyup", (e) => {
            if (e.keyCode == 16)
                mouseModel.setAngleLock(false);
            if (e.keyCode == 17) 
                mouseModel.setGridLock(false);
        });

        angular.element($window).bind("DOMContentLoaded", () => {
            //Test case. The controller utilises the following
            render.set({
                magnitudeRender: document.getElementById("magnitude-view"),
                particleRender: document.getElementById("particle-view"),
                trackRender: document.getElementById("track-view")
            });


        })

    });
})(document);