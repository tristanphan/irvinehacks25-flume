import Place from "./Place.tsx";

export default interface CommunityCenter extends Place {
    addressStr: string,
    distanceMiles: number,
}