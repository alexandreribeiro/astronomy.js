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
}
