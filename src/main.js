import {TimeHelper} from "./time-helper";
import {Observer} from "./observer";
import {SphericalCoordinates} from "./coordinates/spherical-coordinates";
import {SOLAR_SYSTEM_OBJECTS_LIST} from "./solar-system-objects/solar-system-objects-list";

export const MainModule = {
    _skyObjects: [].concat(SOLAR_SYSTEM_OBJECTS_LIST),
    _observer: new Observer(),
    _julianDate: null,
    _date: null,

    getJulianDate: function() {
        return this._julianDate;
    },
    setJulianDate: function(newJulianDate) {
        this._julianDate = newJulianDate;
    },
    getDate: function() {
        return this._date || new Date();
    },
    setDate: function(newDate) {
        this._date = newDate;
        this.setJulianDate(TimeHelper.julianDate(newDate));
    },
    getSkyObjectByName: function(objectName) {
        return this._skyObjects.find(function(element) {
            return element.name === objectName;
        });
    },
    setObserverLocation: function(objectName, latitude, longitude, elevationFromObjectSurface) {
        const solarSystemObject = this.getSkyObjectByName(objectName);
        this._observer = new Observer(
            new SphericalCoordinates(latitude, longitude, solarSystemObject.meanRadius + elevationFromObjectSurface),
            solarSystemObject
        );
    },
    getRADecCoordinatesForObject: function(objectName) {
        return this._observer.getRADecCoordinatesForSolarSystemObject(this.getSkyObjectByName(objectName), this.getJulianDate());
    },
    getAltAzCoordinatesForObject: function(objectName) {
        const equatorialCoordinates = this._observer.getRADecCoordinatesForSolarSystemObject(this.getSkyObjectByName(objectName), this.getJulianDate());
        return this._observer.getAltAzCoordinatesForEquatorialCoordinates(equatorialCoordinates, this.getJulianDate());
    }
};
