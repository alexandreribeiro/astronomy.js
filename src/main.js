import {TimeHelper} from './time-helper';
import {Observer} from './observer';
import {SphericalCoordinates} from './coordinates/spherical-coordinates';
import {SOLAR_SYSTEM_OBJECTS_LIST} from './solar-system-objects/solar-system-objects-list';
import {Constants} from './constants';

export const MainModule = {
    _skyObjects: [].concat(SOLAR_SYSTEM_OBJECTS_LIST),
    _observer: new Observer(),
    _julianDate: null,
    _date: null,

    getJulianDate: function () {
        return this._julianDate;
    },
    setJulianDate: function (newJulianDate) {
        this._julianDate = newJulianDate;
    },
    getDate: function () {
        return this._date;
    },
    setDate: function (newDate) {
        this._date = newDate;
        this.setJulianDate(TimeHelper.julianDate(newDate));
    },
    getSkyObjectByName: function (objectName) {
        for (let i in this._skyObjects) {
            if (this._skyObjects[i].name === objectName) {
                return this._skyObjects[i];
            }
        }
        return null;
    },
    getEphemerisTypeByName: function (objectName) {
        for (let i in Constants.EPHEMERIS_TYPE) {
            if (Constants.EPHEMERIS_TYPE[i].NAME === objectName) {
                return Constants.EPHEMERIS_TYPE[i];
            }
        }
        return null;
    },
    setObserverLocation: function (objectName, latitude, longitude, elevationFromObjectSurface) {
        const solarSystemObject = this.getSkyObjectByName(objectName);
        this._observer = new Observer(
            new SphericalCoordinates(latitude, longitude, solarSystemObject.meanRadius + elevationFromObjectSurface),
            solarSystemObject
        );
    },
    getRADecCoordinatesForObject: function (objectName) {
        return this._observer.getRADecCoordinatesForSolarSystemObject(this.getSkyObjectByName(objectName), this.getJulianDate());
    },
    getAltAzCoordinatesForObject: function (objectName, referenceDate) {
        referenceDate = referenceDate ? TimeHelper.julianDate(referenceDate) : this.getJulianDate();
        const equatorialCoordinates = this._observer.getRADecCoordinatesForSolarSystemObject(this.getSkyObjectByName(objectName), referenceDate);
        return this._observer.getAltAzCoordinatesForEquatorialCoordinates(equatorialCoordinates, referenceDate);
    },
    getEphemerisDateForObject: function (objectName, referenceDate, ephemerisTypeName) {
        const solarSystemObject = this.getSkyObjectByName(objectName);
        const ephemerisType = this.getEphemerisTypeByName(ephemerisTypeName);
        return this._observer.getDateForPositionalEphemeris(solarSystemObject, TimeHelper.julianDate(referenceDate), ephemerisType);
    }
};
