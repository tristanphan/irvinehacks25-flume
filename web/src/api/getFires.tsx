import LatLonLocation from "../types/LatLonLocation.tsx";
import Fire from "../types/Fire.tsx";

interface GetFiresInput {
    location: LatLonLocation
}

interface GetFiresOutput {
    fires: Fire[],
}

export default async function getFires({location}: GetFiresInput): Promise<GetFiresOutput> {
    // TODO api call
    await new Promise((resolve) => setTimeout(resolve, 100))
    return {
        fires: [{
            name: "Pakistan Fire",
            locationStr: "Southwest of Alaska",
            containmentPercent: 90,
            distanceMiles: 20,
            location: {latitude: 23432, longitude: -234}
        }, {
            name: "Eater Fire",
            locationStr: "West of Guangzhou",
            containmentPercent: 70,
            distanceMiles: 30,
            location: {latitude: 23432, longitude: -234}
        }, {
            name: "Great Fire of Rome",
            locationStr: "Modern-day Italy (maybe?)",
            containmentPercent: 100,
            distanceMiles: 5000,
            location: {latitude: 23432, longitude: -234}
        }]
    }
}