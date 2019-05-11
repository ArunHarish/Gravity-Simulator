/** Model Package containing Mouse and Particle Information
 * * Class acts like a Model in MVC
 * * Contains particle information
 * * Algorithm deciding on particle trajectory
 * * Controlling Particle append and removal 
 */


/** Contains Mouse Information for Simulation to have easy access
 *  * Model class containing Mouse UI Information
 */
let Mouse =  (function() {
   function Mouse() {
         // Constants
        const PI = Math.PI;
        const Preset = [
            7 * PI / 4, 3 * PI / 2, 5 * PI / 4,
            PI, 3 * PI / 4, PI / 2, PI / 4, 0
        ];

        // Private properties
        let mass = 1,
            magnitude,
            isDown = false,
            down = [],
            up = [],
            angle = void 0,
            angleLock = {
                deltaPos : [void 0, void 0],
                set : false,
                mag : void 0,
                angle: void 0
            },
            gridLock = {
                set : false
            };
        
        this.update = function update(x, y) {
            // Updating mouseup
            this.setUp(x, y);

            // 
            let up = this.getUp();
            let down = this.getDown();
            // Grid Lock takes priority
            if (this.isGridLock()) {
                this.gridLock();
                return;
            }

            // Angle Lock
            if (this.isAngleLock()) {
                this.angleLock();
                return ;
            }

            let theta = Math.atan2(
                -(up[1] - down[1]),
                (up[0] - down[0])
            );
                theta = adjustTheta(theta);

            this.setAngle(theta);

        }

        this.setMousePress = function(mousePress) {
            isDown = mousePress;
        }

        this.getMousePress = function getMousePress() {
            return isDown;
        }

        this.setAngleLockDelta = function setAngleLockDelta() {
            let down = this.getDown(),
                up = this.getUp();

            angleLock.deltaPos[0] = -down[0] + up[0];
            angleLock.deltaPos[1] = -down[1] + up[1];
        }

        this.getAngleLockDelta = function getAngleLockDelta() {
            return angleLock.deltaPos;
        }

        this.setAngleLock = function setAngleLock(bool) {
            angleLock.set = bool;
        }

        this.getAngleLock = function getAngleLock() {
            return angleLock.set;
        }

        this.setUp = function setUp(ux, uy) {
            up[0] = ux;
            up[1] = uy;
            this.updateMag();
        }

        this.getUp = function getUp() {
            return [up[0], up[1]];
        }

        this.setDown = function setDown(dx, dy) {
            down[0] = dx;
            down[1] = dy;
            this.updateMag();
        }

        this.getDown = function getDown() {
            return [down[0], down[1]];
        }

        this.setAngle = function setAngle(theta) {
            angle = theta;
        }

        this.getAngle = function getAngle() {
            return angle;
        }

        this.updateMag = function updateMag() {
            up = this.getUp();
            down = this.getDown();
            magnitude = ( (up[0] - down[0]) ** 2 + (up[1] - down[1]) ** 2 ) ** 0.5
        }

        this.getMag = function getMag() {
            return magnitude;
        }

        this.isGridLock = function isGridLock() {
            return gridLock.set;
        }

        this.setGridLock = function getGridLock(bool) {
            gridLock.set = bool;
        }

        this.isAngleLock = function isAngleLock() {
            return angleLock.set;
        }

        this.setAngleLock = function setAngleLock(bool) {
            angleLock.set = bool;
        }

        function adjustTheta (theta) {
            return (theta > 0) ? 2 * PI - theta : theta * -1;
        }
        
        this.angleLock = function angleLock() {
            let angleLockDelta = this.getAngleLockDelta();
            if (angleLockDelta[0] == void 0 || angleLockDelta[1] == void 0) {
                return ;
            }

            let theta = Math.atan2(-angleLockDelta[1], angleLockDelta[0]);
                theta = adjustTheta(theta);

            let down = this.getDown();
            let mag = this.getMag();

            this.setAngle(theta);
            this.setUp(
                (down[0] + mag * Math.cos(theta)),
                (down[1] + mag * Math.sin(theta))
            );

        }

        this.gridLock = function gridLock() {

            let mag = this.getMag(),
                down = this.getDown(),
                up = this.getUp(),
                angleLockDelta = [(up[0] - down[0]), (up[1] - down[1])],
                theta = Math.atan2(-angleLockDelta[1], angleLockDelta[0]);
                theta = adjustTheta(theta);
                
            for (let x = 0; x < Preset.length; x++) {
                const newTheta = Preset[x];
                if(newTheta <= theta) {
                    theta = newTheta;
                    break;
                }
            }

            this.setAngle(theta);
            this.setUp(
                (down[0] + mag * Math.cos(theta)),
                (down[1] + mag * Math.sin(theta))
            );
   
        }

        this.getMass = function getMass() {
            return mass;
        }

        this.incrementMass = function incrementMass() {
            mass++;
        }

        this.decrementMass = function decrementMass() {
            mass--;
        }

   }

   return Mouse;

})();

