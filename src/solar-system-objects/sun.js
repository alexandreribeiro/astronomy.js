import { SolarSystemObject } from "./solar-system-object";
import { RectangularCoordinates } from "../coordinates/rectangular-coordinates";

export class Sun extends SolarSystemObject {
  constructor() {
    super("Sun", null, 695508000);
  }

  getRectangularHeliocentricCoordinates() {
    return new RectangularCoordinates(0, 0, 0);
  }
}
