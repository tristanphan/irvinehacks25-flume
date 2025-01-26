import Place from "./Place.tsx";
import Hospital from "./Hospital.tsx";
import CommunityCenter from "./CommunityCenter.tsx";

export default interface Fire extends Place {
    county: string
    containmentPercent: number,
    acresBurned: number
    startDate: string,
    updateDate: string,
    url: string,
    hospitals?: Hospital[],
    communityCenters?: CommunityCenter[],
}