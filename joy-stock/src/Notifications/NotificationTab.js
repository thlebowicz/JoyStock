import React, { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from '../Header/Header.js';
import { Context } from '../Context/Context.js';
import NotificationCard from './NotificationCard';

function NotificationTab({ notifications, readNotifications, deleteNotification }) {

  const context = useContext(Context);

  return (
    <body>
      <Header />
      <Container maxWidth="lg">
      <div style={{marginTop: 100}}>
        <Container maxWidth='lg' sx={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '2em',
        }}>
          <Button variant="outlined" onClick={readNotifications}>
              Refresh
          </Button>
        </Container>
        <div style={{
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        {notifications.map((notif) => (
            <NotificationCard
              notification={notif}
              deleteNotification={deleteNotification}
            />
          ))}
        </div>
      </div>
      </Container>
     </body>
  )

}

export default NotificationTab;