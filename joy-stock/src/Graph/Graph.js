import React, { useContext, useState, useEffect } from 'react';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';
import { Context } from '../Context/Context.js';
import Box from '@mui/material/Box';

function Graph({ selectedTickers }) {
	const [dataInterval, setDataInterval] = useState('day');
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
		const initGraphLoad = async () => {
			await getAllData();
		};
		initGraphLoad();
	}, []);

	const lines = selectedTickers.map((tkr) => {
		return <Line type="monotone" dataKey={tkr} stroke="#82ca9d" />;
	});

	return (
		<LineChart
			width={500}
			height={300}
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
