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
