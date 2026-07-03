import { AngleCalculator } from "./angle-calculator.js";
import { JulianDateCalculator } from "./time/julian-date-calculator.js";
import { Constants } from "./constants.js";
import { EclipticRectangularCoordinates } from "./coordinates/types/ecliptic-rectangular-coordinates.js";
import { CoordinatesConverter } from "./coordinates/coordinates-converter.js";
import { EquatorialSphericalCoordinates } from "./coordinates/types/equatorial-spherical-coordinates.js";
import { TopocentricEquatorialHourAngleDeclinationCoordinates } from "./coordinates/types/topocentric-equatorial-hour-angle-declination-coordinates.js";
import { Earth } from "./solar-system-objects/planets/earth.js";
import { Moon } from "./solar-system-objects/satellites/moon.js";

/**
 * @class AstronomicalCalculator
 * @description Class for calculating astronomical coordinates and ephemeris.
 */
export class AstronomicalCalculator {
  /**
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {SolarSystemObject} otherSolarSystemObject - other solar system object
   * @param {number} julianDate - Julian date
   * @returns {TopocentricEquatorialSphericalCoordinates} - topocentric equatorial spherical coordinates
   */
  static getTopocentricEquatorialSphericalCoordinates(
    observerLocation,
    otherSolarSystemObject,
    julianDate,
  ) {
    const observerEclipticRectangularHeliocentricCoordinates =
      observerLocation.center.getRectangularHeliocentricCoordinates(julianDate);

    const otherSolarSystemObjectEclipticRectangularHeliocentricCoordinates =
      otherSolarSystemObject.getRectangularHeliocentricCoordinates(julianDate);

    const eclipticRectangularObserverCoordinates =
      otherSolarSystemObjectEclipticRectangularHeliocentricCoordinates.minus(
        observerEclipticRectangularHeliocentricCoordinates,
        otherSolarSystemObjectEclipticRectangularHeliocentricCoordinates.center,
      );

    const eclipticSphericalObserverCoordinates =
      CoordinatesConverter.eclipticRectangularToEclipticSphericalCoordinates(
        eclipticRectangularObserverCoordinates,
      );

    const equatorialSphericalObserverCoordinates =
      CoordinatesConverter.eclipticSphericalToEquatorialSphericalCoordinates(
        eclipticSphericalObserverCoordinates,
        observerLocation.center.getObliquity(julianDate),
      );

    const rightAscension =
      equatorialSphericalObserverCoordinates.rightAscension;
    const declination = equatorialSphericalObserverCoordinates.declination;
    const distance = equatorialSphericalObserverCoordinates.delta;

    const localMeanSiderealTime = this.getLocalMeanSiderealTime(
      observerLocation,
      julianDate,
    );

    const equatorialCoordinates = new EquatorialSphericalCoordinates(
      rightAscension,
      declination,
      distance,
      observerLocation.center.getObliquity(julianDate),
      observerLocation.center,
    );

    return CoordinatesConverter.equatorialSphericalToTopocentricEquatorialSphericalCoordinates(
      equatorialCoordinates,
      observerLocation,
      localMeanSiderealTime,
    );
  }

  /**
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {SolarSystemObject} otherSolarSystemObject - other solar system object
   * @param {number} julianDate - Julian date
   * @returns {TopocentricHorizontalSphericalCoordinates} - topocentric horizontal spherical coordinates
   */
  static getTopocentricHorizontalSphericalCoordinatesForSolarSystemObject(
    observerLocation,
    otherSolarSystemObject,
    julianDate,
  ) {
    const topocentricEquatorialRightAscensionDeclinationCoordinates =
      AstronomicalCalculator.getTopocentricEquatorialSphericalCoordinates(
        observerLocation,
        otherSolarSystemObject,
        julianDate,
      );

    const localMeanSiderealTime = this.getLocalMeanSiderealTime(
      observerLocation,
      julianDate,
    );

    return CoordinatesConverter.topocentricEquatorialToTopocentricHorizontalSphericalCoordinates(
      topocentricEquatorialRightAscensionDeclinationCoordinates,
      localMeanSiderealTime,
    );
  }

