"use strict";

function RenderObject(simulator) {

    if (!(simulator instanceof Simulation)) {
        throw "Renderer requires a Simulation Object as first argument";
    }

    let renderInfo = {
        
        particle : simulator.getParticleList(this)
    };
    
    //IIFE creating object
    let Line = new (function() {
        
        let context;
        
        this.init = function(newContext) {
            context = newContext; 
        }

        this.draw = function() {
            
            let p1 = renderInfo.magnitude[0];
            let p2 = renderInfo.magnitude[1];

            context.beginPath();

            context.moveTo(p1[0], p1[1]);
            context.lineTo(p2[0], p2[1]);
            context.strokeStyle = "#eee";
            
            context.stroke();
            context.closePath();
        
        }

        this.clear = function() {
            let canvas = context.canvas;
            context.clearRect(0, 0, canvas.width, canvas.height);
        }

        this.exec = function() {

            this.clear();
            
            if(renderInfo.validMagnitude)
                this.draw();
        
        }
    })();

    let Circle = new (function() {
        let x, y, context;

        this.init = function(cntxt) {
            context = cntxt;
        }

        function drawCircle(element) {
            let pos = element.getPosition();
            
            context.beginPath();
            context.fillStyle = "#f00";
            context.arc(pos[0], pos[1], 10, 0, Math.PI * 2, false);
            context.fill();
            context.stroke();

        }

        function clearCanvas() {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        }

        function renderCircle() {
            // Move the simulator to next frame
            simulator.run();
            // Clear the canvas
            clearCanvas();
            // render circle onto context
            renderInfo.particle.forEach(drawCircle);
            // Move next frame
            requestAnimationFrame(renderCircle);
        }

        requestAnimationFrame(renderCircle);


    })();

    let Track = {
        context : void 0,
        init : function(context) {
            this.context = context;
        },
        exec : function() {

        }
    }

    function loopInit() {
        
        function animationFrame() {
            Line.exec();
            window.requestAnimationFrame(animationFrame);
        }

        animationFrame();
    }

    this.set = function(canvasDOM) {
        const contextObject = {
            "magnitudeRender" : Line,
            "particleRender" : Circle,
            "trackRender" : Track
        };
        const domList = ["magnitudeRender", "particleRender"];

        for(let value in canvasDOM) {
            
            const canvasElement = canvasDOM[value];
            
            if(
                domList.indexOf(value) != -1 && canvasElement != null && canvasElement != undefined && (
                    typeof Node != undefined && canvasElement instanceof Node ||
                    typeof canvasElement == "object" && canvasElement.nodeType instanceof Number &&
                    canvasElement.nodeName instanceof String
                ) && canvasElement.tagName.toLowerCase() == "canvas"
            )
                contextObject[value].init(canvasDOM[value].getContext("2d"));
                
        }

        loopInit();

    }

    this.setMagnitude = function(deltaPoints) {
        if(!(deltaPoints instanceof Array) || deltaPoints.length != 2)
            return ; 

        let p1 = deltaPoints[0];
        let p2 = deltaPoints[1];
        
        //Both points must be number coordinates and must be different
        if(
            p1.length == 2 && p2.length == 2 &&
            typeof p1[0] == "number" && typeof p1[1] == "number" &&
            typeof p2[0] == "number" && typeof p2[1] == "number" && 
            (p1[0] != p2[0] || p1[1] != p2[1])
        ) {
            renderInfo.magnitude = deltaPoints;
            renderInfo.validMagnitude = true;
        }
    }

    this.removeMagnitude = function() {
        renderInfo.validMagnitude = false;
        renderInfo.magnitude = void 0;
    }

    this.setParticleColour = function(newColour) {
        console.log(newColour)
    }

    this.setTrackPath = function() {

    }



}