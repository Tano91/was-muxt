import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Spinner from '../comps/Spinner';
import Head from 'next/head';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import GoogleIcon from '@mui/icons-material/Google';
import { Container } from '@mui/material';


const LoginPage = () => {
 const { status } = useSession();
 const [error, setError] = useState('');
 const router = useRouter();

 const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      await signIn('google');
    } catch (err) {
      setError(err.message);
    }
    
    if (status === 'authenticated') {
        router.push('/');
      }
 };

 if (status === 'loading') {
   return <Spinner />;
 }

 return (
    

    <Grid container component="main" sx={{ height: '100vh' }}>
    <CssBaseline />
    {/* Header section */}
    <Head>
      <link rel="logo icon" href="/was_logo_red.png"/>
      <title>Log In - W.A.S.</title>
      <meta name="home" content="home" />
   </Head> 
    <Grid
      item
      xs={false}
      sm={5}
      md={8}
      sx={{
      backgroundImage: 'url(/alec-brunelle-mfGkaQC5j4E-unsplash.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundColor: (t) =>
          t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
    <Grid item xs={12} sm={7} md={4} component={Paper} elevation={6} square >
      <Box
        sx={{
          my: 40,
          mx: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >

      <Box
      component="img"
      sx={{
        height: 55,
        width: 64,
        mb:1
      }}
      alt="The house from the offer."
      src="/was_logo_red.png"
    />
        
                      
  

        <Box component="form" noValidate onSubmit={handleSignIn} sx={{ mt: 1 }}>

            {/* Log in Button */}
          <Button
            fullWidth
            variant="outlined"
            disableElevation
            sx={{ mt: 1 }}
            startIcon={<GoogleIcon/>}
            onClick={handleSignIn}
          >
           Continue with Google
          </Button>

          <Typography>
            {error}
          </Typography>
         
        </Box>

        {/* Footer */}
        
        <Container maxWidth="lg" sx={{ position: 'fixed', bottom: 0 }}>
            <Box sx={{ flexGrow: 1, justifyContent: 'center', display: 'flex', my: 1 }}>
              <Typography variant="caption" color="text.disabled">
                Copyright ©2023 Santano McCalla
              </Typography>
            </Box>
        </Container>
     
      </Box>
    </Grid>
  </Grid>

 );
};

export default LoginPage;


