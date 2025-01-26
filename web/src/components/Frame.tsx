import {
    AppBar,
    Box,
    Toolbar,
    Typography
} from "@mui/material";
import {LocalFireDepartment} from "@mui/icons-material";
import {ReactNode} from "react";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

export default function Frame({children}: {children: ReactNode}) {

    return <Box sx={{display: 'flex'}}>
        <AppBar
            position="fixed"
        >
            <Toolbar style={{backgroundColor: "darkred"}}>
                <LocalFireDepartment sx={{paddingRight: 1}} fontSize={"medium"}/>
                <Typography fontWeight={"bold"} fontSize={"16pt"}>
                    Flüme
                </Typography>
            </Toolbar>
        </AppBar>
        {children}
    </Box>
}