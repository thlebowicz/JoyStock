import * as React from 'react';
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

function ListTab({data}) {
  return (
    <body>
      <Header />
      <div style={{marginTop: 100}}>
        <Container maxWidth='lg'>
          {data.map(stock => <StockCard stock={stock} />)}
        </Container>
      </div>
     </body>
  )

}

export default ListTab;