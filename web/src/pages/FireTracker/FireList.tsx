import {Box, Card, Typography} from "@mui/material";
import {ReactNode} from "react";

function FireCard(
    {fireName}:
    { fireName: string }
) {
    // TODO hardcode
    return <Box p={1}>
        <Card>
            <Typography variant={"h5"}>{fireName}</Typography>
            <Typography>Southeast of Alaska - 90% contained</Typography>
        </Card>
    </Box>
}

export default function FireList() {
    const cards: ReactNode[] = []
    // TODO hardcode
    cards.push(<FireCard fireName={"Pakistan Fire"}/>)
    cards.push(<FireCard fireName={"Eating Fire"}/>)
    cards.push(<FireCard fireName={"Great Fire of Rome"}/>)

    return <>{...cards}</>
}