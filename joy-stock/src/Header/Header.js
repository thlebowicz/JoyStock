import React, { useState, useEffect, useContext} from 'react';
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
import {Context} from '../Context/Context.js'; 
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './Header.css';
import {
  useParams,
  useNavigate,
  useLocatio,
} from "react-router-dom";


function Header() {
  const navigate = useNavigate();
  const context = useContext(Context);

  return (
    <AppBar component='nav' sx={{ backgroundColor: 'black' }}>
      <Toolbar>
        <List sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 7fr 1fr 1fr',
          width: '100vw',
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
          <ListItem />
          <ListItem>
            Logged in as: {context.username}
          </ListItem>
          <ListItem 
            button={true} 
            className='nav-button' 
            onClick={context.logout}
            sx={{
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