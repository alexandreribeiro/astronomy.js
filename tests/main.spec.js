import { MainModule } from "../src/main3.js";
import { Constants } from "../src/constants";

describe("MainModule", function () {
  const EPOCH_2000_DATE = Date.UTC(2000, 0, 1, 12);
  beforeEach(function () {
    MainModule.setObserverLocation(
      "Earth",
      Constants.GREENWICH_OBSERVATORY_COORDINATES.LATITUDE,
      Constants.GREENWICH_OBSERVATORY_COORDINATES.LONGITUDE,
      0,
    );
    MainModule.setDate(EPOCH_2000_DATE);
  });
  it("should get sky object by name", function () {
    expect(MainModule.getSkyObjectByName("Sun").name).toBe("Sun");
  });
  it("should get no sky object", function () {
    expect(MainModule.getSkyObjectByName("")).toBeNull();
  });
  it("should set and get date", function () {
    MainModule.setDate(EPOCH_2000_DATE + 10);
    expect(MainModule.getDate()).toBe(EPOCH_2000_DATE + 10);
  });
  it("should set observer location", function () {
    MainModule.setObserverLocation("Mars", 0, 0, 0);
    const observer = MainModule._observer;
    expect(observer.solarSystemObject.name).toBe("Mars");
    expect(observer.sphericalCoordinates.latitude).toBe(0);
    expect(observer.sphericalCoordinates.longitude).toBe(0);
  });
  it("should get right ascension and declination for sun in epoch J2000", function () {
    const raDec = MainModule.getRADecCoordinatesForObject("Sun");
    expect(raDec.latitude).toBeCloseTo(-23.03, 2);
    expect(raDec.longitude).toBeCloseTo(281.29, 2);
  });
  it("should get local hour angle and declination for sun in epoch J2000", function () {
    const haDec = MainModule.getHADecCoordinatesForObject("Sun");
    expect(haDec.latitude).toBeCloseTo(-23.03, 2);
    expect(haDec.longitude).toBeCloseTo(359.17, 2);
  });
  it("should get altitude and azimuth for sun in epoch J2000", function () {
    let altAz = MainModule.getAltAzCoordinatesForObject("Sun");
    expect(altAz.latitude).toBeCloseTo(15.49, 2);
    expect(altAz.longitude).toBeCloseTo(179.21, 2);

    altAz = MainModule.getAltAzCoordinatesForObject("Sun", EPOCH_2000_DATE);
    expect(altAz.latitude).toBeCloseTo(15.49, 2);
    expect(altAz.longitude).toBeCloseTo(179.21, 2);
  });
  it("should get ephemeris for sun rise", function () {
    expect(
      MainModule.getEphemerisDateForObject(
        "Sun",
        EPOCH_2000_DATE,
        "RISE",
      ).toUTCString(),
    ).toContain("Sat, 01 Jan 2000 08:05");
  });
});