  /**
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {SolarSystemObject} otherSolarSystemObject - other solar system object
   * @param {number} julianDate - Julian date
   * @returns {EclipticRectangularCoordinates} - rectangular object-centric coordinates
   */
  static getRectangularObjectCentricCoordinatesForSolarSystemObject(
    observerLocation,
    otherSolarSystemObject,
    julianDate,
  ) {
    return otherSolarSystemObject
      .getRectangularHeliocentricCoordinates(julianDate)
      .minus(
        observerLocation.center.getRectangularHeliocentricCoordinates(
          julianDate,
        ),
        observerLocation.center,
      );
  }

  /**
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {SolarSystemObject} otherSolarSystemObject - other solar system object
   * @param {number} julianDate - Julian date
   * @returns {EclipticRectangularCoordinates} - rectangular equatorial coordinates
   */
  static getRectangularEquatorialCoordinatesForSolarSystemObject(
    observerLocation,
    otherSolarSystemObject,
    julianDate,
  ) {
    const rectangularObjectCentricCoordinatesForSolarSystemObject =
      this.getRectangularObjectCentricCoordinatesForSolarSystemObject(
        observerLocation,
        otherSolarSystemObject,
        julianDate,
      );
    const axialTiltInRadians = AngleCalculator.degreesToRadians(
      observerLocation.center.axialTilt,
    );
    return new EclipticRectangularCoordinates(
      rectangularObjectCentricCoordinatesForSolarSystemObject.x,
      rectangularObjectCentricCoordinatesForSolarSystemObject.y *
        Math.cos(axialTiltInRadians) -
        rectangularObjectCentricCoordinatesForSolarSystemObject.z *
          Math.sin(axialTiltInRadians),
      rectangularObjectCentricCoordinatesForSolarSystemObject.y *
        Math.sin(axialTiltInRadians) +
        rectangularObjectCentricCoordinatesForSolarSystemObject.z *
          Math.cos(axialTiltInRadians),
    );
  }

  /**
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {SolarSystemObject} otherSolarSystemObject - other solar system object
   * @param {number} julianDate - Julian date
   * @returns {number} - distance in astronomical units
   */
  static getDistanceToSolarSystemObject(
    observerLocation,
    otherSolarSystemObject,
    julianDate,
  ) {
    const objectCentricCoordinates =
      this.getRectangularObjectCentricCoordinatesForSolarSystemObject(
        observerLocation,
        otherSolarSystemObject,
        julianDate,
      );
    return Math.sqrt(
      Math.pow(objectCentricCoordinates.x, 2) +
        Math.pow(objectCentricCoordinates.y, 2) +
        Math.pow(objectCentricCoordinates.z, 2),
    );
  }

  /**
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {SolarSystemObject} otherSolarSystemObject - other solar system object
   * @param {number} julianDate - Julian date
   * @returns {TopocentricEquatorialHourAngleDeclinationCoordinates} - HA-Dec coordinates
   */
  static getHADecCoordinatesForSolarSystemObject(
    observerLocation,
    otherSolarSystemObject,
    julianDate,
  ) {
    const topocentricEquatorialRightAscensionDeclinationCoordinates =
      this.getTopocentricEquatorialSphericalCoordinates(
        observerLocation,
        otherSolarSystemObject,
        julianDate,
      );
    return new TopocentricEquatorialHourAngleDeclinationCoordinates(
      AngleCalculator.modDegrees(
        AstronomicalCalculator.getLocalMeanSiderealTime(
          observerLocation,
          julianDate,
        ) -
          topocentricEquatorialRightAscensionDeclinationCoordinates.rightAscension,
      ),
      topocentricEquatorialRightAscensionDeclinationCoordinates.declination,
      topocentricEquatorialRightAscensionDeclinationCoordinates.distance,
    );
  }

  /**
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {number} julianDate - Julian date
   * @returns {number} - local mean sidereal time in degrees
   */
  static getLocalMeanSiderealTime(observerLocation, julianDate) {
    return AngleCalculator.modDegrees(
      observerLocation.center.getPrimeMeridianMeanSiderealTime(julianDate) +
        observerLocation.longitude,
    );
  }

