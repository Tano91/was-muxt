import * as React from 'react';
import Link from 'next/link';
import Image from "next/image";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import Fade from '@mui/material/Fade';

import { useSession, signIn, signOut } from "next-auth/react"


function ResponsiveAppBar() {
  const { data: session, status } = useSession()
  // console.log('session => ', session);
  // console.log('status => ', status);

  return (
    <Fade in timeout={1000}>
      <AppBar position="static" color="transparent" elevation={0} >
        <Container maxWidth="xl" sx={{ mt: 1.5}}>
          <Toolbar disableGutters>
            {/* Logo */}
            <Link href={"/"}>
              <IconButton color="primary" aria-label="website logo" component="label" 
              sx={{ display: { xs: 'flex', md: 'flex' }, mr: 1 }}>
                <Image priority src="/was_logo_red.png" alt="image unavailable" width={30} height={25} />
              </IconButton>
            </Link>
            {/* New Order */}
            {session && status !== 'unauthenticated' && (
              <Tooltip title="New Order">
                <Button variant='outlined' color='primary' sx={{
                  my: 2,
                  ml: 2,
                  display: 'flex',
                  fontFamily: 'Public Sans',
                  fontWeight: 800,
                }}>
                  <Link href="/createOrder">
                    New Order
                  </Link>
                </Button>
              </Tooltip>
            )}


            {/* Elements aligned to the right */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1 }}>
            {session && status !== 'unauthenticated' && (

              <>
                
              {/* Account Display */}
              <Button  disabled sx={{
                  display: 'flex',
                  fontFamily: 'Public Sans',
                  fontWeight: 800,
                }}>
                <Avatar 
                alt={session.user ? session.user.name : ''} 
                src={session.user ? session.user.image : ''} 
                sx={{ bgcolor: 'blue[700]' }} />
                <Box sx={{ ml: 2, display: { xs: 'flex', md: 'flex' }, color:'gray' }}>
                  Hi, {session.user ? session.user.name.split(' ')[0] : ''}
                </Box>
              </Button>
              
              {/* Sign Out */}
              <Tooltip title="Sign Out">
                <Button  sx={{
                  my: 2,
                  color:'black',
                  display: 'flex',
                  fontFamily: 'Public Sans',
                  fontWeight: 800,
                  '&:hover': {
                    color: 'red',
                  }
                }}>
                  <Link href="/api/auth/signout">
                    <LogoutIcon onClick={e => {
                      e.preventDefault()
                      signOut()
                    }}/>
                  </Link>
                </Button>
              </Tooltip>

              </>
              
              )}

              {!session && status !== 'authenticated' && (
                // Sign in with Google
              <Tooltip title="Sign In">
                <Button   sx={{
                  my: 2,
                  color:'black',
                  display: 'flex',
                  fontFamily: 'Public Sans',
                  fontWeight: 800,
                  '&:hover': {
                    color: '#1976d2',
                  }
                }}>
                  <Link href="/api/auth/signin">
                    <LoginIcon onClick={e => {
                      e.preventDefault()
                      signIn('google')
                    }} />
                  </Link>
                </Button>
              </Tooltip>
              )}
            
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Fade>
  );
}
export default ResponsiveAppBar;