import LatLonLocation from "./LatLonLocation.tsx";
import IconType from "./IconType.tsx";

export default interface Place {
    iconType: IconType,
    name: string,
    location: LatLonLocation,
    radius?: number,
    distanceMiles: number,
}