  /**
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {SolarSystemObject} otherSolarSystemObject - other solar system object
   * @param {number} julianDate - Julian date
   * @returns {number} - transit time as an angle
   */
  static getObjectTransit(
    observerLocation,
    otherSolarSystemObject,
    julianDate,
  ) {
    const rightAscension = this.getTopocentricEquatorialSphericalCoordinates(
      observerLocation,
      otherSolarSystemObject,
      julianDate,
    ).rightAscension;
    return (
      this.getLocalMeanSiderealTime(observerLocation, julianDate) -
      rightAscension
    );
  }

  /**
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {SolarSystemObject} otherSolarSystemObject - other solar system object
   * @param {number} julianDate - Julian date
   * @returns {number} - lower transit time as an angle
   */
  static getObjectLowerTransit(
    observerLocation,
    otherSolarSystemObject,
    julianDate,
  ) {
    const rightAscension = this.getTopocentricEquatorialSphericalCoordinates(
      observerLocation,
      otherSolarSystemObject,
      julianDate,
    ).rightAscension;
    const angle =
      this.getLocalMeanSiderealTime(observerLocation, julianDate) -
      rightAscension -
      180;
    return AngleCalculator.mod180Degrees(angle);
  }

  /**
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {SolarSystemObject} otherSolarSystemObject - other solar system object
   * @param {number} julianDate - Julian date
   * @param {number} altitude - altitude in degrees
   * @returns {number} - local hour angle in degrees
   */
  static getObjectLocalHourAngleForAltitude(
    observerLocation,
    otherSolarSystemObject,
    julianDate,
    altitude,
  ) {
    const observerLatitude = AngleCalculator.degreesToRadians(
      observerLocation.latitude,
    );
    const objectAltitude = AngleCalculator.degreesToRadians(altitude);
    const objectDeclination = AngleCalculator.degreesToRadians(
      this.getTopocentricEquatorialSphericalCoordinates(
        observerLocation,
        otherSolarSystemObject,
        julianDate,
      ).declination,
    );
    const localHourAngle =
      (Math.sin(objectAltitude) -
        Math.sin(observerLatitude) * Math.sin(objectDeclination)) /
      (Math.cos(observerLatitude) * Math.cos(objectDeclination));
    return AngleCalculator.radiansToDegrees(Math.acos(localHourAngle));
  }

  /**
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {SolarSystemObject} solarSystemObject - solar system object
   * @param {number} julianDate - Julian date
   * @param {object} ephemerisType - type of ephemeris
   * @returns {number} - iteration value as Julian date
   */
  static getIterationValueForPositionalEphemerisForObject(
    observerLocation,
    solarSystemObject,
    julianDate,
    ephemerisType,
  ) {
    if (ephemerisType === Constants.EPHEMERIS_TYPE.TRANSIT) {
      return (
        julianDate -
        this.getObjectTransit(observerLocation, solarSystemObject, julianDate) /
          15 /
          24
      );
    } else if (ephemerisType === Constants.EPHEMERIS_TYPE.LOWER_TRANSIT) {
      return (
        julianDate -
        this.getObjectLowerTransit(
          observerLocation,
          solarSystemObject,
          julianDate,
        ) /
          15 /
          24
      );
    } else {
      const objectTransit = this.getObjectTransit(
        observerLocation,
        solarSystemObject,
        julianDate,
      );
      const localHourAngle = this.getObjectLocalHourAngleForAltitude(
        observerLocation,
        solarSystemObject,
        julianDate,
        ephemerisType.ALTITUDE,
      );
      const angleUntilRise = AngleCalculator.mod180Degrees(
        ephemerisType.IS_GOING_UP
          ? objectTransit + localHourAngle
          : objectTransit - localHourAngle,
      );
      return julianDate - angleUntilRise / 15 / 24;
    }
  }

