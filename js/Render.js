"use strict";

function RenderObject() {

    let protectedMap = {
        magnitude : [void 0, void 0],
        particle : []
    };


    function loopInit() {

    }

    this.set = function(canvasDOM) {
        const contextObject = {};
        const domList = ["magnitudeRender", "particleRender", "trackRender"];

        for(let value in canvasDOM) {
            
            const canvasElement = canvasDOM[value];
            
            if(
                domList.indexOf(value) != -1 && canvasElement != null && canvasElement != undefined && (
                    typeof Node != undefined && canvasElement instanceof Node ||
                    typeof canvasElement == "object" && canvasElement.nodeType instanceof Number &&
                    canvasElement.nodeName instanceof String
                ) && canvasElement.tagName.toLowerCase() == "canvas"
            )
                contextObject[value] = canvasDOM[value].getContext("2d");

        }

        protectedMap.context = contextObject;
        loopInit();

    }

    this.addMagnitude = function(deltaPoints) {
        if(!(deltaPoints instanceof Array) || deltaPoints.length != 2)
            return ; 

        let p1 = deltaPoints[0];
        let p2 = deltaPoints[1];

        //Both points must be number coordinates and must be different
        if(
            p1.length == 2 && p2.length == 2 &&
            typeof p1[0] == "number" && typeof p1[1] == "number" &&
            typeof p2[0] == "number" && typeof p2[1] == "number" && 
            (p1[0] == p2[0] ^ p1[1] == p2[1])
        ) {
            protectedMap.magnitude = deltaPoints;
        }
    }
}