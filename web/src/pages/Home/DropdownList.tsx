import {Box, ButtonBase, Divider, Grid2, Paper, Typography} from "@mui/material";
import {ReactNode, useState} from "react";
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Fire from "../../types/Fire.tsx";
import {Map} from "leaflet";
import CardHeader from '@mui/material/CardHeader';
import {Diversity3Rounded} from "@mui/icons-material";

interface FireListInput {
    fireList: Fire[],
    map?: Map
}

interface ListCardInput<T extends Fire> {
    fire: T,
    map?: Map
    generateCardContents: (fire: T) => ReactNode;
}

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme }) => ({
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
    variants: [
        {
            props: ({ expand }) => !expand,
            style: {
                transform: 'rotate(0deg)',
            },
        },
        {
            props: ({ expand }) => !!expand,
            style: {
                transform: 'rotate(180deg)',
            },
        },
    ],
}));

export function DropdownCard<T extends Fire>({fire, map}: ListCardInput<T>) {
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card sx={{ maxWidth: 500 }}>
            <Diversity3Rounded fontSize={"large"} htmlColor={"brown"}/>
            <CardHeader
                title={fire.name}
                subheader="BLAHBLAH"
            />
            <CardActions disableSpacing>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography variant="h6">Hospitals</Typography>
                    {(fire?.hospitals ?? []).map((hospital, idx) => (
                        <Typography key={idx} sx={{marginBottom: 2}}>
                            {hospital.name}
                        </Typography>
                    ))}
                </CardContent>

            </Collapse>
        </Card>
    );
}

export default function CardList({fireList, map}: FireListInput) {
    return fireList.map(fire => {
        return <DropdownCard
            fire={fire}
            map={map}
            // generateCardContents={generateFunction}
        />
    })
}


