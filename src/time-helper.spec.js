import {TimeHelper} from "./time-helper";
import {Constants} from "./constants";

describe("TimeHelper", function() {
    it("should calculate distance to solar system objects in epoch day zero correctly", function() {
        expect(TimeHelper.meanSiderealTime(Constants.JULIAN_DAY_2000)).toBeCloseTo(280.4606, 4);
    });
});