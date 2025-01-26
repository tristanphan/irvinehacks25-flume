import {SyntheticEvent, useEffect, useState} from "react";
import LatLonLocation from "../../types/LatLonLocation.tsx";
import Frame from "../../components/Frame.tsx";
import {Box, Fab, Tab, Tabs} from "@mui/material";
import MapView from "./MapView.tsx";
import Fire from "../../types/Fire.tsx";
import getInfo from "../../api/getInfo.tsx";
import {Map} from "leaflet";
import CommunityCenter from "../../types/CommunityCenter.tsx";
import Hospital from "../../types/Hospital.tsx";
import PlaceList from "./PlaceList.tsx";
import Place from "../../types/Place.tsx";
import {LocationOn} from "@mui/icons-material";
import getInfoWithLocation from "../../api/getInfoWithLocation.tsx";

export default function Home() {
    const [location, setLocation] = useState<LatLonLocation | undefined>(undefined);

    const [doneLoadingInfo, setDoneLoadingInfo] = useState<boolean>(false);
    const [fires, setFires] = useState<Fire[] | undefined>(undefined);
    const [hospitals, setHospitals] = useState<Hospital[] | undefined>(undefined);
    const [communityCenters, setCommunityCenters] = useState<CommunityCenter[] | undefined>(undefined);

    const [map, setMap] = useState<Map | undefined>(undefined);

    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    useEffect(() => {
        getInfo().then(result => {
                setFires(result.fires);
                setDoneLoadingInfo(true);
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            _error => {
                setFires(undefined);
                setHospitals(undefined);
                setCommunityCenters(undefined);
                setDoneLoadingInfo(true)
            });
    }, []);

    if (fires === undefined) {
        if (doneLoadingInfo) return <Frame>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                minWidth="100vw"
            >
                Failed to find fires, hospitals, and community centers
            </Box>
        </Frame>
        else return <Frame>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                minWidth="100vw"
            >
                Loading fires, hospitals, and community centers...
            </Box>
        </Frame>
    }

    const places: Place[] = [];
    if (hospitals !== undefined && communityCenters !== undefined) {
        if (tabIndex === 0) {
            places.push(...fires)
            places.push(...hospitals)
            places.push(...communityCenters)
        } else if (tabIndex === 1) {
            places.push(...fires)
        } else if (tabIndex === 2) {
            places.push(...communityCenters)
        } else if (tabIndex === 3) {
            places.push(...hospitals)
        }
        places.sort(function (a, b) {
            return a.distanceMiles! - b.distanceMiles!;
        });
    } else places.push(...fires)
    return <Frame>
        <Box pt={10} pl={4} pr={4} width={"100%"}>
            <Fab
                variant="extended"
                style={{position: "fixed", bottom: 24, right: 16}}
                color={"secondary"}
                onClick={() => navigator.geolocation.getCurrentPosition((position) => {
                    console.log("location:", [position.coords.latitude, position.coords.longitude])
                    getInfoWithLocation(position.coords)
                        .then(({fires, hospitals, communityCenters}) => {
                            setLocation(position.coords)
                            setFires(fires);
                            setHospitals(hospitals);
                            setCommunityCenters(communityCenters)
                            map?.flyTo([position.coords.latitude, position.coords.longitude], undefined, {duration: 1})
                        })
                })}
            >
                <LocationOn sx={{mr: 1}}/>
                Locate me
            </Fab>
            {(location !== undefined) &&
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <Tabs
                        value={tabIndex}
                        onChange={handleTabChange}
                        aria-label="basic tabs example"
                        textColor="secondary"
                        indicatorColor="secondary"
                    >
                        <Tab label="All"/>
                        <Tab label="Nearby Fires"/>
                        <Tab label="Community Centers"/>
                        <Tab label="Emergency"/>
                    </Tabs>
                </Box>}
            <MapView location={location} placeList={places} setMap={setMap}/>
            <br/>
            <PlaceList placeList={places} map={map}/>
            <div style={{paddingBottom: 80}}/>
        </Box>
    </Frame>
}