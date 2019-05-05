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
        let magnitude,
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
                console.log("Grid Lock");
                this.gridLock();
                return;
            }

            // Angle Lock
            if (this.isAngleLock()) {
                console.log("Angle Lock");
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

        this.setAngleLockDelta = function setAngleLockDelta(xDelta, yDelta) {
            angleLock.deltaPos[0] = xDelta;
            angleLock.deltaPos[1] = yDelta;
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
   }

   return Mouse;

})();

let Simulation = (function() {

    function Particle() {
    }

    function Simulation() {
        const particleList = [];

        this.getParticleList = function getParticleList() {
            return particleList;
        }

        this.addParticle = function addParticle(setting) {
            
            let newParticle = new Particle();

            particleList.push(
		        newParticle
            );
        }

    }

    return Simulation;

})();
