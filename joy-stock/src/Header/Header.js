import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './Header.css';
import {
  useParams,
  useNavigate,
  useLocatio,
} from "react-router-dom";



function Header() {

  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const authToken = sessionStorage.getItem('joystockToken');

  const logout = () => {
    sessionStorage.removeItem('joystockToken');  
    navigate('/');
  }

  useEffect(() => {
    const getUsername = async () => {
      const resp = await fetch('http://localhost:3000/get-username', {
        method: 'GET',
        headers: {
          Accept: 'application.json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + authToken,
        },
      });
      const json = await resp.json();
      const name = await json.username;
      setUsername(name);
    };
    getUsername();
  }, []);
  

  return (
    <AppBar component='nav' sx={{ backgroundColor: 'black' }}>
      <Toolbar>
        <List sx={{
          display: 'flex',
        }}>
          <ListItem button={true} className='nav-button' onClick={() => navigate('/list')}>
            Portfolio
          </ListItem>
          <ListItem button={true} className='nav-button' onClick={() => navigate('/graph')}>
            Graph
          </ListItem>
          <ListItem button={true} className='nav-button' onClick={() => navigate('/notifications')}>
            Notifications
          </ListItem>
          <ListItem
            sx={{
              position: 'relative',
              left: '200%',
            }}
          >
            {username}
          </ListItem>
          <ListItem 
            button={true} 
            className='nav-button' 
            onClick={logout}
            sx={{
              position: 'relative',
              left: '300%',
            }}
          >
            Logout
          </ListItem>
        </List>
      </Toolbar>
    </AppBar>
  );


}

export default Header; 