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
import './StockCard.css';
import { ExpandMore } from '@mui/icons-material';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CardContent from '@mui/material/CardContent';

function StockCard({stock}) {

  const theme = createTheme();
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => setExpanded(!expanded);

  return (
    <div className='main' style={{marginTop: 20}}>
      <Card 
        variant='outlined'
        sx={{
          backgroundColor: '#1A2027',
          borderRadius: 5,
          color: 'white',
          padding: 2,
          userSelect: 'none',
        }}  
        >
        <div style={{
           display: 'flex',
           alignItems: 'center',
        }}>
          <Typography sx={{marginLeft: 5, width: '10%'}} variant='h6'>{stock.ticker}</Typography>
          <Typography sx={{marginLeft: 5, width: '10%'}} variant='h7'>${stock.price}</Typography>
          <Typography sx={{marginLeft: 5, width: '10%'}} variant='h7'>{stock.quantity} shares</Typography>
          <Typography sx={{marginLeft: 5, flexGrow: 1}} variant='h7'>Total holdings: ${stock.quantity * stock.price}</Typography>
          <IconButton 
            sx={{
              backgroundColor: '#969696',
              '&:hover': {
                backgroundColor: 'gray',
              },
              transform: !expanded ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
              }),
            }}
            onClick={handleExpand}
          >   
            <ExpandMore />
          </IconButton>
        </div>
        <Collapse 
          in={expanded} 
          orientation="vertical" 
          timeout="auto" 
          unmountOnExit
        >
        <CardContent>
          <h1>Bello were gonna make it! </h1>
        </CardContent>
        </Collapse>
      </Card>
    </div>
  )

}

export default StockCard;