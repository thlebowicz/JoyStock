import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from '../Header/Header.js';
import StockCard from './StockCard.js';
import './ListTab.css';

function ListTab({ data, addTickerToData, readData }) {

  const [tickerToAdd, setTickerToAdd] = useState('');
  const [quantityToAdd, setQuantityToAdd] = useState(0);

  const handleClick = async (e) => {
    await addTickerToData(tickerToAdd, quantityToAdd);
  }

  return (
    <body>
      <Header />
      <div style={{marginTop: 100}}>
        <Container maxWidth='lg'>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <TextField 
            onChange={(e) => setTickerToAdd(e.target.value)} 
            placeholder='Type a ticker to add to your portfolio'
            style={{
              width: '30%',
              position: 'relative',
              right: '5em',
            }}
          />
          <TextField 
            onChange={(e) => setQuantityToAdd(e.target.value)} 
            placeholder='Quantity to add'
            style={{
              width: '20%',
              position: 'relative',
              right: '2em',
            }}
          />
          <Button variant="contained" style={{marginRight: '2em'}} onClick={handleClick}>Add to Portfolio</Button>
          <Button variant ="outlined" onClick={readData}>Refresh</Button>
        </div>
          {data.map(stock => <StockCard stock={stock} />)}
        </Container>
      </div>
     </body>
  )

}

export default ListTab;