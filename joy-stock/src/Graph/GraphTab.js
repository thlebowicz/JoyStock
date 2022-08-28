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
      <div>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non
        necessitatibus alias laudantium, maiores. Maxime eaque
        exercitationem quibusdam consequatur voluptatem alias velit. Ad
        neque, harum quos id deleniti, amet molestias. Earum.
      </div>
      <GraphUIWrapper>
        <TickerChoices></TickerChoices>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipisicing, elit. Sed
          tenetur atque optio sunt officia nobis exercitationem soluta vel,
          magni culpa rerum quia doloribus, mollitia nemo ab quod nostrum
          et voluptatum?
        </div>
      </GraphUIWrapper>
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Laudantium, atque incidunt nesciunt facere, nulla aliquid ut, ad
        similique, et est necessitatibus. Nam voluptatum quibusdam ex sint
        porro debitis, non dolore?
      </div>
    </GraphBodyWrapper>
  );
}

function GraphUIWrapper({ children }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 4fr',
        borderStyle: 'solid',
        borderColor: 'blue',
        borderWidth: '5px',
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
        gridTemplateColumns: '1fr 8fr 1fr',
        borderColor: 'red',
        borderWidth: '3px',
        borderStyle: 'solid',
        marginTop: 10,
      }}
    >
      {children}
    </Box>
  );
}

export default GraphTab;
