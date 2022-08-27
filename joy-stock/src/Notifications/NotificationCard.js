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

  const { ticker, price, condition, notifID } = notification; 

  return (
    <Card 
        variant='outlined'
        sx={{
          backgroundColor: '#1A2027',
          border: '1px solid black',
          color: 'white',
          padding: 2,
          userSelect: 'none',
          marginTop: '2em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 5,
        }}  
        >
          <Typography sx={{marginLeft: 5}} variant='h5'>{ticker}</Typography>
          <Typography 
            sx={{
              marginLeft: 5,
              position: 'relative',
              right: '2.8em',
            }} 
            variant='h6'>
            Price {condition === '<=' ? 'below' : 'above'} ${price}
          </Typography>
          <IconButton
            sx={{
              backgroundColor: '#969696',
              '&:hover': {
                backgroundColor: 'gray',
              },
            }}
            onClick={() => deleteNotification(notifID)}
          >
            <Clear />
          </IconButton>
      </Card>
  );
}

export default NotificationCard;