  /**
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {SolarSystemObject} otherSolarSystemObject - other solar system object
   * @param {number} julianDate - Julian date
   * @param {object} ephemerisType - type of ephemeris
   * @returns {Date} - date of the ephemeris event
   */
  static iteratePositionalEphemerisForObject(
    observerLocation,
    otherSolarSystemObject,
    julianDate,
    ephemerisType,
  ) {
    let result = this.getIterationValueForPositionalEphemerisForObject(
      observerLocation,
      otherSolarSystemObject,
      julianDate,
      ephemerisType,
    );
    let oldResult = +result;
    for (let loopCount = 0; loopCount < 1000 && !isNaN(result); loopCount++) {
      result = this.getIterationValueForPositionalEphemerisForObject(
        observerLocation,
        otherSolarSystemObject,
        result,
        ephemerisType,
      );
      if (Math.abs(result - oldResult) < 1e-5) {
        break;
      }
      oldResult = result;
    }
    return JulianDateCalculator.julianDateToDate(result);
  }

  /**
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {SolarSystemObject} otherSolarSystemObject - other solar system object
   * @param {number} julianDate - Julian date
   * @param {object} ephemerisType - type of ephemeris
   * @param {number} numberOfAttemptsLeft - number of attempts left
   * @returns {Date|null} - correct date of the ephemeris event or null if not found
   */
  static getCorrectDateForPositionalEphemeris(
    observerLocation,
    otherSolarSystemObject,
    julianDate,
    ephemerisType,
    numberOfAttemptsLeft,
  ) {
    const result = this.iteratePositionalEphemerisForObject(
      observerLocation,
      otherSolarSystemObject,
      julianDate,
      ephemerisType,
    );
    if (
      numberOfAttemptsLeft > 0 &&
      result.getDate() !==
        JulianDateCalculator.julianDateToDate(julianDate).getDate()
    ) {
      const resultAsJulianDate = JulianDateCalculator.julianDate(result);
      const deltaDays = resultAsJulianDate > julianDate ? -1 : 1;
      return this.getCorrectDateForPositionalEphemeris(
        observerLocation,
        otherSolarSystemObject,
        resultAsJulianDate + deltaDays,
        ephemerisType,
        numberOfAttemptsLeft - 1,
      );
    } else if (numberOfAttemptsLeft === 0) {
      return null;
    } else {
      return result;
    }
  }

  /**
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {SolarSystemObject} solarSystemObject - solar system object
   * @param {number} julianDate - Julian date
   * @param {object} ephemerisType - type of ephemeris
   * @returns {Date|null} - date of the positional ephemeris or null if not found
   */
  static getDateForPositionalEphemeris(
    observerLocation,
    solarSystemObject,
    julianDate,
    ephemerisType,
  ) {
    return this.getCorrectDateForPositionalEphemeris(
      observerLocation,
      solarSystemObject,
      julianDate,
      ephemerisType,
      Constants.NUMBERS_OF_ATTEMPT_TO_GET_POSITIONAL_EPHEMERIS,
    );
  }

  /**
   * @param {number} julianDate - Julian date
   * @returns {number} - geocentric Moon-Sun elongation in degrees
   */
  static getMoonPhaseAngle(julianDate) {
    const earth = new Earth();
    const moon = new Moon();
    const earthHeliocentricPosition =
      earth.getRectangularHeliocentricCoordinates(julianDate);
    const moonHeliocentricPosition =
      moon.getRectangularHeliocentricCoordinates(julianDate);

    const moonGeocentricPosition = moonHeliocentricPosition.minus(
      earthHeliocentricPosition,
      earth,
    );
    const sunGeocentricPosition = new EclipticRectangularCoordinates(
      -earthHeliocentricPosition.x,
      -earthHeliocentricPosition.y,
      -earthHeliocentricPosition.z,
      earth,
    );
    const moonEclipticSphericalCoordinates =
      CoordinatesConverter.eclipticRectangularToEclipticSphericalCoordinates(
        moonGeocentricPosition,
      );
    const sunEclipticSphericalCoordinates =
      CoordinatesConverter.eclipticRectangularToEclipticSphericalCoordinates(
        sunGeocentricPosition,
      );

    return AngleCalculator.modDegrees(
      moonEclipticSphericalCoordinates.lambda -
        sunEclipticSphericalCoordinates.lambda,
    );
  }

  /**
   * @param {number} julianDate - Julian date
   * @param {number} phaseAngle - target phase angle in degrees
   * @returns {number} - signed phase angle difference in degrees
   */
  static getMoonPhaseAngleDifference(julianDate, phaseAngle) {
    return AngleCalculator.mod180Degrees(
      this.getMoonPhaseAngle(julianDate) - phaseAngle,
    );
  }

