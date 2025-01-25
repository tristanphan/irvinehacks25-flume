import {SyntheticEvent, useEffect, useState} from "react";
import LatLonLocation from "../../types/LatLonLocation.tsx";
import Frame from "../../components/Frame.tsx";
import {Box, Tab, Tabs} from "@mui/material";
import MapView from "./MapView.tsx";
import Fire from "../../types/Fire.tsx";
import getInfo from "../../api/getInfo.tsx";
import {Map} from "leaflet";
import CommunityCenter from "../../types/CommunityCenter.tsx";
import Hospital from "../../types/Hospital.tsx";
import PlaceList from "./PlaceList.tsx";
import Place from "../../types/Place.tsx";

export default function Home() {
    const [doneLoadingLocation, setDoneLoadingLocation] = useState<boolean>(false);
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
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition) => {
                    const thisLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    }
                    setLocation(thisLocation);
                    setDoneLoadingLocation(true);
                    getInfo({location: thisLocation}).then(result => {
                            setFires(result.fires);
                            setHospitals(result.hospitals);
                            setCommunityCenters(result.communityCenters);
                            setDoneLoadingInfo(true);
                        },
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        _error => setDoneLoadingInfo(true));
                },
                (error: GeolocationPositionError) => {
                    console.error("oh damn: " + error);
                    setDoneLoadingLocation(true);
                }, {
                    enableHighAccuracy: false,
                    maximumAge: 1_800_000,
                }
            );
        } else {
            setDoneLoadingLocation(true);
        }
    }, []);

    if (location === undefined) {
        if (doneLoadingLocation) return <Frame>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                minWidth="100vw"
            >
                Failed to get your location
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
                Loading location...
            </Box>
        </Frame>
    }

    if (fires === undefined || hospitals === undefined || communityCenters === undefined) {
        if (doneLoadingInfo) return <Frame>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                minWidth="100vw"
            >
                Failed to find fires near you
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
                Loading fires...
            </Box>
        </Frame>
    }

    const places: Place[] = [];
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
        return a.distanceMiles - b.distanceMiles;
    });

    return <Frame>
        <Box pt={10} pl={4} pr={4} width={"100%"}>
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
            </Box>
            <MapView location={location} placeList={places} setMap={setMap}/>
            <br/>
            <PlaceList placeList={places} map={map}/>
        </Box>
    </Frame>
}