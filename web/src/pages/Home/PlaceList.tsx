import {Box, Divider, Grid2, Paper, Typography} from "@mui/material";
import {ReactNode, useState} from "react";
import {Map} from "leaflet";
import Place from "../../types/Place.tsx";
import Fire from "../../types/Fire.tsx";
import {
    Diversity3Rounded,
    ExpandMore,
    LocalFireDepartment,
    LocalHospital,
    OpenInNewRounded
} from "@mui/icons-material";
import Hospital from "../../types/Hospital.tsx";
import CommunityCenter from "../../types/CommunityCenter.tsx";
import IconType from "../../types/IconType.tsx";
import Collapse from "@mui/material/Collapse";

interface PlaceListInput {
    placeList: Place[],
    map?: Map | undefined
    hasShadow?: boolean
}

interface ListCardInput<T extends Place> {
    place: T,
    map?: Map | undefined
    generateCardContents: (place: T, map: Map | undefined) => ReactNode;
    hasShadow?: boolean
}

function ListCard<T extends Place>({place, map, generateCardContents, hasShadow = true}: ListCardInput<T>) {
    const paperProp: { elevation?: number, variant?: "outlined" } = (hasShadow) ? {elevation: 3} : {variant: "outlined"}
    return <Box p={hasShadow ? 1 : 0.75}
            style={{borderRadius: 12}}
        >
        <div
            onClick={async (e) => {
                e.stopPropagation()
                window.scrollTo({left: 0, top: 0, behavior: "smooth"})
                map?.setZoom(11, {duration: 1, animate: true, easeLinearity: 3})
                setTimeout(() => {
                    map?.flyTo([place.location.latitude, place.location.longitude], undefined, {duration: 1})
                }, 50);
            }}
            onMouseDown={(e) => e.stopPropagation()}
        >
            <Paper {...paperProp} style={{borderRadius: 12, cursor: "pointer"}}>
                <Box p={1} width={"calc(100% - 12px)"}>
                    {generateCardContents(place, map)}
                </Box>
            </Paper>
        </div>
    </Box>
}

export default function PlaceList({placeList, map, hasShadow = true}: PlaceListInput) {
    const cards: ReactNode[] = placeList.map((place, index) => {
        let generateFunction: (place: Place, map: Map | undefined) => ReactNode;
        switch (place.iconType) {
            case IconType.FIRE:
                generateFunction = FireCard as (place: Place, map: Map | undefined) => ReactNode
                break;
            case IconType.HOSPITAL:
                generateFunction = HospitalCard as (place: Place, map: Map | undefined) => ReactNode
                break;
            case IconType.COMMUNITY_CENTER:
                generateFunction = CommunityCenterCard as (place: Place, map: Map | undefined) => ReactNode
                break;

        }
        return <ListCard
            key={"ListCard" + index}
            place={place}
            map={map}
            generateCardContents={generateFunction}
            hasShadow={hasShadow}
        />
    })

    return <>{...cards}</>
}

function FireCard(fire: Fire, map: Map | undefined) {
    const [expanded, setExpanded] = useState<boolean>(false);

    const nearbyPlaces: Place[] | undefined = []
    nearbyPlaces.push(...(fire.hospitals ?? []))
    nearbyPlaces.push(...(fire.communityCenters ?? []))
    nearbyPlaces.sort(function (a, b) {
        return a.distanceMiles! - b.distanceMiles!;
    });

    return <>
        <Grid2 container direction={"row"} alignItems={"center"}>
            <Grid2>
                <LocalFireDepartment fontSize={"large"} htmlColor={"tomato"}/>
            </Grid2>
            {(fire.distanceMiles !== undefined) &&
                <>
                    <Grid2 width={60} textAlign={"right"} pr={1}>
                        <Typography variant={"h5"} lineHeight={1.25}>{Math.round(fire.distanceMiles)}</Typography>
                        <Typography variant={"subtitle2"} lineHeight={1}>miles</Typography>
                    </Grid2>
                    <Divider orientation="vertical" flexItem/></>}
            <Grid2 textAlign={"left"} pl={1} flex={1}>
                <Typography variant={"h5"} lineHeight={1.25}>{fire.name}</Typography>
                <Typography variant={"subtitle2"}
                            lineHeight={1}>{`${fire.county} • ${fire.acresBurned} acres burned • ${fire.containmentPercent}% contained`}</Typography>
            </Grid2>
            <Grid2>
                <OpenInNewRounded
                    fontSize={"medium"}
                    htmlColor={"darkgrey"}
                    onClick={() => window.open(fire.url)}
                    onMouseDown={(e) => e.stopPropagation()}/>
            </Grid2>
            {(nearbyPlaces.length !== 0) && <Grid2>
                <ExpandMore
                    fontSize={"large"}
                    htmlColor={"darkgrey"}
                    onClick={(e) => {
                        e.stopPropagation()
                        setExpanded(!expanded)
                    }}
                    onMouseDown={(e) => e.stopPropagation()}/>
            </Grid2>}
        </Grid2>
        <Collapse in={expanded}>
            <div style={{paddingBottom: 10}}></div>
            <PlaceList placeList={nearbyPlaces} map={map} hasShadow={false}/>
        </Collapse>
    </>
}

function HospitalCard(hospital: Hospital, _map: Map | undefined) {
    return <Grid2 container direction={"row"} alignItems={"center"}>
        <Grid2>
            <LocalHospital fontSize={"large"} htmlColor={"red"}/>
        </Grid2>
        {(hospital.distanceMiles !== undefined) &&
            <>
                <Grid2 width={60} textAlign={"right"} pr={1}>
                    <Typography variant={"h5"} lineHeight={1.25}>{Math.round(hospital.distanceMiles)}</Typography>
                    <Typography variant={"subtitle2"} lineHeight={1}>miles</Typography>
                </Grid2>
                <Divider orientation="vertical" flexItem/>
            </>}
        <Grid2 textAlign={"left"} pl={1} flex={1}>
            <Typography variant={"h5"} lineHeight={1.25}>{hospital.name}</Typography>
            <Typography variant={"subtitle2"}
                        lineHeight={1}>{hospital.city}</Typography>
        </Grid2>
    </Grid2>
}

function CommunityCenterCard(communityCenter: CommunityCenter, _map: Map | undefined) {
    return <Grid2 container direction={"row"} alignItems={"center"}>
        <Grid2>
            <Diversity3Rounded fontSize={"large"} htmlColor={"brown"}/>
        </Grid2>
        {(communityCenter.distanceMiles !== undefined) &&
            <>
                <Grid2 width={60} textAlign={"right"} pr={1}>
                    <Typography variant={"h5"}
                                lineHeight={1.25}>{Math.round(communityCenter.distanceMiles)}</Typography>
                    <Typography variant={"subtitle2"} lineHeight={1}>miles</Typography>
                </Grid2>
                <Divider orientation="vertical" flexItem/>
            </>}
        <Grid2 textAlign={"left"} pl={1}>
            <Typography variant={"h5"} lineHeight={1.25}>{communityCenter.name}</Typography>
            <Typography variant={"subtitle2"}
                        lineHeight={1}>Community Center for Evacuation</Typography>
        </Grid2>
    </Grid2>
}