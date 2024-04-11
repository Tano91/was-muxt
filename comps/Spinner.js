import { Box } from "@mui/material";
import { ColorRing } from "react-loader-spinner";


export default function Spinner (){
    return(
        <Box
            display="flex"    
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: '100vh' }}>
        
        <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={['#1976D2', '#0072c5', '#006eb7', '#0069a9', '#00649b']}
            />
    </Box>
    )

}