let Simulation = (function() {
    let options = {};

    function Particle(locX, locY, dX, dY, mass) {
        let color = options.color;

        if (locX == void 0 || locY == void 0 || dY == void 0 || dY == void 0 || mass == void 0)
            throw "Particle constructor: Particle(locX:number, locY:number, dX:number, dY:number, mass:number)";

        this.getPosition = function getPosition() {
            return [locX, locY];
        }

        this.getMass = function getMass() {
            return mass;
        }

        this.run = function run() {
            locX += dX;
            locY += dY;
        }

        this.setDelta = function setDelta(deltaX, deltaY) {
            dX = deltaX;
            dY = deltaY;
        }

        this.getDelta = function getDelta() {
            return [dX, dY];
        }

    }

    function Simulation(mouseObject) {
        if (!(mouseObject instanceof Mouse)) {
            throw "Simulation requires Object Mouse as first argument.";
        }
        const particleList = [];
        const GRAVITY = 6.674 * (10 ** (-1));

        // Helper functions
        function getDelta() {
            let mag = mouseObject.getMag(),
                ang = mouseObject.getAngle();
            
            return {
                // Only 2% of the magnitude is considered
                x : 0.02 * mag * Math.cos(ang),
                y : 0.02 * mag * Math.sin(ang)
            }
        }

        function magnitude(first, second) {
            let deltaX = second[0] - first[0];
            let deltaY = second[1] - first[1];
            let mag = (deltaX ** 2 + deltaY ** 2) ** 0.5;

            return mag;
        }
        
        function directionVec(first, second, magnitude) {
            let deltaX = second[0] - first[0];
            let deltaY = second[1] - first[1];
            return {
                directionX : deltaX / magnitude,
                directionY : deltaY / magnitude
            }
        }

        function changeDelta(first, second) {
            // Getting masses
            const massTwo = second.getMass(),
            // Getting positions
                  posOne = first.getPosition(),
                  posTwo = second.getPosition();
            
            let mag = magnitude(posOne, posTwo),
                direction = directionVec(posOne, posTwo, mag);

            return {
                ddx : GRAVITY * massTwo * direction.directionX / mag,
                ddy : GRAVITY * massTwo * direction.directionY / mag
            }

        }

        this.run = function run() {
            // Moves next frame
            particleList.forEach(function(element, index) {
                // delta x and y
                let deltaArray = element.getDelta(),
                    acceleration = {
                        x : deltaArray[0],
                        y : deltaArray[1]
                    };

                particleList.forEach(function(other, otherIndex) {
                    if (otherIndex != index) {
                        let newDelta = changeDelta(element, other);
                        acceleration.x += newDelta.ddx;
                        acceleration.y += newDelta.ddy;
                    }
                });

                element.setDelta(acceleration.x, acceleration.y);
                element.run();
            });
        }

        this.getParticleList = function getParticleList(renderer) {
            if (!(renderer instanceof RenderObject))
                throw "getParticleList requires a rendererObject as first argument";
            return particleList;
        }

        this.addParticle = function addParticle() {
            
            let mass = mouseObject.getMass(),
                delta = getDelta(),
                location = mouseObject.getDown();
            
            particleList.push(
                new Particle(location[0], location[1], delta.x, delta.y, mass)
            );
            
            return true;
        }

    }

    return Simulation;

})();
