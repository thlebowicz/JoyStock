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
import { ExpandMore, Clear } from '@mui/icons-material';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CardContent from '@mui/material/CardContent';

function StockCard({stock, deleteTickerFromData}) {

  const theme = createTheme();
  const [expanded, setExpanded] = useState(false);

  const {ticker, currPrice, lastDayPrice, lastWeekPrice, quantity} = stock;

  const handleExpand = () => setExpanded(!expanded);

  const round = (num) => {
    if (!isNaN(parseInt(num))) {
      return num.toFixed(2);
    } else return num;
  }

  const dailyGain = round(100 * (currPrice / lastDayPrice - 1));

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
          <Typography sx={{marginLeft: 5, width: '9%'}} variant='h6'>{ticker}</Typography>
          <Typography sx={{marginLeft: 5, width: '7%'}} variant='h7'>${round(currPrice)}</Typography>
          <Typography sx={{marginLeft: 5, width: '7%'}} variant='h7'>{quantity} shares</Typography>
          <Typography sx={{marginLeft: 5, width: '15%'}} variant='h7'>Total holdings: ${round(quantity * currPrice)}</Typography>
          <Typography 
            sx={{
                  marginLeft: 5, 
                  width: '10%', 
                  color: dailyGain > 0 ? 'green' : 'red',
                  flexGrow: 1,
                  textAlign: 'right',
                  marginRight: '2em',
            }}
            variant='h7'
          >
              {dailyGain}%</Typography>

          <IconButton
            sx={{
              backgroundColor: '#969696',
              '&:hover': {
                backgroundColor: 'gray',
              },
            }}
            onClick={() => deleteTickerFromData(stock.ticker)}
          >
            <Clear />
          </IconButton>
          
          <IconButton 
            sx={{
              marginLeft: '.5em',
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
          <h3> Weekly and Daily Gain </h3>
          Day: {lastDayPrice}
          Week: {lastWeekPrice}
        </CardContent>
        </Collapse>
      </Card>
    </div>
  )

}

export default StockCard;