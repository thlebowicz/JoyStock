import React, { useContext, useState, useEffect } from 'react';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
} from 'recharts';
import { Context } from '../Context/Context.js';
import Box from '@mui/material/Box';

function Graph({ selectedTickers }) {
	const [dataInterval, setDataInterval] = useState('year');
	const [numPoints, setNumPoints] = useState(10);
	const [allData, setAllData] = useState([]);
	const context = useContext(Context);
	const authToken = context.authToken;

	const getAllData = () => {
		fetch('http://localhost:3000/fetch-graph-data', {
			method: 'POST',
			headers: {
				Accept: 'application.json',
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + authToken,
			},
			body: JSON.stringify({
				numDatapoints: numPoints,
				tickers: selectedTickers,
				interval: dataInterval,
			}),
		})
			.then((response) => response.json())
			.then((json) => {
				setAllData(json);
				console.log('FROM INSIDE GETALLDATA', json);
			});
	};

	useEffect(() => {
		console.log('here');
		const initGraphLoad = async () => {
			await getAllData();
		};
		initGraphLoad();
	}, []);

	const colors = [
		'#F1948A',
		'#D98880',
		'#85C1E9',
		'#BB8FCE',
		'#7FB3D5',
		'#76D7C4',
		'#7DCEA0',
		'#E59866',
		'#B2BABB',
		'#82E0AA',
		'#F8C471',
		'#F7DC6F',
		'#C39BD3',
		'#F0B27A',
		'#D7DBDD',
		'#73C6B6',
		'#BFC9CA',
		'#F4F6F7',
		'#808B96',
		'#85929E',
	];

	const lines = selectedTickers.map((tkr, index) => {
		return (
			<Line
				type="monotone"
				dataKey={tkr}
				stroke={colors[index % colors.length]}
				strokeWidth={3}
			/>
		);
	});

	return (
		<LineChart
			width={1400}
			height={800}
			data={allData}
			margin={{
				top: 5,
				right: 30,
				left: 20,
				bottom: 5,
			}}
		>
			<CartesianGrid strokeDasharray="3 3" />
			<XAxis dataKey="x" />
			<YAxis />
			<Tooltip />
			<Legend />
			{lines}
		</LineChart>
	);
}

export default Graph;