  /**
   * @param {number} julianDate - Julian date
   * @param {number} phaseAngle - target phase angle in degrees
   * @param {number} searchDirection - 1 for next phase, -1 for previous phase
   * @returns {number} - Julian date of the target phase
   */
  static getJulianDateForMoonPhase(julianDate, phaseAngle, searchDirection) {
    const currentDifference = this.getMoonPhaseAngleDifference(
      julianDate,
      phaseAngle,
    );
    if (Math.abs(currentDifference) < 1e-7) {
      return julianDate;
    }

    const currentPhaseAngle = this.getMoonPhaseAngle(julianDate);
    const phaseDistance =
      searchDirection > 0
        ? AngleCalculator.modDegrees(phaseAngle - currentPhaseAngle)
        : AngleCalculator.modDegrees(currentPhaseAngle - phaseAngle);
    const daysToPhase =
      (phaseDistance / 360) * Constants.LUNAR_SYNODIC_MONTH_DAYS;
    const estimatedJulianDate = julianDate + searchDirection * daysToPhase;
    let lowerJulianDate = estimatedJulianDate - 2;
    let upperJulianDate = estimatedJulianDate + 2;
    let lowerDifference = this.getMoonPhaseAngleDifference(
      lowerJulianDate,
      phaseAngle,
    );
    let upperDifference = this.getMoonPhaseAngleDifference(
      upperJulianDate,
      phaseAngle,
    );

    for (
      let attempt = 0;
      attempt < 20 && lowerDifference * upperDifference > 0;
      attempt++
    ) {
      lowerJulianDate = lowerJulianDate - 1;
      upperJulianDate = upperJulianDate + 1;
      lowerDifference = this.getMoonPhaseAngleDifference(
        lowerJulianDate,
        phaseAngle,
      );
      upperDifference = this.getMoonPhaseAngleDifference(
        upperJulianDate,
        phaseAngle,
      );
    }

    if (Math.abs(lowerDifference) < 1e-7) {
      return lowerJulianDate;
    }
    if (Math.abs(upperDifference) < 1e-7) {
      return upperJulianDate;
    }
    if (lowerDifference * upperDifference > 0) {
      throw new Error("Unable to bracket the requested Moon phase");
    }

    for (let loopCount = 0; loopCount < 100; loopCount++) {
      const middleJulianDate = (lowerJulianDate + upperJulianDate) / 2;
      const middleDifference = this.getMoonPhaseAngleDifference(
        middleJulianDate,
        phaseAngle,
      );

      if (
        Math.abs(middleDifference) < 1e-8 ||
        upperJulianDate - lowerJulianDate < 1e-7
      ) {
        return middleJulianDate;
      }

      if (lowerDifference * middleDifference <= 0) {
        upperJulianDate = middleJulianDate;
        upperDifference = middleDifference;
      } else {
        lowerJulianDate = middleJulianDate;
        lowerDifference = middleDifference;
      }
    }

    return (lowerJulianDate + upperJulianDate) / 2;
  }

  /**
   * @param {number} julianDate - Julian date
   * @param {number} phaseAngle - target phase angle in degrees
   * @returns {number} - Julian date of the next target phase
   */
  static getNextJulianDateForMoonPhase(julianDate, phaseAngle) {
    return this.getJulianDateForMoonPhase(julianDate, phaseAngle, 1);
  }

  /**
   * @param {number} julianDate - Julian date
   * @param {number} phaseAngle - target phase angle in degrees
   * @returns {number} - Julian date of the previous target phase
   */
  static getPreviousJulianDateForMoonPhase(julianDate, phaseAngle) {
    return this.getJulianDateForMoonPhase(julianDate, phaseAngle, -1);
  }

  /**
   * @param {string|object} moonPhase - Moon phase name or phase object
   * @returns {{NAME: string, ANGLE: number}} - Moon phase definition
   */
  static getMoonPhase(moonPhase) {
    const phase = Object.values(Constants.MOON_PHASE).find((moonPhaseType) => {
      return (
        moonPhaseType === moonPhase ||
        moonPhaseType.NAME === moonPhase ||
        moonPhaseType.NAME === moonPhase?.NAME
      );
    });

    if (!phase) {
      throw new Error(`Moon phase "${moonPhase}" not found`);
    }

    return phase;
  }

