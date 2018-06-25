import {RectangularCoordinates} from './coordinates/rectangular-coordinates';
import {MathHelper} from './math-helper';
import {SphericalCoordinates} from './coordinates/spherical-coordinates';
import {TimeHelper} from './time-helper';
import {Constants} from './constants';

export class Observer {
    constructor(sphericalCoordinates, solarSystemObject) {
        this.sphericalCoordinates = sphericalCoordinates || new SphericalCoordinates(
            Constants.GREENWICH_OBSERVATORY_COORDINATES.LATITUDE,
            Constants.GREENWICH_OBSERVATORY_COORDINATES.LONGITUDE,
            Constants.GREENWICH_OBSERVATORY_COORDINATES.RADIUS
        );
        this.solarSystemObject = solarSystemObject;
    }

    getRectangularObjectCentricCoordinatesForSolarSystemObject(otherSolarSystemObject, julianDate) {
        return otherSolarSystemObject.getRectangularHeliocentricCoordinates(julianDate)
            .minus(this.solarSystemObject.getRectangularHeliocentricCoordinates(julianDate));
    }

    getRectangularEquatorialCoordinatesForSolarSystemObject(otherSolarSystemObject, julianDate) {
        const rectangularObjectCentricCoordinatesForSolarSystemObject =
            this.getRectangularObjectCentricCoordinatesForSolarSystemObject(otherSolarSystemObject, julianDate);
        const axialTiltInRadians = MathHelper.degreesToRadians(this.solarSystemObject.axialTilt);
        return new RectangularCoordinates(
            rectangularObjectCentricCoordinatesForSolarSystemObject.x,
            rectangularObjectCentricCoordinatesForSolarSystemObject.y * Math.cos(axialTiltInRadians) -
            rectangularObjectCentricCoordinatesForSolarSystemObject.z * Math.sin(axialTiltInRadians),
            rectangularObjectCentricCoordinatesForSolarSystemObject.y * Math.sin(axialTiltInRadians) +
            rectangularObjectCentricCoordinatesForSolarSystemObject.z * Math.cos(axialTiltInRadians)
        );
    }

    getDistanceToSolarSystemObject(otherSolarSystemObject, julianDate) {
        const objectCentricCoordinates = this.getRectangularObjectCentricCoordinatesForSolarSystemObject(otherSolarSystemObject, julianDate);
        return Math.sqrt(Math.pow(objectCentricCoordinates.x, 2) + Math.pow(objectCentricCoordinates.y, 2) + Math.pow(objectCentricCoordinates.z, 2));
    }

    getRADecCoordinatesForSolarSystemObject(otherSolarSystemObject, julianDate) {
        const equatorialCoordinates =
            this.getRectangularEquatorialCoordinatesForSolarSystemObject(otherSolarSystemObject, julianDate);
        const correction = (equatorialCoordinates.x > 0 && equatorialCoordinates.y < 0) ? 360 : (equatorialCoordinates.x < 0) ? 180 : 0;
        const rightAscension = MathHelper.radiansToDegrees(Math.atan(equatorialCoordinates.y / equatorialCoordinates.x)) + correction;
        const declination = MathHelper.radiansToDegrees(Math.atan(equatorialCoordinates.z / Math.sqrt(Math.pow(equatorialCoordinates.x, 2) + Math.pow(equatorialCoordinates.y, 2))));
        return new SphericalCoordinates(declination, rightAscension, this.getDistanceToSolarSystemObject(otherSolarSystemObject, julianDate));
    }

    getAltAzCoordinatesForEquatorialCoordinates(equatorialCoordinates, julianDate) {
        const hourAngle = MathHelper.degreesToRadians(MathHelper.modDegrees(equatorialCoordinates.longitude - this.getLocalSiderealTime(julianDate)));
        const latitude = MathHelper.degreesToRadians(this.sphericalCoordinates.latitude);
        const declination = MathHelper.degreesToRadians(equatorialCoordinates.latitude);
        const altitude = MathHelper.radiansToDegrees(Math.asin(Math.sin(latitude) * Math.sin(declination) + Math.cos(latitude) * Math.cos(declination) * Math.cos(hourAngle)));
        const azimuth = MathHelper.radiansToDegrees(Math.PI - Math.atan2(Math.sin(hourAngle), Math.cos(hourAngle) * Math.sin(latitude) - Math.tan(declination) * Math.cos(latitude)));
        return new SphericalCoordinates(altitude, azimuth, null);
    }

    getLocalSiderealTime(julianDate) {
        return MathHelper.modDegrees(TimeHelper.meanSiderealTime(julianDate) + this.sphericalCoordinates.longitude);
    }

    getObjectTransit(otherSolarSystemObject, julianDate) {
        const rightAscension = this.getRADecCoordinatesForSolarSystemObject(otherSolarSystemObject, julianDate).longitude;
        return this.getLocalSiderealTime(julianDate) - rightAscension;
    }

    getObjectLocalHourAngleForAltitude(otherSolarSystemObject, julianDate, altitude) {
        const observerLatitude = MathHelper.degreesToRadians(this.sphericalCoordinates.latitude);
        const objectAltitude = MathHelper.degreesToRadians(altitude);
        let objectDeclination = MathHelper.degreesToRadians(this.getRADecCoordinatesForSolarSystemObject(otherSolarSystemObject, julianDate).latitude);
        const localHourAngle = (Math.sin(objectAltitude) - Math.sin(observerLatitude) * Math.sin(objectDeclination)) / (Math.cos(observerLatitude) * Math.cos(objectDeclination));
        return MathHelper.radiansToDegrees(Math.acos(localHourAngle));
    }

    getIterationValueForPositionalEphemerisForObject(otherSolarSystemObject, julianDate, ephemerisType) {
        if (ephemerisType === Constants.EPHEMERIS_TYPE.TRANSIT) {
            return julianDate - this.getObjectTransit(otherSolarSystemObject, julianDate) / 15 / 24;
        } else if (ephemerisType === Constants.EPHEMERIS_TYPE.RISE) {
            const objectTransit = this.getObjectTransit(otherSolarSystemObject, julianDate);
            const localHourAngle = this.getObjectLocalHourAngleForAltitude(otherSolarSystemObject, julianDate, Constants.SUN_ALTITUDE_FOR_EPHEMERIS.RISE_OR_SET);
            const angleUntilRise = MathHelper.mod180Degrees(objectTransit + localHourAngle);
            return julianDate - angleUntilRise / 15 / 24;
        } else if (ephemerisType === Constants.EPHEMERIS_TYPE.SET) {
            const objectTransit = this.getObjectTransit(otherSolarSystemObject, julianDate);
            const localHourAngle = this.getObjectLocalHourAngleForAltitude(otherSolarSystemObject, julianDate, Constants.SUN_ALTITUDE_FOR_EPHEMERIS.RISE_OR_SET);
            const angleUntilRise = MathHelper.mod180Degrees(objectTransit - localHourAngle);
            return julianDate - angleUntilRise / 15 / 24;
        }
    }

    getPositionalEphemerisForObject(otherSolarSystemObject, julianDate, ephemerisType) {
        let result = this.getIterationValueForPositionalEphemerisForObject(otherSolarSystemObject, julianDate, ephemerisType);
        let oldResult = +result;
        for (let loopCount = 0; loopCount < 1000; loopCount++) {
            result = this.getIterationValueForPositionalEphemerisForObject(otherSolarSystemObject, result, ephemerisType);
            if (Math.abs(result - oldResult) < 10 ^ -5) {
                break;
            }
            oldResult = result;
        }
        return TimeHelper.julianDateToDate(result);
    }
}
