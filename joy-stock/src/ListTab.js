import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from './Header';

function ListTab({data}) {

  return (
    <div>
      <Header />
      <div style={{marginTop: 100}}>{data.map(stock => stock.ticker.concat(' '))}</div>
    </div>
  )

}

export default ListTab;