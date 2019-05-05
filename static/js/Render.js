"use strict";

function RenderObject() {
    let renderInfo = {
        magnitude : void 0,
        validMagnitude : false,
        particle : []
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

        this.set = function(cntxt) {
            if (cntxt) {
                context = cntxt;
            }

            x = y = 0;
            
        }

        this.position = function(newX, newY) {
            x = newX;
            y = newY;
        }

        this.init = function(cntxt) {
            this.context = cntxt;
        }

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

    // Sets any pre-defined particles and their information
    this.setParticleList = function() {
        
    }

    this.addParticle = function() {
        console.log(true);
    }

}