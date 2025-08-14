'use strict';
if (typeof Levels === 'undefined') var Levels = {};

Levels.StabilizeSinglePendulum = function()
{
    this.name = "StabilizeSinglePendulum";
    this.title = "Inverted Pendulum on Cart: Stabilize";
    this.sampleSolution = "function controlFunction(pendulum)\n{\n  let k1 = -3.16227766;\n  let k2 = -262.8329034;\n  let k3 = -10.20009003;\n  let k4 = -82.27930003;\n  return -(k1 * pendulum.x + k2 * pendulum.theta + k3 * pendulum.dx + k4 * pendulum.dtheta);\n}\n";
    this.boilerPlateCode = "function controlFunction(pendulum)\n{\n  return 10*Math.sin(8*pendulum.T);\n}";
    this.difficultyRating = 2;
    this.description = "Stabilize the pendulum so that it stays upright, moves to the center (x=0) and stays there in perfect balance. Calculate the horizontal force on the cart necessary to achieve this.";
    this.model = new Models.SinglePendulum({
        m0: 10,
        m1: .5,
        L: 1,
        g: 9.81,
        theta: parseFloat(document.getElementById("initialThetaSelect").value),
        dtheta: parseFloat(document.getElementById("initialDThetaSelect").value),
        x: parseFloat(document.getElementById("initialXSelect").value),
        dx: parseFloat(document.getElementById("initialDXSelect").value),
        F: 0,
        T: 0,
        processNoiseVariance: parseFloat(document.getElementById("processNoiseSelect").value),
        measurementNoiseVariance: parseFloat(document.getElementById("measurementNoiseSelect").value)
    });

    // Function to update which inputs are shown
    const updateInitialConditionInputs = () => {
        document.getElementById("initialThetaSelect").parentElement.style.display = "flex";
        document.getElementById("initialDThetaSelect").parentElement.style.display = "flex";
        document.getElementById("initialXSelect").parentElement.style.display = "flex";
        document.getElementById("initialDXSelect").parentElement.style.display = "flex";
    };

    // Run immediately if DOM is ready, or wait until it is
    if (document.readyState === "complete" || document.readyState === "interactive") {
        updateInitialConditionInputs();
    } else {
        window.addEventListener('DOMContentLoaded', updateInitialConditionInputs);
    }
}


Levels.StabilizeSinglePendulum.prototype.levelComplete = function()
{
    return Math.abs(this.model.x) < 0.01 
    && Math.abs(this.model.dx) < 0.01 
    && Math.abs(this.model.dtheta) < 0.01 
    && Math.abs(Math.sin(this.model.theta)) < 0.001
    && Math.cos(this.model.theta) > 0.999;
}

Levels.StabilizeSinglePendulum.prototype.levelFailed = function()
{
    return false;
}


Levels.StabilizeSinglePendulum.prototype.simulate = function (dt, controlFunc)
{
    this.model.simulate (dt, controlFunc);
}

Levels.StabilizeSinglePendulum.prototype.getSimulationTime = function() {return this.model.T;}


Levels.StabilizeSinglePendulum.prototype.draw = function(ctx, canvas){this.model.draw(ctx, canvas);}

Levels.StabilizeSinglePendulum.prototype.infoText = function(ctx, canvas){return this.model.infoText();}