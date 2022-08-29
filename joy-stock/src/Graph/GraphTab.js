import * as React from 'react';
import {useContext, useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from '../Header/Header.js';
import TickerChoices from './TickerChoices.js';
import { Context } from '../Context/Context.js';
import Graph from "./Graph.js";

function GraphTab() {
  const context = useContext(Context);
  const tickers = context.data.map((entry) => entry.ticker);
  const [selectedTickers, setSelectedTickers] = useState([...tickers]);
  const [allSelected, setAllSelected] = useState(true);

  return (
    <GraphBodyWrapper>
      <div />
      <GraphUIWrapper>
        <TickerChoices
          selectedTickers={selectedTickers}
          setSelectedTickers={setSelectedTickers}
          allSelected={allSelected}
          setAllSelected={setAllSelected}
          tickers={tickers}
        ></TickerChoices>
        <Graph
                  selectedTickers={selectedTickers}
>
          
        </Graph>
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
