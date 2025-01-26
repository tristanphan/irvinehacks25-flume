import Fire from "../types/Fire.tsx";
import IconType from "../types/IconType.tsx";
import ENDPOINT from "./endpoint.tsx";
import Hospital from "../types/Hospital.tsx";
import CommunityCenter from "../types/CommunityCenter.tsx";

type GenericData = { [Key: string]: string | number | GenericData | GenericData[] | boolean }

interface GetInfoOutput {
    fires: Fire[],
}

export default async function getInfo(): Promise<GetInfoOutput> {
    const response = await fetch(ENDPOINT, {
        method: "GET",
    })

    const data = await response.json()
    console.log("raw data get:", data)
    const fires: Fire[] = data.map((dataFire: GenericData): Fire => ({
        iconType: IconType.FIRE,
        name: dataFire["Name"] as string,
        acresBurned: dataFire["AcresBurned"] as number,
        county: dataFire["County"] as string,
        radiusMiles: dataFire["DangerRadius"] as number,
        containmentPercent: dataFire["PercentContained"] as number,
        location: {
            latitude: dataFire["Latitude"] as number,
            longitude: dataFire["Longitude"] as number,
        },
        startDate: dataFire["Started"] as string,
        updateDate: dataFire["Updated"] as string,
        url: dataFire["Url"] as string,
        hospitals: (dataFire["Hospitals"] as object[])
            .map(((dataHospital: GenericData): Hospital => ({
                iconType: IconType.HOSPITAL,
                url: dataHospital["BuildingURL"] as string,
                city: dataHospital["City"] as string,
                countyCode: dataHospital["CountyCode"] as string,
                distanceMiles: dataHospital["Distance"] as number | undefined,
                name: dataHospital["FacilityName"] as string,
                location: {
                    latitude: dataHospital["Latitude"] as number,
                    longitude: dataHospital["Longitude"] as number,
                },
                safe: dataHospital["Safe"] as boolean,
            })) as (value: object) => Hospital),
        communityCenters: (dataFire["CommunityCenter"] as object[])
            .map(((dataCommunityCenter: GenericData): CommunityCenter => ({
                iconType: IconType.COMMUNITY_CENTER,
                name: dataCommunityCenter["Name"] as string,
                safe: dataCommunityCenter["Safe"] as boolean,
                location: {
                    latitude: dataCommunityCenter["Latitude"] as number,
                    longitude: dataCommunityCenter["Longitude"] as number,
                },
                distanceMiles: dataCommunityCenter["Distance"] as number | undefined,
            })) as (value: object) => CommunityCenter)
    }))

    return {fires}
}