import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './Login';
import ListTab from './ListTab';
import reportWebVitals from './reportWebVitals';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const root = ReactDOM.createRoot(document.getElementById('root'));

let data = [{ticker: "GOOG", price: 10, quantity: 5}];
for (let i = 0; i < 5; i++) { data = data.concat(data) };

const theme = createTheme();

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <body>
        <Login />
        {/* <ListTab data={data} /> */}
      </body>
    </ThemeProvider>
  </React.StrictMode>
);


reportWebVitals();
