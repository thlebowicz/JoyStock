import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ExpandMore, Clear, Email } from '@mui/icons-material';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CardContent from '@mui/material/CardContent';

function NotificationCard({ notification, deleteNotification }) {

  return (<Card 
  variant='outlined'
  onClick={() => console.log('notif from card ', notification)}
  sx={{
    backgroundColor: '#1A2027',
    borderRadius: 5,
    color: 'white',
    padding: 2,
    userSelect: 'none',
  }}  
  >{notification.notifID}
  <button onClick={() => deleteNotification(notification.notifID)}>Delete</button></Card>);
}

export default NotificationCard;