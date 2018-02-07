(function(document) {

    const App = angular.module("gravity", []);
    const Render = new RenderObject();
    const PI = Math.PI;
    const Preset = [
        7 * PI / 4, 3 * PI / 2, 5 * PI / 4,
        PI, 3 * PI / 4, PI / 2, PI / 4, 0
    ];

    App.controller("information", function($scope, $window) {

        let massIndicator = document.getElementById("gravity-control-inner-view");
        let canvasList = document.getElementsByTagName("canvas");
        let mouse = {
            magnitude: 0,
            isDown: false,
            down: [0, 0],
            up: [0, 0],
            delta: {
                x: null,
                y: null
            },
            angle: null,
            angleLock: {
                deltaPosition: [void 0, void 0],
                set: false,
                magnitude: void 0,
                angle: void 0
            },
            gridLock: {
                set: false
            },
            update: function(x, y) {

                mouse.up = [x, y];
                mouse.delta.x = x - mouse.down[0];
                mouse.delta.y = y - mouse.down[1];
                mouse.magnitude = (
                    (mouse.delta.x) ** 2 + (mouse.delta.y) ** 2
                ) ** 0.5;

                //Grid Lock takes priority over Angle Lock
                
                if (mouse.gridLock.set) {
                    gridLockAngle();
                    return;
                }
                
                if (mouse.angleLock.set) {
                    angleLock();
                    return;
                }

                let theta = Math.atan2(-mouse.delta.y,
                    mouse.delta.x
                );

                mouse.angle = (theta > 0) ? 2 * Math.PI - theta : theta * -1;;


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
            //Theta range : [-pi, pi]
            let theta = Math.atan2(-mouse.angleLock.deltaPosition[1],
                mouse.angleLock.deltaPosition[0]
            );
            theta = (theta > 0) ? 2 * PI - theta : theta * -1;

            //unit circle thing
            mouse.angle = theta;
            mouse.up[0] = mouse.down[0] + mouse.magnitude * Math.cos(theta);
            mouse.up[1] = mouse.down[1] + mouse.magnitude * Math.sin(theta);

        }

        function gridLockAngle() {
            let theta = Math.atan2(-mouse.delta.y, mouse.delta.x);
            theta = (theta > 0) ? 2 * PI - theta : theta * -1;
            
            for(let x = 0; x < Preset.length; x++) {
                const newTheta = Preset[x];
                if(newTheta <= theta) {
                    theta = newTheta;
                    break;
                }
            }

            mouse.angle = theta;
            mouse.up[0] = mouse.down[0] + mouse.magnitude * Math.cos(theta);
            mouse.up[1] = mouse.down[1] + mouse.magnitude * Math.sin(theta);

            //This enables the angle lock in effect
            mouse.angleLock.deltaPosition[0] = -mouse.down[0] + mouse.up[0];
            mouse.angleLock.deltaPosition[1] = -mouse.down[1] + mouse.up[1];

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
            mouse.isDown = false;
            $scope.mag = 0;
            $scope.theta = void 0;

            //Remove the magnitude line
            Render.removeMagnitude();

        }

        $scope.setStart = function setStart(e) {
            mouse.down[0] = e.clientX;
            mouse.down[1] = e.clientY;
            mouse.isDown = true;
        }

        $scope.setPoint = function setPoint(e) {

            $scope.x = e.clientX;
            $scope.y = e.clientY;

            if (!mouse.isDown) {
                return;
            }

            mouse.update(
                e.clientX, e.clientY
            );

            $scope.mag = mouse.magnitude.toFixed(3);
            $scope.theta = humanTheta(mouse.angle).toFixed(3);
            Render.setMagnitude(
                [mouse.down, mouse.up]
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
                    mouse.angleLock.set = true;
                    //This is because we want to copy the value
                    //If set to the original array then it is
                    //referenced.
                    if (mouse.isDown) {
                        mouse.angleLock.deltaPosition[0] = (-mouse.down[0] + mouse.up[0]);
                        mouse.angleLock.deltaPosition[1] = (-mouse.down[1] + mouse.up[1]);
                    }

                break;

                case 17:
                    mouse.gridLock.set = true;
                break;
            }

            angular.element(massIndicator).css({
                width: $scope.mass + "%"
            });

            $scope.$apply();

        });

        angular.element($window).bind("keyup", (e) => {
            if (e.keyCode == 16) mouse.angleLock.set = false;
            if (e.keyCode == 17) mouse.gridLock.set = false;
        });

        angular.element($window).bind("DOMContentLoaded", () => {
            //Test case. The controller utilises the following
            Render.set({
                magnitudeRender: document.getElementById("magnitude-view"),
                particleRender: document.getElementById("particle-view"),
                trackRender: document.getElementById("track-view")
            });

            Render.setParticleList(
                
            );

        })

    });
})(document);