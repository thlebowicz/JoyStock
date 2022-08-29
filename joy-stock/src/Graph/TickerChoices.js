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
import ListSubheader from '@mui/material/ListSubheader';
import Divider from '@mui/material/Divider';

function TickerChoices() {
	const context = useContext(Context);
	const tickers = context.data.map((entry) => entry.ticker);
	const [selected, setSelected] = useState([...tickers]);

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
					backgroundColor: 'black',
					color: 'white',
				}}
			>
				<ListItemButton onClick={() => handleToggle(ticker)}>
					<ListItemIcon>
						<Checkbox
							edge="start"
							checked={selected.includes(ticker)}
							disableRipple
							sx={{
								color: 'white',
								'&.Mui-checked': {
									color: 'white',
								},
							}}
						/>
					</ListItemIcon>
					<ListItemText id={`${ticker}${index}`} primary={`${ticker}`} />
				</ListItemButton>
			</ListItem>
		);
	});

	const SubHeader = () => {
		return (
			<ListSubheader
				sx={{
					backgroundColor: 'black',
					color: 'white',
					fontSize: '22px',
					textAlign: 'center',
				}}
			>
				Tickers to Graph
				<Divider light/>
			</ListSubheader>
		);
	};

	return (
		<List
			sx={{
				width: '100%',
				maxWidth: 300,
				borderStyle: 'solid',
				borderRadius: '15px',
				backgroundColor: 'black',
				maxHeight: '500px',
				overflow: 'auto',
				padding: '0',
			}}
		>
			<SubHeader>{`Tickers to Graph`}</SubHeader>
			{rows}
		</List>
	);
}

export default TickerChoices;
