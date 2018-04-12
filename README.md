AstronomyJS
===========

Astronomic calculations in javascript.
You can see this project running at: <https://rawgit.com/alexandreribeiro/astronomy.js/master/sample.html>

## Quick guide

```javascript
AstronomyJS.setObserverLocation('Earth', 0, 0, 0);
AstronomyJS.setDate(new Date());
AstronomyJS.getAltAzCoordinatesForObject('Sun');
```

## Tests

`npm run test`

## About

This library provides astronomical calculations for leisure purposes only.
Some important basic aspects are not implemented, such as:
- Atmospheric refraction
- Earth's oblation
- Orbit perturbations

## References
US Naval Observatory, Explanatory Supplement to the Astronomical Almanac, 1992