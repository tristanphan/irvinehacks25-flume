import Place from "./Place.tsx";

export default interface Fire extends Place {
    locationStr: string,
    containmentPercent: number,
}