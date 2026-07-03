export const Constants = {
  SOLAR_SYSTEM_OBJECT: "SOLAR_SYSTEM_OBJECT",
  GREENWICH_OBSERVATORY_COORDINATES: {
    LATITUDE: 51.476852,
    LONGITUDE: -0.0005,
    RADIUS: 6371000 + 46,
    ELEVATION: 46,
  },
  KIRUNA_COORDINATES: {
    LATITUDE: 67.85,
    LONGITUDE: 20.21,
    RADIUS: 6371000 + 500,
    ELEVATION: 500,
  },
  EPHEMERIS_TYPE: {
    SUNRISE: {
      NAME: "SUNRISE",
      ALTITUDE: "-0.833",
      IS_GOING_UP: true,
    },
    SUNSET: {
      NAME: "SUNSET",
      ALTITUDE: "-0.833",
      IS_GOING_UP: false,
    },
    MOONRISE: {
      NAME: "MOONRISE",
      ALTITUDE: "-0.833",
      IS_GOING_UP: true,
    },
    MOONSET: {
      NAME: "MOONSET",
      ALTITUDE: "-0.833",
      IS_GOING_UP: false,
    },
    GOLDEN_HOUR_START: {
      NAME: "GOLDEN_HOUR_START",
      ALTITUDE: "6",
      IS_GOING_UP: false,
    },
    GOLDEN_HOUR_END: {
      NAME: "GOLDEN_HOUR_END",
      ALTITUDE: "6",
      IS_GOING_UP: true,
    },
    RISE: {
      NAME: "RISE",
      ALTITUDE: "0",
      IS_GOING_UP: true,
    },
    SET: {
      NAME: "SET",
      ALTITUDE: "0",
      IS_GOING_UP: false,
    },
    TRANSIT: {
      NAME: "TRANSIT",
      ALTITUDE: null,
      IS_GOING_UP: null,
    },
    LOWER_TRANSIT: {
      NAME: "LOWER_TRANSIT",
      ALTITUDE: null,
      IS_GOING_UP: null,
    },
    CIVIL_TWILIGHT_START: {
      NAME: "CIVIL_TWILIGHT_START",
      ALTITUDE: "-6",
      IS_GOING_UP: true,
    },
    CIVIL_TWILIGHT_END: {
      NAME: "CIVIL_TWILIGHT_END",
      ALTITUDE: "-6",
      IS_GOING_UP: false,
    },
    NAUTICAL_TWILIGHT_START: {
      NAME: "NAUTICAL_TWILIGHT_START",
      ALTITUDE: "-12",
      IS_GOING_UP: true,
    },
    NAUTICAL_TWILIGHT_END: {
      NAME: "NAUTICAL_TWILIGHT_END",
      ALTITUDE: "-12",
      IS_GOING_UP: false,
    },
    ASTRONOMICAL_TWILIGHT_START: {
      NAME: "ASTRONOMICAL_TWILIGHT_START",
      ALTITUDE: "-18",
      IS_GOING_UP: true,
    },
    ASTRONOMICAL_TWILIGHT_END: {
      NAME: "ASTRONOMICAL_TWILIGHT_END",
      ALTITUDE: "-18",
      IS_GOING_UP: false,
    },
  },
  MOON_PHASE: {
    NEW_MOON: {
      NAME: "NEW_MOON",
      ANGLE: 0,
    },
    WAXING_CRESCENT: {
      NAME: "WAXING_CRESCENT",
      ANGLE: 45,
    },
    FIRST_QUARTER: {
      NAME: "FIRST_QUARTER",
      ANGLE: 90,
    },
    WAXING_GIBBOUS: {
      NAME: "WAXING_GIBBOUS",
      ANGLE: 135,
    },
    FULL_MOON: {
      NAME: "FULL_MOON",
      ANGLE: 180,
    },
    WANING_GIBBOUS: {
      NAME: "WANING_GIBBOUS",
      ANGLE: 225,
    },
    LAST_QUARTER: {
      NAME: "LAST_QUARTER",
      ANGLE: 270,
    },
    WANING_CRESCENT: {
      NAME: "WANING_CRESCENT",
      ANGLE: 315,
    },
  },
  MS_PER_HOUR: 3600 * 1000,
  MS_PER_DAY: 3600 * 1000 * 24,
  MS_PER_YEAR: 3600 * 1000 * 24 * 365.2422,
  LUNAR_SYNODIC_MONTH_DAYS: 29.530588861,
  JULIAN_DAY_OFFSET: 2440587.5,
  JULIAN_DAY_2000: 2451545,
  JULIAN_DAY_2010: 2451545 + 3652.5,
  EPS: Math.pow(10, -9),
  DEGREE: Math.PI / 180,
  NUMBERS_OF_ATTEMPT_TO_GET_POSITIONAL_EPHEMERIS: 5,
  ARC_SECONDS_IN_A_DEGREE: 3600,
  DAYS_PER_JULIAN_CENTURY: 36525,
  METERS_PER_AU: 149597870700,
};
