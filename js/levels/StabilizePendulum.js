'use strict';
if (typeof Levels === 'undefined') var Levels = {};

Levels.StabilizePendulum = function()
{
    this.name = "StabilizePendulum";
    this.title = "Inverted Pendulum: Stabilize";
    this.sampleSolution = "function controlFunction(pendulum)\n{\n  let L = 1.0;\n  let m1 = 0.5;\n  let g = 9.81;\n  \n  let k1 = 3 * m1 * L * L;\n  let k2 = 3 * m1 * L * L;\n  let u_fb = - k1 * pendulum.theta - k2 * pendulum.dtheta; // feedback controller\n  \n  let u_nonl = -m1 * g * L * Math.sin(pendulum.theta); // cancel nonlinear dynamics\n  \n  return u_fb + u_nonl;\n}\n";
    this.boilerPlateCode = "function controlFunction(pendulum)\n{\n  return 10*Math.sin(8*pendulum.T);\n}";
    this.difficultyRating = 1;
    this.description = "Stabilize the pendulum so that it stays upright in perfect balance. Calculate the torque necessary to achieve this.";
    this.model = new Models.Pendulum({
        m1: .5,
        L: 1,
        g: 9.81,
        theta: parseFloat(document.getElementById("initialThetaSelect").value),
        dtheta: parseFloat(document.getElementById("initialDThetaSelect").value),
        M: 0,
        T: 0,
        processNoiseVariance: parseFloat(document.getElementById("processNoiseSelect").value),
        measurementNoiseVariance: parseFloat(document.getElementById("measurementNoiseSelect").value),
        lambda: parseFloat(document.getElementById("dampingSelect").value)
    });

    // Function to update which inputs are shown
    const updateInitialConditionInputs = () => {
        document.getElementById("initialThetaSelect").parentElement.style.display = "flex";
        document.getElementById("initialDThetaSelect").parentElement.style.display = "flex";
        document.getElementById("initialXSelect").parentElement.style.display = "none";
        document.getElementById("initialDXSelect").parentElement.style.display = "none";
    };

    // Run immediately if DOM is ready, or wait until it is
    if (document.readyState === "complete" || document.readyState === "interactive") {
        updateInitialConditionInputs();
    } else {
        window.addEventListener('DOMContentLoaded', updateInitialConditionInputs);
    }
}


Levels.StabilizePendulum.prototype.levelComplete = function()
{
    return Math.abs(this.model.dtheta) < 0.01 
    && Math.abs(Math.sin(this.model.theta)) < 0.001
    && Math.cos(this.model.theta) > 0.999;
}

Levels.StabilizePendulum.prototype.levelFailed = function()
{
    return false;
}


Levels.StabilizePendulum.prototype.simulate = function (dt, controlFunc)
{
    this.model.simulate (dt, controlFunc);
}

Levels.StabilizePendulum.prototype.getSimulationTime = function() {return this.model.T;}


Levels.StabilizePendulum.prototype.draw = function(ctx, canvas){this.model.draw(ctx, canvas);}

Levels.StabilizePendulum.prototype.infoText = function(ctx, canvas){return this.model.infoText();}