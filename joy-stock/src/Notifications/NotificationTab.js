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
      <div style={{marginTop: 100}}>
        <Container maxWidth='lg'>
          <button onClick={async () => {
            await readNotifications();

          }}>Read notifs</button>

        </Container>
        <div>
        {notifications.map((notif) => (
            <NotificationCard
              notification={notif}
              deleteNotification={deleteNotification}
            />
          ))}
        </div>
      </div>
     </body>
  )

}

export default NotificationTab;