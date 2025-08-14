'use strict';
if (typeof Models === 'undefined') var Models = {};

// Gaussian noise generator
function gaussianNoise(mean, variance) {
    const std = Math.sqrt(variance);
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    return mean + std * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

Models.Pendulum = function(params)
{
    var nVars = Object.keys(this.vars).length;
    for(var i = 0; i < nVars; i++)
    {
        var key = Object.keys(this.vars)[i];
        this[key] = (typeof params[key] == 'undefined')?this.vars[key]:params[key];
    }
}

Models.Pendulum.prototype.vars = 
{
    m1: .5,
    L: 1,
    g: 9.81,
    theta: 0.2,
    dtheta: 0,
    M: 0,
    M_cmd: 0,
    T: 0,
    processNoiseVariance: 0,
    measurementNoiseVariance: 0
};

Models.Pendulum.prototype.simulate = function (dt, controlFunc)
{
    const state = {theta: this.theta,dtheta: this.dtheta,T: this.T};

    if (this.measurementNoiseVariance > 0) {
        state.theta += gaussianNoise(0, this.measurementNoiseVariance);
        state.dtheta += gaussianNoise(0, this.measurementNoiseVariance);
    }
    
    this.M_cmd = controlFunc(state);

    if(typeof this.M_cmd != 'number' || isNaN(this.M_cmd)) throw "Error: The controlFunction must return a number.";
    this.M_cmd = Math.max(-30,Math.min(30,this.M_cmd));
    integrationStep(this, ['theta', 'dtheta', 'M'], dt);
}

Models.Pendulum.prototype.ode = function (x)
{
    var s = Math.sin(x[0]);
    
    var A = [[this.m1 * this.L * this.L]];
    var b = [x[2] + this.m1 * this.g * this.L * s];
    var ddx = numeric.solve(A,b)

    if (this.processNoiseVariance > 0) {
        ddx[0] += gaussianNoise(0, this.processNoiseVariance);  
    }

    return [x[1],ddx[0],40.0*(this.M_cmd - x[2])];
}


Models.Pendulum.prototype.draw = function (ctx, canvas) 
{
    const tipX = this.L * Math.sin(this.theta);
    const tipY = this.L * Math.cos(this.theta); 

    // ground
    ctx.strokeStyle="#333366";
    drawLine(ctx,-100,-.025,100,-.025,0.05);

    // shaft
    ctx.strokeStyle="#AAAAFF";
    ctx.lineCap = 'round';
    drawLine(ctx, 0, 0, tipX, tipY, this.L / 20.0);

    // tip-mass
    ctx.beginPath();
    ctx.arc(tipX, tipY, this.L / 7, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#4444FF';
    ctx.fill();

    // torque arrow
    ctx.strokeStyle="#FF0000";
    ctx.lineCap = 'round';
    drawArrow(ctx, 0, 0.1, 0.15*this.M, 0, 0.05, this.L / 40.0);
}

Models.Pendulum.prototype.infoText = function ()
{
    return  "/* Angle from vertical (rad) */ pendulum.theta  = " + round(this.theta,2)
        + "\n/* Angular velocity (rad/s)  */ pendulum.dtheta = " + round(this.dtheta,2)
        + "\n/* Simulation time (s)       */ pendulum.T      = " + round(this.T,2);    
}
