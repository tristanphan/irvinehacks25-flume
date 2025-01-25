import {
    AppBar,
    Box,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography
} from "@mui/material";
import {LocalFireDepartment} from "@mui/icons-material";
import {ReactNode} from "react";

const drawerWidth = 200;
export default function Frame({children}: {children: ReactNode}) {

    return <Box sx={{display: 'flex'}}>
        <AppBar
            position="fixed"
            sx={{width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`}}
        >
            <Toolbar style={{backgroundColor: "darkred"}}>
                <LocalFireDepartment sx={{paddingRight: 1}} fontSize={"medium"}/>
                <Typography fontWeight={"bold"} fontSize={"16pt"}>
                    FireHacks
                </Typography>
            </Toolbar>
        </AppBar>
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <Toolbar/>
            <Divider/>
            <List>
                <ListItem key={"Fire Tracker"} disablePadding>
                    <ListItemButton>
                        <ListItemText primary={"Fire Tracker"}/>
                    </ListItemButton>
                </ListItem>
                <ListItem key={"Evacuation Route"} disablePadding>
                    <ListItemButton>
                        <ListItemText primary={"Evacuation Route"}/>
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
        {children}
    </Box>
}