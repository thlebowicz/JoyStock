import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Divider from '@mui/material/Divider';

function TickerChoices({
	selectedTickers,
	setSelectedTickers,
	allSelected,
	setAllSelected,
	tickers,
}) {
	const handleToggle = (tkr) => {
		const alreadyInside = selectedTickers.includes(tkr);
		if (!alreadyInside) {
			setSelectedTickers([...selectedTickers, tkr]);
		} else {
			const newSelected = selectedTickers.map((elem) => {
				if (elem != tkr) {
					return elem;
				}
			});
			setSelectedTickers(newSelected);
		}
		setAllSelected(
			selectedTickers.length === tickers.length ? true : false
		);
	};

	const toggleAll = () => {
		if (!allSelected) {
			setSelectedTickers([...tickers]);
			setAllSelected(true);
		} else {
			setSelectedTickers([]);
			setAllSelected(false);
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
							checked={selectedTickers.includes(ticker)}
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
				<Box>
					<Box
						sx={{
							marginBottom: '-15px',
						}}
					>
						Tickers to Graph
					</Box>
					<Button onClick={() => toggleAll()}>Toggle All</Button>
				</Box>
				<Divider sx={{ backgroundColor: 'white' }} />
			</ListSubheader>
		);
	};

	return (
		<List
			sx={{
				width: '100%',
				maxWidth: 270,
				borderStyle: 'solid',
				borderRadius: '15px',
				backgroundColor: 'black',
				maxHeight: '800px',
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
