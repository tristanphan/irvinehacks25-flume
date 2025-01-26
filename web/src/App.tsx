import Home from "./pages/Home/Home.tsx";
import getInfoWithLocation from "./api/getInfoWithLocation.tsx";
import {Button} from "@mui/material";
import getInfo from "./api/getInfo.tsx";


function App() {
    return <>
        <Home/>
        <Button
            variant="contained"
            onClick={() =>
                getInfo().then(result => {
                    alert(JSON.stringify(result))
                    console.log(result)
                })}
        >
            get test for the api ppl
        </Button>
        <Button
            variant="contained"
            onClick={() =>
                getInfoWithLocation({latitude: 33.648621, longitude: -117.842691})
                    .then(result => {
                        alert(JSON.stringify(result))
                        console.log(result)
                    })}
        >
            post test for the api ppl
        </Button>
    </>
}

export default App
