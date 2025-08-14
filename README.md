# ControlChallenges

ControlChallenges is a collection of interactive control systems exercises designed for the course EL2620 – Nonlinear Control at KTH.
You can try it online here:
[https://mbarreau.github.io/ControlChallenges/](https://mbarreau.github.io/ControlChallenges/)

## Overview

This repository contains three control scenarios:
- Tutorial
- Inverted Pendulum
- Inverted Pendulum on a Cart

For each system, you can access its state variables in `controlFunction` by using the object name of the model:  

| System                          | Variables Available |
|---------------------------------|---------------------|
| **Tutorial**                    | `block.x`, `block.dx` |
| **Inverted Pendulum**           | `pendulum.theta`, `pendulum.dtheta` |
| **Inverted Pendulum on Cart**   | `pendulum.theta`, `pendulum.dtheta`, `pendulum.x`, `pendulum.dx` |

---

## Writing a Controller

Your controller must be defined inside:

```javascript
function controlFunction(pendulum) {
    // Your code here
}
```

For example, a linear state-feedback controller could look like this:

```javascript
function controlFunction(pendulum) {
  let u_fb = - 5 * pendulum.theta 
             + 2 * pendulum.dtheta 
             - 4 * pendulum.x 
             - 0.5 * pendulum.dx;
  
  return u_fb;
}
```

### Important: Defining Model Parameters

If you use model parameters inside your controller, you must explicitly define them within the function. For example:

```javascript
function controlFunction(pendulum) {
  let m1 = 0.5  // pendulum mass (kg)
  let L = 1.0  // pendulum length (m)

  let u_fb = - 5 * pendulum.theta 
             + m1 * L * pendulum.dtheta;
  
  return u_fb;
}
```

## Varying Simulation Parameters

You can test your controllers under different conditions:

- **Process Noise** and **Measurement Noise** – choose between *None*, *Low*, or *High* from the dropdown menus.  
- **Initial Conditions** – set the starting values for all state variables from the dropdown menus.
