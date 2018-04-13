import {Earth} from './solar-system-objects/planets/earth';
import {Mars} from './solar-system-objects/planets/mars';
import {Sun} from './solar-system-objects/sun';
import {SphericalCoordinates} from './coordinates/spherical-coordinates';
import {Observer} from './observer';
import {Constants} from './constants';

describe('Observer', function() {
    const earth = new Earth();
    const mars = new Mars();
    const sun = new Sun();
    const earthObserver = new Observer(
        new SphericalCoordinates(
            Constants.GREENWICH_OBSERVATORY_COORDINATES.LATITUDE,
            Constants.GREENWICH_OBSERVATORY_COORDINATES.LONGITUDE,
            Constants.GREENWICH_OBSERVATORY_COORDINATES.RADIUS),
        earth
    );

    it('should calculate local sidereal time in epoch day zero correctly', function() {
        expect(earthObserver.getLocalSiderealTime(Constants.JULIAN_DAY_2000)).toBeCloseTo(280.4601, 4);
    });

    it('should calculate distance to solar system objects in epoch day zero correctly', function() {
        expect(earthObserver.getDistanceToSolarSystemObject(sun, Constants.JULIAN_DAY_2000)).toBeCloseTo(0.983, 3);
        expect(earthObserver.getDistanceToSolarSystemObject(mars, Constants.JULIAN_DAY_2000)).toBeCloseTo(1.849, 3);
    });

    it('should calculate distance to solar system objects in epoch day zero plus one decade correctly', function() {
        expect(earthObserver.getDistanceToSolarSystemObject(sun, Constants.JULIAN_DAY_2010)).toBeCloseTo(0.983, 3);
        expect(earthObserver.getDistanceToSolarSystemObject(mars, Constants.JULIAN_DAY_2010)).toBeCloseTo(0.739, 3);
    });

    it('should calculate RA/Dec to solar system objects in epoch day zero correctly', function() {
        const RADecForSun = earthObserver.getRADecCoordinatesForSolarSystemObject(sun, Constants.JULIAN_DAY_2000);
        expect(RADecForSun.latitude).toBeCloseTo(-23.03, 2);
        expect(RADecForSun.longitude).toBeCloseTo(281.29, 2);

        const RADecForMars = earthObserver.getRADecCoordinatesForSolarSystemObject(mars, Constants.JULIAN_DAY_2000);
        expect(RADecForMars.latitude).toBeCloseTo(-13.18, 2);
        expect(RADecForMars.longitude).toBeCloseTo(330.54, 2);
    });

    it('should calculate RA/Dec to solar system objects in epoch day zero plus one decade correctly', function() {
        const RADecForSun = earthObserver.getRADecCoordinatesForSolarSystemObject(sun, Constants.JULIAN_DAY_2010);
        expect(RADecForSun.latitude).toBeCloseTo(-23.04, 2);
        expect(RADecForSun.longitude).toBeCloseTo(281.22, 2);

        const RADecForMars = earthObserver.getRADecCoordinatesForSolarSystemObject(mars, Constants.JULIAN_DAY_2010);
        expect(RADecForMars.latitude).toBeCloseTo(18.79, 2);
        expect(RADecForMars.longitude).toBeCloseTo(142.35, 2);
    });

    it('should calculate Alt/Az to solar system objects in epoch day zero correctly', function() {
        const RADecForSun = earthObserver.getRADecCoordinatesForSolarSystemObject(sun, Constants.JULIAN_DAY_2000);
        const AltAzForSun = earthObserver.getAltAzCoordinatesForEquatorialCoordinates(RADecForSun, Constants.JULIAN_DAY_2000);
        expect(AltAzForSun.latitude).toBeCloseTo(15.49, 2);
        expect(AltAzForSun.longitude).toBeCloseTo(179.21, 2);

        const RADecForMars = earthObserver.getRADecCoordinatesForSolarSystemObject(mars, Constants.JULIAN_DAY_2000);
        const AltAzForMars = earthObserver.getAltAzCoordinatesForEquatorialCoordinates(RADecForMars, Constants.JULIAN_DAY_2000);
        expect(AltAzForMars.latitude).toBeCloseTo(12.17, 2);
        expect(AltAzForMars.longitude).toBeCloseTo(130.19, 2);
    });

});
