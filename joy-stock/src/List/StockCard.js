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
import { ExpandMore, Clear, Email } from '@mui/icons-material';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CardContent from '@mui/material/CardContent';

function StockCard({ stock, deleteTickerFromData, setNotifToggle }) {

  const theme = createTheme();
  const [expanded, setExpanded] = useState(false);

  const {ticker, currPrice, lastDayPrice, revenue, netIncome, basicEPS, assets, equity, liabilities, 
    cfo, cfi, cff, quantity } = stock;

  const handleExpand = () => setExpanded(!expanded);

  const round = (num) => {
    if (!isNaN(parseInt(num))) {
      return num.toFixed(2);
    } else return num;
  }

  const addCommas = (num) => {
    if (num === 'API Limit Reached') {
      return num;
    }
    const str = String(num); 
    if (str.length <= 3) {
      return str;
    } else {
      let ans = str.slice(str.length - 3);
      for (let i = str.length - 3; i >= 0; i -= 3) {
        ans = str.slice(i - 3, i) + ',' + ans;
        if (i <= 2) {
          ans = str.slice(0, i) + ans;
        }
      }
      return ans[0] === ',' ? ans.slice(1) : ans;
    }
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
          <Typography sx={{marginLeft: 5, width: '30%'}} variant='h7'>Total holdings: ${round(quantity * currPrice)}</Typography>
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
            }}
            onClick={() => setNotifToggle(ticker)}
          >
            <Email />
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
          <h3> Financial Metrics </h3>
          <table>
            <tr>
              <td>Revenue:</td>
              <td>${addCommas(revenue)}</td>
              <td>Assets:</td>
              <td>${addCommas(assets)}</td>
              <td>Operating Cash Flow:</td>
              <td>${addCommas(cfo)}</td>
            </tr>
            <tr>
              <td>Net Income:</td>
              <td>${addCommas(netIncome)}</td>
              <td>Equity:</td>
              <td>${addCommas(equity)}</td>
              <td>Investing Cash Flow</td>
              <td>${addCommas(cfi)}</td>
            </tr>
            <tr>
              <td>Basic EPS</td>
              <td>${basicEPS}</td>
              <td>Liabilities:</td>
              <td>${addCommas(liabilities)}</td>
              <td>Financing Cash Flow:</td>
              <td>${addCommas(cff)}</td>
            </tr>
          </table>
        </CardContent>
        </Collapse>
      </Card>
    </div>
  )

}

export default StockCard;