  /**
   * @param {string|object} moonPhase - Moon phase name or phase object
   * @param {number} julianDate - Julian date
   * @returns {Date} - next date when the Moon reaches the target phase
   */
  static getNextMoonPhaseDate(moonPhase, julianDate) {
    const phase = this.getMoonPhase(moonPhase);
    return JulianDateCalculator.julianDateToDate(
      this.getNextJulianDateForMoonPhase(julianDate, phase.ANGLE),
    );
  }

  /**
   * @param {string|object} moonPhase - Moon phase name or phase object
   * @param {number} julianDate - Julian date
   * @returns {Date} - previous date when the Moon reached the target phase
   */
  static getPreviousMoonPhaseDate(moonPhase, julianDate) {
    const phase = this.getMoonPhase(moonPhase);
    return JulianDateCalculator.julianDateToDate(
      this.getPreviousJulianDateForMoonPhase(julianDate, phase.ANGLE),
    );
  }

  /**
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {SolarSystemObject} solarSystemObject - solar system object
   * @param {number} julianDate - Julian date
   * @returns {number} - fraction between 0 and 1 representing the illumination of the object
   */
  static getIlluminatedFractionForObject(
    observerLocation,
    solarSystemObject,
    julianDate,
  ) {
    const observerHeliocentricPosition =
      observerLocation.center.getRectangularHeliocentricCoordinates(julianDate);
    const otherSolarSystemObjectRectangularHeliocentricCoordinates =
      solarSystemObject.getRectangularHeliocentricCoordinates(julianDate);

    const otherSolarSystemObjectPositionToTheSun = {
      x: -otherSolarSystemObjectRectangularHeliocentricCoordinates.x,
      y: -otherSolarSystemObjectRectangularHeliocentricCoordinates.y,
      z: -otherSolarSystemObjectRectangularHeliocentricCoordinates.z,
    };

    const otherSolarSystemObjectPositionToTheObserver = {
      x:
        observerHeliocentricPosition.x -
        otherSolarSystemObjectRectangularHeliocentricCoordinates.x,
      y:
        observerHeliocentricPosition.y -
        otherSolarSystemObjectRectangularHeliocentricCoordinates.y,
      z:
        observerHeliocentricPosition.z -
        otherSolarSystemObjectRectangularHeliocentricCoordinates.z,
    };

    const dotProduct =
      otherSolarSystemObjectPositionToTheSun.x *
        otherSolarSystemObjectPositionToTheObserver.x +
      otherSolarSystemObjectPositionToTheSun.y *
        otherSolarSystemObjectPositionToTheObserver.y +
      otherSolarSystemObjectPositionToTheSun.z *
        otherSolarSystemObjectPositionToTheObserver.z;

    const otherSolarSystemObjectPositionToTheSunMagnitude = Math.sqrt(
      otherSolarSystemObjectPositionToTheSun.x *
        otherSolarSystemObjectPositionToTheSun.x +
        otherSolarSystemObjectPositionToTheSun.y *
          otherSolarSystemObjectPositionToTheSun.y +
        otherSolarSystemObjectPositionToTheSun.z *
          otherSolarSystemObjectPositionToTheSun.z,
    );

    const otherSolarSystemObjectPositionToTheObserverMagnitude = Math.sqrt(
      otherSolarSystemObjectPositionToTheObserver.x *
        otherSolarSystemObjectPositionToTheObserver.x +
        otherSolarSystemObjectPositionToTheObserver.y *
          otherSolarSystemObjectPositionToTheObserver.y +
        otherSolarSystemObjectPositionToTheObserver.z *
          otherSolarSystemObjectPositionToTheObserver.z,
    );

    const cosPhaseAngle = Math.max(
      -1,
      Math.min(
        1,
        dotProduct /
          (otherSolarSystemObjectPositionToTheSunMagnitude *
            otherSolarSystemObjectPositionToTheObserverMagnitude),
      ),
    );

    return (1 + cosPhaseAngle) / 2;
  }
}
