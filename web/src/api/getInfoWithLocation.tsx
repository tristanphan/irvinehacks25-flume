import LatLonLocation from "../types/LatLonLocation.tsx";
import Fire from "../types/Fire.tsx";
import CommunityCenter from "../types/CommunityCenter.tsx";
import Hospital from "../types/Hospital.tsx";
import ENDPOINT from "./endpoint.tsx";
import IconType from "../types/IconType.tsx";

type GenericData = { [Key: string]: string | number | GenericData | GenericData[] | boolean }

interface GetInfoOutputWithLocation {
    fires: Fire[],
    hospitals: Hospital[],
    communityCenters: CommunityCenter[],
}

export default async function getInfoWithLocation(location: LatLonLocation): Promise<GetInfoOutputWithLocation> {

    // return {
    //     "fires": [
    //         {
    //             "iconType": 0,
    //             "name": "Palisades Fire",
    //             "acresBurned": 23448,
    //             "county": "Los Angeles",
    //             "radiusMiles": 18.31875,
    //             "containmentPercent": 85,
    //             "location": {
    //                 "latitude": 34.07022,
    //                 "longitude": -118.54453
    //             },
    //             "startDate": "2025-01-07T10:30:00Z",
    //             "updateDate": "2025-01-25T17:33:21-08:00",
    //             "url": "https://www.fire.ca.gov/incidents/2025/1/7/palisades-fire/",
    //             "distanceMiles": 19.458307625500865
    //         },
    //         {
    //             "iconType": 0,
    //             "name": "Eaton Fire",
    //             "acresBurned": 14021,
    //             "county": "Los Angeles",
    //             "radiusMiles": 10.953906250000001,
    //             "containmentPercent": 95,
    //             "location": {
    //                 "latitude": 34.203483,
    //                 "longitude": -118.069155
    //             },
    //             "startDate": "2025-01-07T18:18:00Z",
    //             "updateDate": "2025-01-25T14:57:19Z",
    //             "url": "https://www.fire.ca.gov/incidents/2025/1/7/eaton-fire/",
    //             "distanceMiles": 79.458307625500865
    //         },
    //         {
    //             "iconType": 0,
    //             "name": "Hughes Fire",
    //             "acresBurned": 10425,
    //             "county": "Los Angeles",
    //             "radiusMiles": 8.14453125,
    //             "containmentPercent": 90,
    //             "location": {
    //                 "latitude": 34.553008,
    //                 "longitude": -118.56687
    //             },
    //             "startDate": "2025-01-22T10:53:02Z",
    //             "updateDate": "2025-01-25T17:34:21-08:00",
    //             "url": "https://www.fire.ca.gov/incidents/2025/1/22/hughes-fire/",
    //             "distanceMiles": 21.458307625500865
    //         },
    //         {
    //             "iconType": 0,
    //             "name": "Laguna Fire",
    //             "acresBurned": 83,
    //             "county": "Ventura",
    //             "radiusMiles": 0.06484375,
    //             "containmentPercent": 98,
    //             "location": {
    //                 "latitude": 34.1655,
    //                 "longitude": -119.059
    //             },
    //             "startDate": "2025-01-23T09:41:57Z",
    //             "updateDate": "2025-01-25T13:47:13Z",
    //             "url": "https://www.fire.ca.gov/incidents/2025/1/23/laguna-fire/",
    //             "distanceMiles": 69.458307625500865
    //         },
    //         {
    //             "iconType": 0,
    //             "name": "Border 2 Fire",
    //             "acresBurned": 6624.8,
    //             "county": "San Diego",
    //             "radiusMiles": 5.175625,
    //             "containmentPercent": 10,
    //             "location": {
    //                 "latitude": 32.5947,
    //                 "longitude": -116.8437
    //             },
    //             "startDate": "2025-01-23T13:58:00Z",
    //             "updateDate": "2025-01-25T13:26:16-08:00",
    //             "url": "https://www.fire.ca.gov/incidents/2025/1/23/border-2-fire/",
    //             "distanceMiles": 9.458307625500865
    //         }
    //     ],
    //     "hospitals": [
    //         {
    //             "iconType": 1,
    //             "url": "https://esp.oshpd.ca.gov/CitizenAccess/Cap/CapDetail.aspx?Module=Permits&TabName=Permits&capID1=66HIS&capID2=00000&capID3=00014&agencyCode=OSHPD",
    //             "city": "Los Angeles",
    //             "countyCode": "19 - Los Angeles",
    //             "distanceMiles": 7.665920673306577,
    //             "name": "California Rehabilitation Institute, LLC",
    //             "location": {
    //                 "latitude": 34.0592079,
    //                 "longitude": -118.4115448
    //             },
    //             "safe": false
    //         },
    //         {
    //             "iconType": 1,
    //             "url": "https://esp.oshpd.ca.gov/CitizenAccess/Cap/CapDetail.aspx?Module=Permits&TabName=Permits&capID1=69HIS&capID2=00000&capID3=00020&agencyCode=OSHPD",
    //             "city": "Marina Del Rey",
    //             "countyCode": "19 - Los Angeles",
    //             "distanceMiles": 8.567607016092948,
    //             "name": "Cedars-Sinai Marina Hospital",
    //             "location": {
    //                 "latitude": 33.982189,
    //                 "longitude": -118.439125
    //             },
    //             "safe": false
    //         },
    //         {
    //             "iconType": 1,
    //             "url": "https://esp.oshpd.ca.gov/CitizenAccess/Cap/CapDetail.aspx?Module=Permits&TabName=Permits&capID1=76HIS&capID2=00000&capID3=00007&agencyCode=OSHPD",
    //             "city": "Los Angeles",
    //             "countyCode": "19 - Los Angeles",
    //             "distanceMiles": 9.446540266337854,
    //             "name": "Cedars-Sinai Medical Center",
    //             "location": {
    //                 "latitude": 34.0765457,
    //                 "longitude": -118.3800049
    //             },
    //             "safe": false
    //         },
    //         {
    //             "iconType": 1,
    //             "url": "https://esp.oshpd.ca.gov/CitizenAccess/Cap/CapDetail.aspx?Module=Permits&TabName=Permits&capID1=83HIS&capID2=00000&capID3=00016&agencyCode=OSHPD",
    //             "city": "Los Angeles",
    //             "countyCode": "19 - Los Angeles",
    //             "distanceMiles": 16.171050425708547,
    //             "name": "California Hospital Medical Center - Los Angeles",
    //             "location": {
    //                 "latitude": 34.0371506,
    //                 "longitude": -118.2654666
    //             },
    //             "safe": false
    //         },
    //         {
    //             "iconType": 1,
    //             "url": "https://esp.oshpd.ca.gov/CitizenAccess/Cap/CapDetail.aspx?Module=Permits&TabName=Permits&capID1=80HIS&capID2=00000&capID3=00500&agencyCode=OSHPD",
    //             "city": "Los Angeles",
    //             "countyCode": "19 - Los Angeles",
    //             "distanceMiles": 17.044798358467826,
    //             "name": "Barlow Respiratory Hospital",
    //             "location": {
    //                 "latitude": 34.0754242,
    //                 "longitude": -118.2474213
    //             },
    //             "safe": false
    //         },
    //         {
    //             "iconType": 1,
    //             "url": "https://esp.oshpd.ca.gov/CitizenAccess/Cap/CapDetail.aspx?Module=Permits&TabName=Permits&capID1=87HIS&capID2=00000&capID3=00009&agencyCode=OSHPD",
    //             "city": "Sylmar",
    //             "countyCode": "19 - Los Angeles",
    //             "distanceMiles": 18.49735558467191,
    //             "name": "LAC/Olive View-UCLA Medical Center",
    //             "location": {
    //                 "latitude": 34.325735,
    //                 "longitude": -118.445787
    //             },
    //             "safe": true
    //         },
    //         {
    //             "iconType": 1,
    //             "url": "https://esp.oshpd.ca.gov/CitizenAccess/Cap/CapDetail.aspx?Module=Permits&TabName=Permits&capID1=66HIS&capID2=00000&capID3=00029&agencyCode=OSHPD",
    //             "city": "Los Angeles",
    //             "countyCode": "19 - Los Angeles",
    //             "distanceMiles": 18.824091198570937,
    //             "name": "Adventist Health White Memorial",
    //             "location": {
    //                 "latitude": 34.0493202,
    //                 "longitude": -118.2173462
    //             },
    //             "safe": true
    //         },
    //         {
    //             "iconType": 1,
    //             "url": "https://esp.oshpd.ca.gov/CitizenAccess/Cap/CapDetail.aspx?Module=Permits&TabName=Permits&capID1=68HIS&capID2=00000&capID3=00050&agencyCode=OSHPD",
    //             "city": "Gardena",
    //             "countyCode": "19 - Los Angeles",
    //             "distanceMiles": 18.824958021580752,
    //             "name": "Memorial Hospital of Gardena",
    //             "location": {
    //                 "latitude": 33.8929977,
    //                 "longitude": -118.2950592
    //             },
    //             "safe": true
    //         },
    //         {
    //             "iconType": 1,
    //             "url": "https://esp.oshpd.ca.gov/CitizenAccess/Cap/CapDetail.aspx?Module=Permits&TabName=Permits&capID1=57HIS&capID2=00000&capID3=00012&agencyCode=OSHPD",
    //             "city": "Gardena",
    //             "countyCode": "19 - Los Angeles",
    //             "distanceMiles": 18.858316824856516,
    //             "name": "Kindred Hospital South Bay",
    //             "location": {
    //                 "latitude": 33.8900032,
    //                 "longitude": -118.2974014
    //             },
    //             "safe": true
    //         },
    //         {
    //             "iconType": 1,
    //             "url": "https://esp.oshpd.ca.gov/CitizenAccess/Cap/CapDetail.aspx?Module=Permits&TabName=Permits&capID1=62HIS&capID2=00000&capID3=00022&agencyCode=OSHPD",
    //             "city": "Glendale",
    //             "countyCode": "19 - Los Angeles",
    //             "distanceMiles": 18.879161428547494,
    //             "name": "Adventist Health Glendale",
    //             "location": {
    //                 "latitude": 34.151104,
    //                 "longitude": -118.229912
    //             },
    //             "safe": true
    //         }
    //     ],
    //     "communityCenters": [
    //         {
    //             "iconType": 2,
    //             "name": "Boys and Girls Club of Santa Monica",
    //             "safe": false,
    //             "location": {
    //                 "latitude": 34.07022,
    //                 "longitude": -118.54453
    //             },
    //             "distanceMiles": 4.478119906515783
    //         },
    //         {
    //             "iconType": 2,
    //             "name": "Edwards Community Center",
    //             "safe": false,
    //             "location": {
    //                 "latitude": 34.07022,
    //                 "longitude": -118.54453
    //             },
    //             "distanceMiles": 4.842443493250446
    //         },
    //         {
    //             "iconType": 2,
    //             "name": "Claude Pepper Senior Citizen Center",
    //             "safe": false,
    //             "location": {
    //                 "latitude": 34.07022,
    //                 "longitude": -118.54453
    //             },
    //             "distanceMiles": 9.803452931405817
    //         },
    //         {
    //             "iconType": 2,
    //             "name": "Elsanto Nino Community Center",
    //             "safe": false,
    //             "location": {
    //                 "latitude": 34.07022,
    //                 "longitude": -118.54453
    //             },
    //             "distanceMiles": 16.533029514677022
    //         },
    //         {
    //             "iconType": 2,
    //             "name": "Hermosa Beach Community Center",
    //             "safe": false,
    //             "location": {
    //                 "latitude": 34.07022,
    //                 "longitude": -118.54453
    //             },
    //             "distanceMiles": 16.605053350155266
    //         },
    //         {
    //             "iconType": 2,
    //             "name": "Simi Valley Masonic Lodge",
    //             "safe": true,
    //             "location": {
    //                 "latitude": 34.07022,
    //                 "longitude": -118.54453
    //             },
    //             "distanceMiles": 18.861123279266046
    //         },
    //         {
    //             "iconType": 2,
    //             "name": "Raymond & Annie Kouyoumdjian Hall",
    //             "safe": true,
    //             "location": {
    //                 "latitude": 34.07022,
    //                 "longitude": -118.54453
    //             },
    //             "distanceMiles": 19.021833627242323
    //         },
    //         {
    //             "iconType": 2,
    //             "name": "Lincoln Heights Youth Center Complex",
    //             "safe": true,
    //             "location": {
    //                 "latitude": 34.07022,
    //                 "longitude": -118.54453
    //             },
    //             "distanceMiles": 19.0983269575664
    //         },
    //         {
    //             "iconType": 2,
    //             "name": "Bradley-Milken Youth and Family Center",
    //             "safe": true,
    //             "location": {
    //                 "latitude": 34.07022,
    //                 "longitude": -118.54453
    //             },
    //             "distanceMiles": 19.414643443885335
    //         },
    //         {
    //             "iconType": 2,
    //             "name": "Costello Senior Citizen Center",
    //             "safe": true,
    //             "location": {
    //                 "latitude": 34.07022,
    //                 "longitude": -118.54453
    //             },
    //             "distanceMiles": 19.458307625500865
    //         }
    //     ]
    // }

    const response = await fetch(ENDPOINT, {
        method: "POST",
        body: JSON.stringify(location),
    })

    const data = await response.json()
    console.log("raw data post:", data)
    const fires: Fire[] = data["Fires"]
        .map((dataFire: GenericData): Fire => ({
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
            distanceMiles: dataFire["Distance"] as number | undefined,
        }))

    const hospitals: Hospital[] = data["Hospitals"]
        .map((dataHospital: GenericData): Hospital => ({
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
        }))

    const communityCenters: CommunityCenter[] = data["CommunityCenter"]
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

    return {fires, hospitals, communityCenters}
}