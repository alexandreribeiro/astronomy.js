export class SphericalCoordinates {
    constructor (latitude, longitude, radius) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.radius = radius;
    }
    toDegrees() {
        let latitude = this.latitude;
        let longitude = this.longitude;
        return new SphericalCoordinates(
            `${latitude < 0 ? '-' : ''}${(0|(latitude<0?latitude=-latitude:latitude)).toString().padStart(2, '0')}\u00B0
                ${(0|(latitude % 1 * 60)).toString().padStart(2, '0')}' ${((0|(latitude * 60 % 1 * 60))).toString().padStart(2, '0')}''`,
            `${longitude < 0 ? '-' : ''}${(0|(longitude<0?longitude=-longitude:longitude)).toString().padStart(2, '0')}\u00B0
                ${(0|(longitude % 1 * 60)).toString().padStart(2, '0')}' ${((0|(longitude * 60 % 1 * 60))).toString().padStart(2, '0')}''`,
            this.radius
        );
    }
    toHours() {
        let latitude = this.latitude;
        let longitude = this.longitude;
        return new SphericalCoordinates(
            `${latitude < 0 ? '-' : ''}${(0|(latitude < 0 ? latitude=-latitude:latitude)).toString().padStart(2, '0')}\u00B0
                ${(0|(latitude % 1 * 60)).toString().padStart(2, '0')}' ${((0|(latitude * 60 % 1 * 60))).toString().padStart(2, '0')}''`,
            `${longitude < 0 ? '-' : ''}${(0|(longitude < 0 ? longitude = -longitude / 15 : longitude = longitude / 15)).toString().padStart(2, '0')}h
                ${(0|(longitude % 1 * 60)).toString().padStart(2, '0')}m ${((0|(longitude * 60 % 1 * 60))).toString().padStart(2, '0')}s`,
            this.radius
        );
    }
}