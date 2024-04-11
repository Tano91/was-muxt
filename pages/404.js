import { useEffect } from "react";
import { useRouter } from "next/router";
import { Typography, Container } from '@mui/material';
import Head from 'next/head'
import Fade from '@mui/material/Fade';

const NotFound = () => {
    const router = useRouter()

    useEffect(()=>{
        setTimeout(()=>{
            router.push('/')
        },5000)
    },[])
    return ( 
        <>
            <Fade in timeout={500}>
                <Container>
                        {/* header section */}
                        <Head>
                                <link rel="logo icon" href="/was_logo_red.png"/>
                                <title>W.A.S. | 404 </title>
                                <meta name="all orders" content="all orders" />
                            </Head>

                        <Container > 

                        <Container sx={{ display: 'flex', flexDirection:{xs:'column', md:'row'} , justifyContent: 'space-between', alignItems: 'center'}}>
                            <Typography variant='h4' gutterBottom sx={{ 
                                        my: 2,
                                        color: 'black',
                                        fontFamily: 'Public Sans',
                                        fontWeight: 800
                            }}> 404 - Page Not Found! Redirecting...
                            </Typography>
                
                        </Container>
                    </Container>
                </Container>
            </Fade>
        </>
     );
}
 
export default NotFound;