import {SyntheticEvent, useEffect, useState} from "react";
import LatLonLocation from "../../types/LatLonLocation.tsx";
import Frame from "../../components/Frame.tsx";
import {Box, Fab, Tab, Tabs, Typography, Grid2} from "@mui/material";
import MapView from "./MapView.tsx";
import Fire from "../../types/Fire.tsx";
import getInfo from "../../api/getInfo.tsx";
import {Map} from "leaflet";
import CommunityCenter from "../../types/CommunityCenter.tsx";
import Hospital from "../../types/Hospital.tsx";
import Danger from "../../types/Danger.tsx";
import Risk from "../../types/Risk.tsx";
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
    const [danger, setDanger] = useState<Danger | undefined>(undefined);
    const [risk, setRisk] = useState<Risk | undefined>(undefined);

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
                setDanger(undefined);
                setRisk(undefined);
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
                        .then(({fires, hospitals, communityCenters, danger, risk}) => {
                            setLocation(position.coords)
                            setFires(fires);
                            setHospitals(hospitals);
                            setCommunityCenters(communityCenters)
                            setDanger(danger)
                            setRisk(risk)
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
                </Box>
                
            }
            <MapView location={location} placeList={places} setMap={setMap}/>

            {(location !== undefined) &&
            <Grid2 
                container 
                justifyContent="center" 
                alignItems="center" 
                spacing={4} // Adjust spacing between items
                sx={{ mt: 2, mb: -2 }}
                >
                {/* Danger Level Section */}
                <Grid2 
                    item 
                    xs={12} 
                    sm={6} 
                    textAlign="center" // Center text within each grid item
                >
                    <Typography 
                    variant="h6" 
                    lineHeight={1.5} 
                    fontWeight="bold" 
                    color="error.main"
                    >
                    ⚠️ Danger Level: {danger?.dangerLevel || "N/A"}
                    </Typography>
                    <Typography 
                    variant="body2" 
                    color="textSecondary" 
                    lineHeight={1.2}
                    >
                    {danger?.message || "No additional details"}
                    </Typography>
                </Grid2>

                {/* Risk Factor Section */}
                <Grid2 
                    item 
                    xs={12} 
                    sm={6} 
                    textAlign="center"
                >
                    <Typography 
                    variant="h6" 
                    lineHeight={1.5} 
                    fontWeight="bold" 
                    color="warning.main"
                    >
                    🔥 Risk Factor: {risk?.riskFactor || "N/A"}
                    </Typography>
                    <Typography 
                    variant="body2" 
                    color="textSecondary" 
                    lineHeight={1.2}
                    >
                    {risk?.message || "No additional details"}
                    </Typography>
                </Grid2>
                </Grid2>
            }
            <br/>
            <PlaceList placeList={places} map={map}/>
            <div style={{paddingBottom: 80}}/>

        </Box>
    </Frame>
}