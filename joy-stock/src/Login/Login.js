import React, { useState, useEffect } from 'react';
import {
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Login({ readData, setAuthToken }) {

  const theme = createTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [dialogToggle, setDialogToggle] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        Accept: 'application.json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: event.target.user.value,
        password: event.target.password.value,
      }),
      cache: 'default'
    }).then(response => response.json()).then(token => {
      setAuthToken(token);
      readData();
    });
    navigate('/list');
  };

  const openSignup = () => {
    setDialogToggle(true);
  };

  const handleSignup = (event) => {
    event.preventDefault();
    fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: {
        Accept: 'application.json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        
        newUsername: event.target.newUser.value,
        newPassword: event.target.newPass.value,
      }),
      cache: 'default'
    }).then(response => console.log(response));
    onCloseDialog();
  };  

  const onCloseDialog = () => {
    setDialogToggle(false);
  };


  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth='sm'>
        <Box sx={{
          marginTop: '30%',
          height: 300,
          border: '1px solid black',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 3,
          borderRadius: 2,
        }}>
          <Typography variant='h4' sx={{ userSelect: 'none' }}>Sign-In</Typography>
          <Box component="form" onSubmit={handleLogin}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="user"
              label="Username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              autoComplete="current-password"
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2 }}
            >
              Sign In
            </Button>
            <Link 
              onClick={openSignup}
              variant="body2"
              sx = {{
                userSelect: 'none',
              }}
            >
              Don't have an account? Sign Up
            </Link>
          </Box>
        </Box>
        <Dialog 
          open={dialogToggle} 
          onClose={onCloseDialog}
          sx={{
          }}
        >
              <Box 
                component="form" 
                onSubmit={handleSignup}
                sx={{
                  padding: '3em',
                  borderRadius: '4em',
                }}
              >
              <Typography variant='h4' sx={{ userSelect: 'none', textAlign: 'center' }}>Sign-Up</Typography>
              <DialogContentText sx={{ textAlign: 'center' }}>
                  Enter new username and password below
              </DialogContentText>
                <TextField 
                  margin="normal"
                  required
                  fullWidth
                  id="newUser"
                  label="New Username"
                  autoComplete="new-user"
                  autoFocus
                />   
                <TextField 
                  margin="normal"
                  required
                  fullWidth
                  id="newPass"
                  label="New Password"
                  autoComplete="new-password"
                  autoFocus
                />                   
                <Button 
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2, mb: 2 }}
                >Submit</Button>
                </Box>
              </Dialog>
           
      </Container>
    </ThemeProvider>
  );

}

export default Login;
