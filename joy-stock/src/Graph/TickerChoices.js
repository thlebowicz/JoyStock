import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Context } from '../Context/Context.js';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

function TickerChoices() {
	const context = useContext(Context);
	const tickers = context.data.map((entry) => entry.ticker);
	const [selected, setSelected] = useState([]);

	const handleToggle = (tkr) => {
		const alreadyInside = selected.includes(tkr);
		if (!alreadyInside) {
			setSelected([...selected, tkr]);
		} else {
			const newSelected = selected.map((elem) => {
				if (elem != tkr) {
					return elem;
				}
			});
			setSelected(newSelected);
		}
	};

	const rows = tickers.map((ticker, index) => {
		return (
			<ListItem
				key={ticker}
				sx={{
					borderStyle: 'solid',
					borderColor: 'black',
					borderWidth: '3px',
					borderRadius: '10px',
				}}
			>
				<ListItemButton onClick={() => handleToggle(ticker)}>
					<ListItemIcon>
						<Checkbox
							edge="start"
							checked={selected.includes(ticker)}
							tabIndex={-1}
							disableRipple
						/>
					</ListItemIcon>
					<ListItemText id={`${ticker}${index}`} primary={`${ticker}`} />
				</ListItemButton>
			</ListItem>
		);
	});

	return <List sx={{ width: '100%', maxWidth: 360 }}>{rows}</List>;
}

export default TickerChoices;
