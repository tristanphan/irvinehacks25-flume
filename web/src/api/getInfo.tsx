import LatLonLocation from "../types/LatLonLocation.tsx";
import Fire from "../types/Fire.tsx";
import CommunityCenter from "../types/CommunityCenter.tsx";
import Hospital from "../types/Hospital.tsx";
import IconType from "../types/IconType.tsx";

interface GetInfoInput {
    location: LatLonLocation
}

interface GetInfoOutput {
    fires: Fire[],
    hospitals: Hospital[],
    communityCenters: CommunityCenter[],
}

export default async function getInfo({location}: GetInfoInput): Promise<GetInfoOutput> {
    // TODO api call
    await new Promise((resolve) => setTimeout(resolve, 100))

    return {
        fires: [{
            name: "Pakistan Fire",
            locationStr: "Southwest of Alaska",
            containmentPercent: 90,
            distanceMiles: 20,
            location: {latitude: 30.3753, longitude: 69.3451},
            radius: 200000,
            iconType: IconType.FIRE
        }, {
                name: "Easter Fire",
                locationStr: "Southwest of Alaska",
                containmentPercent: 20,
                distanceMiles: 100,
                location: {latitude: -27.1127, longitude: -109.3497},
                radius: 1000,
                iconType: IconType.FIRE
            }],
        hospitals: [{
            name: "Guangzhou Hospital",
            addressStr: "West of Guangzhou",
            distanceMiles: 30,
            location: {latitude: 23.1291, longitude: 113.2644},
            iconType: IconType.HOSPITAL
        }, {
            name: "Hospital of Rome",
            addressStr: "Modern-day Italy (maybe?)",
            distanceMiles: 500,
            location: {latitude: 41.8967, longitude: 12.4822},
            iconType: IconType.HOSPITAL
        }],
        communityCenters: [{
            name: "UCI Community",
            addressStr: "croski",
            distanceMiles: 500,
            location: {latitude: 33.6453928, longitude: -117.8418824},
            iconType: IconType.COMMUNITY_CENTER
        }]
    }
}