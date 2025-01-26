import 'leaflet/dist/leaflet.css';
import {MapContainer, Marker, Popup, TileLayer, Circle} from 'react-leaflet'
import LatLonLocation from "../../types/LatLonLocation.tsx";
import {ReactNode} from "react";
import Place from "../../types/Place.tsx";
import L, {Map} from 'leaflet';
import Fire from "../../types/Fire.tsx";

interface MapInputs {
    location?: LatLonLocation
    placeList: Place[]
    setMap: (map: Map) => void
}

// const position = [51.505, -0.09]
const defaultLocation = {
    latitude: 34.0549,
    longitude: -118.2426,
}
export default function MapView({location, placeList, setMap}: MapInputs) {
    const healthIcon = new L.Icon({
        // iconUrl: 'https://raw.githubusercontent.com/google/material-design-icons/refs/heads/master/src/maps/local_hospital/materialicons/24px.svg',
        iconUrl: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="red"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" stroke="black" stroke-width="3%"/></svg>`,
        iconSize: [35, 35]
    })

    const communityIcon = new L.Icon({
        iconUrl: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="rgb(177, 143, 207)" stroke="black" stroke-width="3%"><path d="M40-200v-120q0-34 23.5-57t56.5-23h131q20 0 38 10t29 27q29 39 71.5 61t90.5 22q49 0 91.5-22t70.5-61q13-17 30.5-27t36.5-10h131q34 0 57 23t23 57v120q0 17-11.5 28.5T880-160H680q-17 0-28.5-11.5T640-200v-51q-35 25-75.5 38T480-200q-43 0-84-13.5T320-252v52q0 17-11.5 28.5T280-160H80q-17 0-28.5-11.5T40-200Zm440-120q-38 0-72-17.5T351-386q-17-25-42.5-39.5T253-440q22-37 93-58.5T480-520q63 0 134 21.5t93 58.5q-29 0-55 14.5T609-386q-22 32-56 49t-73 17ZM160-440q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T280-560q0 50-34.5 85T160-440Zm640 0q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T920-560q0 50-34.5 85T800-440ZM480-560q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-680q0 50-34.5 85T480-560Z"/></svg>`,
        iconSize: [35, 35]
    })

    const fireIcon = new L.Icon({
        iconUrl: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="tomato"><g><rect fill="none" height="24" width="24"/></g><g><g><g><path d="M12,12.9l-2.13,2.09C9.31,15.55,9,16.28,9,17.06C9,18.68,10.35,20,12,20s3-1.32,3-2.94c0-0.78-0.31-1.52-0.87-2.07 L12,12.9z" stroke="black" stroke-width="3%"/></g><g><path d="M16,6l-0.44,0.55C14.38,8.02,12,7.19,12,5.3V2c0,0-8,4-8,11c0,2.92,1.56,5.47,3.89,6.86C7.33,19.07,7,18.1,7,17.06 c0-1.32,0.52-2.56,1.47-3.5L12,10.1l3.53,3.47c0.95,0.93,1.47,2.17,1.47,3.5c0,1.02-0.31,1.96-0.85,2.75 c1.89-1.15,3.29-3.06,3.71-5.3C20.52,10.97,18.79,7.62,16,6z" stroke="black" stroke-width="3%"/></g></g></g></svg>`,
        iconSize: [35, 35]
    })

    const selfIcon = new L.Icon({
        iconUrl: "https://cdn.prod.website-files.com/62c5e0898dea0b799c5f2210/62e8212acc540f291431bad2_location-icon.png",
        iconSize: [35, 35]
    })

    const markers: ReactNode[] = []
    for (const place of placeList) {
        if (place.radiusMiles === undefined)
            markers.push(
                <Marker position={[place.location.latitude, place.location.longitude]}
                        icon={place.iconType == 1 ? healthIcon : place.iconType == 2 ? communityIcon : fireIcon}>
                    <Popup>
                        {place.name}
                    </Popup>
                </Marker>
            )
        else
            markers.push(
                <Circle center={[place.location.latitude, place.location.longitude]} pathOptions={{color: 'red'}}
                        radius={place.radiusMiles * 1609.34}>
                    <Popup>{place.name}</Popup>
                </Circle>,
                <Marker position={[place.location.latitude, place.location.longitude]} icon={fireIcon}>
                    <Popup>
                        {place.name}
                    </Popup>
                </Marker>
            )
        if (Object.keys(place).includes("hospitals")) {
            for (const hospital of (place as Fire).hospitals ?? []) {
                markers.push(
                    <Marker position={[hospital.location.latitude, hospital.location.longitude]}
                            icon={healthIcon}>
                        <Popup>
                            {hospital.name}
                        </Popup>
                    </Marker>
                )
            }
            for (const communityCenter of (place as Fire).communityCenters ?? []) {
                markers.push(
                    <Marker position={[communityCenter.location.latitude, communityCenter.location.longitude]}
                            icon={communityIcon}>
                        <Popup>
                            {communityCenter.name}
                        </Popup>
                    </Marker>
                )
            }
        }
    }


    return <MapContainer
        center={[
            location?.latitude ?? defaultLocation.latitude,
            location?.longitude ?? defaultLocation.longitude,
        ]}
        zoom={13}
        scrollWheelZoom={true}
        ref={setMap}
        style={{borderRadius: 12}}
    >
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {(location !== undefined) &&
            <Marker position={[
                location.latitude,
                location.longitude,
            ]} icon={selfIcon}>
                <Popup>
                    This is you.
                </Popup>
            </Marker>}
        {...markers}
    </MapContainer>
}