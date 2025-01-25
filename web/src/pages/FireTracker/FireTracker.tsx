import {useEffect, useState} from "react";
import LatLonLocation from "../../types/LatLonLocation.tsx";
import Frame from "../../components/Frame.tsx";
import {Box} from "@mui/material";
import FireList from "./FireList.tsx";
import MapWithPlaceholder from "./MapPlaceholder.tsx";

export default function FireTracker() {
    const [doneLoadinglocation, setDoneLoadingLocation] = useState<boolean>(false);
    const [location, setLocation] = useState<LatLonLocation | undefined>(undefined);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error: GeolocationPositionError) => {
                    console.error("oh damn: " + error);
                    setDoneLoadingLocation(true);
                }
            );
        } else {
            setDoneLoadingLocation(true);
        }
    }, []);

    if (location === undefined) {
        if (doneLoadinglocation) return <>Something went wrong</>
        else return <>Loading...</>
    }

    return <Frame>
        <Box>
            <MapWithPlaceholder location={location}/>
            <br/>
            <FireList/>

        </Box>
    </Frame>
}