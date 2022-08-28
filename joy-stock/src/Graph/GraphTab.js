import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from '../Header/Header.js';
import TickerChoices from './TickerChoices.js';

function GraphTab() {
  return (
    <GraphBodyWrapper>
      <div />
      <GraphUIWrapper>
        <TickerChoices></TickerChoices>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipisicing, elit. Sed
          tenetur atque optio sunt officia nobis exercitationem soluta vel,
          magni culpa rerum quia doloribus, mollitia nemo ab quod nostrum
          et voluptatum?
        </div>
      </GraphUIWrapper>
      <div />
    </GraphBodyWrapper>
  );
}

function GraphUIWrapper({ children }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 6fr',
        gridColumnGap: '1rem',
      }}
    >
      {children}
    </Box>
  );
}

function GraphBodyWrapper({ children }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 7fr 1fr',
        marginTop: 10,
      }}
    >
      {children}
    </Box>
  );
}

export default GraphTab;
