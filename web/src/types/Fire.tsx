import LatLonLocation from "./LatLonLocation.tsx";

export default interface Fire {
    name: string,
    locationStr: string,
    containmentPercent: number,
    distanceMiles: number,
    location: LatLonLocation,
}