import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './Login/Login';
import ListTab from './List/ListTab';
import GraphTab from './Graph/GraphTab.js';
import NotificationTab from './Notifications/NotificationTab.js';
import reportWebVitals from './reportWebVitals';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));

let data = [{ticker: "GOOG", price: 10, quantity: 5}];
for (let i = 0; i < 5; i++) { data = data.concat(data) };

const theme = createTheme();

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/list' element={<ListTab data={data} />} />
          <Route path='/graph' element={<GraphTab />} />
          <Route path='/notifications' element={<NotificationTab />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
    
  </React.StrictMode>
);


reportWebVitals();