//
// interface PlaceListInput {
//     placeList: Place[],
//     map?: Map
// }
//
// interface DropListCardInput<T extends Place> {
//     place: T,
//     map?: Map
//     generateDropCardContents: (place: T) => ReactNode;
// }
//
// function DropListCard<T extends Place>({place, map, generateDropCardContents}: DropListCardInput<T>) {
//     interface ExpandMoreProps extends IconButtonProps {
//         expand: boolean;
//     }
//
// const ExpandMore = styled((props: ExpandMoreProps) => {
//     const { expand, ...other } = props;
//     return <IconButton {...other} />;
// })(({ theme }) => ({
//     marginLeft: 'auto',
//     transition: theme.transitions.create('transform', {
//         duration: theme.transitions.duration.shortest,
//     }),
//     variants: [
//         {
//             props: ({ expand }) => !expand,
//             style: {
//                 transform: 'rotate(0deg)',
//             },
//         },
//         {
//             props: ({ expand }) => !!expand,
//             style: {
//                 transform: 'rotate(180deg)',
//             },
//         },
//     ],
// }));
//
// export default function DropdownCard() {
//     const [expanded, setExpanded] = React.useState(false);
//
//     const handleExpandClick = () => {
//         setExpanded(!expanded);
//     };
//
//     return (
//         <Card sx={{ maxWidth: 500 }}>
//
//             <CardContent>
//                 <Typography variant="h5" sx={{ color: '' }}>
//                     Irvine Fire
//                 </Typography>
//             </CardContent>
//             <CardActions disableSpacing>
//
//                 <ExpandMore
//                     expand={expanded}
//                     onClick={handleExpandClick}
//                     aria-expanded={expanded}
//                     aria-label="show more"
//                 >
//                     <ExpandMoreIcon />
//                 </ExpandMore>
//             </CardActions>
//             <Collapse in={expanded} timeout="auto" unmountOnExit>
//                 <CardContent>
//                     <Typography sx={{ marginBottom: 2 }}>
//                         UCI Hospital
//                     </Typography>
//                     <Typography sx={{ marginBottom: 2 }}>
//                         Tustin community center
//                     </Typography>
//                 </CardContent>
//             </Collapse>
//         </Card>
//     );
// }
//
//     return <Box p={1}>
//         <ButtonBase
//             onClick={() => map?.flyTo([place.location.latitude, place.location.longitude], undefined, {duration: 1})}
//             style={{borderRadius: 12}}
//         >
//             <Paper elevation={5} style={{borderRadius: 12}}>
//                 <Box p={1} width={500}>
//                     {generateDropCardContents(place)}
//                 </Box>
//             </Paper>
//         </ButtonBase>
//     </Box>
// }
//
// function PlaceList({placeList, map}: PlaceListInput) {
//     const cards: ReactNode[] = placeList.map(place => {
//         let generateFunction: (place: Place) => ReactNode;
//         switch (place.iconType) {
//             case IconType.FIRE:
//                 generateFunction = generateDropFireCard as (place: Place) => ReactNode
//                 break;
//             case IconType.HOSPITAL:
//                 generateFunction = generateDropHospitalCard as (place: Place) => ReactNode
//                 break;
//             case IconType.COMMUNITY_CENTER:
//                 generateFunction = generateDropCommunityCenterCard as (place: Place) => ReactNode
//                 break;
//
//         }
//         return <DropListCard
//             place={place}
//             map={map}
//             generateDropCardContents={generateFunction}
//         />
//     })
//
//     return <>{...cards}</>
// }
//
// function generateDropFireCard(fire: Fire) {
//     return <Grid2 container direction={"row"} alignItems={"center"}>
//         <Grid2>
//             <LocalFireDepartment fontSize={"large"} htmlColor={"tomato"}/>
//         </Grid2>
//         <Grid2 width={60} textAlign={"right"} pr={1}>
//             <Typography variant={"h5"} lineHeight={1.25}>{fire.distanceMiles}</Typography>
//             <Typography variant={"subtitle2"} lineHeight={1}>miles</Typography>
//         </Grid2>
//         <Divider orientation="vertical" flexItem/>
//         <Grid2 textAlign={"left"} pl={1}>
//             <Typography variant={"h5"} lineHeight={1.25}>{fire.name}</Typography>
//             <Typography variant={"subtitle2"}
//                         lineHeight={1}>{`${fire.county} • ${fire.containmentPercent}% contained`}</Typography>
//         </Grid2>
//     </Grid2>
// }
//
// function generateDropHospitalCard(hospital: Hospital) {
//     return <Grid2 container direction={"row"} alignItems={"center"}>
//         <Grid2>
//             <LocalHospital fontSize={"large"} htmlColor={"red"}/>
//         </Grid2>
//         <Grid2 width={60} textAlign={"right"} pr={1}>
//             <Typography variant={"h5"} lineHeight={1.25}>{hospital.distanceMiles}</Typography>
//             <Typography variant={"subtitle2"} lineHeight={1}>miles</Typography>
//         </Grid2>
//         <Divider orientation="vertical" flexItem/>
//         <Grid2 textAlign={"left"} pl={1}>
//             <Typography variant={"h5"} lineHeight={1.25}>{hospital.name}</Typography>
//             <Typography variant={"subtitle2"}
//                         lineHeight={1}>{hospital.city}</Typography>
//         </Grid2>
//     </Grid2>
// }
//
// function generateDropCommunityCenterCard(communityCenter: CommunityCenter) {
//     return <Grid2 container direction={"row"} alignItems={"center"}>
//         <Grid2>
//             <Diversity3Rounded fontSize={"large"} htmlColor={"brown"}/>
//         </Grid2>
//         <Grid2 width={60} textAlign={"right"} pr={1}>
//             <Typography variant={"h5"} lineHeight={1.25}>{communityCenter.distanceMiles}</Typography>
//             <Typography variant={"subtitle2"} lineHeight={1}>miles</Typography>
//         </Grid2>
//         <Divider orientation="vertical" flexItem/>
//         <Grid2 textAlign={"left"} pl={1}>
//             <Typography variant={"h5"} lineHeight={1.25}>{communityCenter.name}</Typography>
//             <Typography variant={"subtitle2"}
//                         lineHeight={1}>{communityCenter.location.latitude}</Typography>
//         </Grid2>
//     </Grid2>
//}
