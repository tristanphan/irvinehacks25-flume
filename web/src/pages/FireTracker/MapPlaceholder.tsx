import 'leaflet/dist/leaflet.css';
import {MapContainer, Marker, Popup, TileLayer, useMap} from 'react-leaflet'
import LatLonLocation from "../../types/LatLonLocation.tsx";
import {ReactNode} from "react";

const position = [51.505, -0.09]
export default function MapWithPlaceholder({location}: { location: LatLonLocation }) {
    const markers: ReactNode[] = [
        <Marker position={[33.6453928,-117.8418824]}>
            <Popup>
                BRANDYWINE <br/> THE FATASS TRACKER
            </Popup>
        </Marker>,
        <Marker position={[40,-120]}>
            <Popup>
                RANDO <br/> MARK
            </Popup>
        </Marker>,
    ]


    return <MapContainer center={[location.latitude, location.longitude]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {...markers}
    </MapContainer>
}