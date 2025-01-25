import {Box, ButtonBase, Divider, Grid2, Paper, Typography} from "@mui/material";
import {ReactNode} from "react";
import {Map} from "leaflet";
import Place from "../../types/Place.tsx";
import Fire from "../../types/Fire.tsx";
import {Diversity3Rounded, LocalFireDepartment, LocalHospital} from "@mui/icons-material";
import Hospital from "../../types/Hospital.tsx";
import CommunityCenter from "../../types/CommunityCenter.tsx";
import IconType from "../../types/IconType.tsx";

interface PlaceListInput {
    placeList: Place[],
    map?: Map
}

interface ListCardInput<T extends Place> {
    place: T,
    map?: Map
    generateCardContents: (place: T) => ReactNode;
}

function ListCard<T extends Place>({place, map, generateCardContents}: ListCardInput<T>) {
    return <Box p={1}>
        <ButtonBase
            onClick={() => map?.flyTo([place.location.latitude, place.location.longitude], undefined, {duration: 1})}
            style={{borderRadius: 12}}
        >
            <Paper elevation={5} style={{borderRadius: 12}}>
                <Box p={1} width={500}>
                    {generateCardContents(place)}
                </Box>
            </Paper>
        </ButtonBase>
    </Box>
}

export default function PlaceList({placeList, map}: PlaceListInput) {
    const cards: ReactNode[] = placeList.map(place => {
        let generateFunction: (place: Place) => ReactNode;
        switch (place.iconType) {
            case IconType.FIRE:
                generateFunction = generateFireCard as (place: Place) => ReactNode
                break;
            case IconType.HOSPITAL:
                generateFunction = generateHospitalCard as (place: Place) => ReactNode
                break;
            case IconType.COMMUNITY_CENTER:
                generateFunction = generateCommunityCenterCard as (place: Place) => ReactNode
                break;

        }
        return <ListCard
            place={place}
            map={map}
            generateCardContents={generateFunction}
        />
    })

    return <>{...cards}</>
}

function generateFireCard(fire: Fire) {
    return <Grid2 container direction={"row"} alignItems={"center"}>
        <Grid2>
            <LocalFireDepartment fontSize={"large"} htmlColor={"tomato"}/>
        </Grid2>
        <Grid2 width={60} textAlign={"right"} pr={1}>
            <Typography variant={"h5"} lineHeight={1.25}>{fire.distanceMiles}</Typography>
            <Typography variant={"subtitle2"} lineHeight={1}>miles</Typography>
        </Grid2>
        <Divider orientation="vertical" flexItem/>
        <Grid2 textAlign={"left"} pl={1}>
            <Typography variant={"h5"} lineHeight={1.25}>{fire.name}</Typography>
            <Typography variant={"subtitle2"}
                        lineHeight={1}>{`${fire.locationStr} • ${fire.containmentPercent}% contained`}</Typography>
        </Grid2>
    </Grid2>
}

function generateHospitalCard(hospital: Hospital) {
    return <Grid2 container direction={"row"} alignItems={"center"}>
        <Grid2>
            <LocalHospital fontSize={"large"} htmlColor={"red"}/>
        </Grid2>
        <Grid2 width={60} textAlign={"right"} pr={1}>
            <Typography variant={"h5"} lineHeight={1.25}>{hospital.distanceMiles}</Typography>
            <Typography variant={"subtitle2"} lineHeight={1}>miles</Typography>
        </Grid2>
        <Divider orientation="vertical" flexItem/>
        <Grid2 textAlign={"left"} pl={1}>
            <Typography variant={"h5"} lineHeight={1.25}>{hospital.name}</Typography>
            <Typography variant={"subtitle2"}
                        lineHeight={1}>{hospital.addressStr}</Typography>
        </Grid2>
    </Grid2>
}

function generateCommunityCenterCard(communityCenter: CommunityCenter) {
    return <Grid2 container direction={"row"} alignItems={"center"}>
        <Grid2>
            <Diversity3Rounded fontSize={"large"} htmlColor={"brown"}/>
        </Grid2>
        <Grid2 width={60} textAlign={"right"} pr={1}>
            <Typography variant={"h5"} lineHeight={1.25}>{communityCenter.distanceMiles}</Typography>
            <Typography variant={"subtitle2"} lineHeight={1}>miles</Typography>
        </Grid2>
        <Divider orientation="vertical" flexItem/>
        <Grid2 textAlign={"left"} pl={1}>
            <Typography variant={"h5"} lineHeight={1.25}>{communityCenter.name}</Typography>
            <Typography variant={"subtitle2"}
                        lineHeight={1}>{communityCenter.addressStr}</Typography>
        </Grid2>
    </Grid2>
}