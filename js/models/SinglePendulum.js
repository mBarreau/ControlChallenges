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

Models.SinglePendulum = function(params)
{
    var nVars = Object.keys(this.vars).length;
    for(var i = 0; i < nVars; i++)
    {
        var key = Object.keys(this.vars)[i];
        this[key] = (typeof params[key] == 'undefined')?this.vars[key]:params[key];
    }
}

Models.SinglePendulum.prototype.vars = 
{
    m0: 10,
    m1: .5,
    L: 1,
    g: 9.81,
    theta: 0.2,
    dtheta: 0,
    x: 0,
    dx: 0,
    F: 0,
    F_cmd: 0,
    T: 0,
    processNoiseVariance: 0,
    measurementNoiseVariance: 0,
    lambda:0
};

Models.SinglePendulum.prototype.simulate = function (dt, controlFunc)
{
    const state = {x: this.x ,theta: this.theta, dx: this.dx, dtheta: this.dtheta,T: this.T};

    if (this.measurementNoiseVariance > 0) {
        state.x += gaussianNoise(0, this.measurementNoiseVariance);
        state.dx += gaussianNoise(0, this.measurementNoiseVariance);
        state.theta += gaussianNoise(0, this.measurementNoiseVariance);
        state.dtheta += gaussianNoise(0, this.measurementNoiseVariance);
    }
    
    this.F_cmd = controlFunc(state);

    if(typeof this.F_cmd != 'number' || isNaN(this.F_cmd)) throw "Error: The controlFunction must return a number.";
    this.F_cmd = Math.max(-30,Math.min(30,this.F_cmd));
    integrationStep(this, ['x', 'theta', 'dx', 'dtheta'], dt);
}

Models.SinglePendulum.prototype.ode = function (z)
{
    var s = Math.sin(z[1]);
    var c = Math.cos(z[1]);
    var dthetasq = z[3] * z[3];
    
    var dx = z[2];
    var dtheta = z[3];

    var detD = this.L**2*this.m1*(this.m0 + this.m1*s**2);
    var ddx = this.m1*this.L**2*( this.m1*this.L*dthetasq*s - this.m1*this.g*c*s + this.F_cmd) / detD - this.lambda*c*z[2]*this.m1*this.L / detD;
    var ddtheta = this.m1*this.L*(-this.m1*this.L*dthetasq*c*s + (this.m0+this.m1)*this.g*s - this.F_cmd *c) / detD - this.lambda*(this.m0+this.m1) * z[2];

    if (this.processNoiseVariance > 0) {
        ddtheta += gaussianNoise(0, this.processNoiseVariance);  
        ddx += gaussianNoise(0, this.processNoiseVariance); 
    }

    return [dx, dtheta, ddx, ddtheta];
}


Models.SinglePendulum.prototype.draw = function (ctx, canvas)
{
    ctx.translate(0,-this.L);
    
    var cartWidth = 0.4*this.L;
    var cartHeight = 0.7*cartWidth;
    
    var tipX = this.x + this.L*Math.sin(this.theta);
    var tipY = this.L*Math.cos(this.theta)+cartHeight;
    
    // ground
    ctx.strokeStyle="#333366";
    drawLine(ctx,-100,-.025,100,-.025,0.05);
    
    // cart
    ctx.fillStyle="#4444FF";
    ctx.fillRect(this.x-cartWidth/2,0,cartWidth,cartHeight);
        
    // shaft
    ctx.strokeStyle="#AAAAFF";
    ctx.lineCap = 'round';
    drawLine(ctx,this.x,cartHeight,tipX,tipY,this.L/20.0);
        
    // tip-mass
    ctx.beginPath();
    ctx.arc(tipX, tipY, this.L/7, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#4444FF';
    ctx.fill();
    
    // force arrow
    ctx.strokeStyle="#FF0000";
    ctx.lineCap = 'round';
    drawArrow(ctx, this.x, 0.5*cartHeight, 0.1*this.F_cmd, 0, 0.05, this.L/40.0);
}

Models.SinglePendulum.prototype.infoText = function ()
{
    return  "/* Horizontal position       */ pendulum.x      = " + round(this.x,2)
        + "\n/* Horizontal velocity       */ pendulum.dx     = " + round(this.dx,2)
        + "\n/* Angle from vertical (rad) */ pendulum.theta  = " + round(this.theta,2)
        + "\n/* Angular velocity (rad/s)  */ pendulum.dtheta = " + round(this.dtheta,2)
        + "\n/* Simulation time (s)       */ pendulum.T      = " + round(this.T,2);    
}
