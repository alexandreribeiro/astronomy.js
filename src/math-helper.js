export class MathHelper {
    static modDegrees(degrees) {
        while (degrees < 0) {
            degrees = degrees + 360;
        }
        return degrees % 360;
    }

    static radiansToDegrees(radians) {
        return radians * 180.0 / Math.PI;
    }

    static degreesToRadians(degrees) {
        return degrees * Math.PI / 180.0;
    }

    static padZero(originalString) {
        originalString = originalString.toString();
        return originalString.length >= 2 ? originalString : '0' + originalString;
    }
}
