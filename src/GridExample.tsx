import {
	type CellChange,
	type Column,
	type OptionType,
	ReactGrid,
	type Row,
} from "@silevis/reactgrid";
import dayjs from "dayjs";
import { useState } from "react";

const getLocationOptions = (): OptionType[] => [
	{ value: "1", label: "New York" },
	{ value: "2", label: "Los Angeles" },
	{ value: "3", label: "Chicago" },
	{ value: "4", label: "Houston" },
	{ value: "5", label: "Phoenix" },
];

type Entity = {
	name: string;
	startLocationId: string;
	endLocationId: string;
	startDate: Date;
	startTime: Date;
	endDate: Date;
	endTime: Date;
};

const getEntities = (): Entity[] => {
	const datesAndTimes = {
		startDate: dayjs().startOf("h").toDate(),
		startTime: dayjs().startOf("h").toDate(),
		endDate: dayjs().startOf("h").add(1, "h").toDate(),
		endTime: dayjs().startOf("h").add(1, "h").toDate(),
	};
	return [
		{
			name: "job",
			startLocationId: "1",
			endLocationId: "2",
			...datesAndTimes,
		},
		{
			name: "good 1: 45x pipes",
			startLocationId: "1",
			endLocationId: "2",
			...datesAndTimes,
		},
		{
			name: "leg 1: Collection",
			startLocationId: "1",
			endLocationId: "3",
			...datesAndTimes,
		},
		{
			name: "leg 2: Delivery",
			startLocationId: "3",
			endLocationId: "2",
			...datesAndTimes,
		},
	];
};

const getColumns = (): Column[] => [
	{ columnId: "name", width: 300 },
	{ columnId: "startLocationId", width: 150 },
	{ columnId: "endLocationId", width: 150 },
	{ columnId: "startDate", width: 80 },
	{ columnId: "startTime", width: 80 },
	{ columnId: "endDate", width: 80 },
	{ columnId: "endTime", width: 80 },
];

const getRows = (entities: Entity[]): Row[] => [
	{
		rowId: "header",
		cells: [
			{ type: "header", text: "Name" },
			{ type: "header", text: "Start Location" },
			{ type: "header", text: "End Location" },
			{ type: "header", text: "Start Date" },
			{ type: "header", text: "Start Time" },
			{ type: "header", text: "End Date" },
			{ type: "header", text: "End Time" },
		],
	},
	...entities.map<Row>((entity, rowId) => ({
		rowId,
		cells: [
			{ type: "text", text: entity.name, nonEditable: true },
			{
				type: "dropdown",
				selectedValue: entity.startLocationId,
				values: getLocationOptions(),
			},
			{
				type: "dropdown",
				selectedValue: entity.endLocationId,
				values: getLocationOptions(),
			},
			{ type: "date", date: entity.startDate },
			{ type: "time", date: entity.startTime },
			{ type: "date", date: entity.endDate },
			{ type: "time", date: entity.endTime },
		],
	})),
];
// biome-ignore lint/suspicious/noExplicitAny: any is used to represent the previous state
const applyChanges = (changes: CellChange[], previous: any): Entity[] => {
	for (const change of changes) {
		const index = change.rowId;
		const field = change.columnId;
		if (change.newCell.type === "text") {
			previous[index][field] = change.newCell.text;
		} else if (change.newCell.type === "date") {
			previous[index][field] = change.newCell.date;
		} else if (change.newCell.type === "dropdown") {
			previous[index][field] = change.newCell.selectedValue;
		} else if (change.newCell.type === "time") {
			previous[index][field] = change.newCell.time;
		} else {
			throw new Error("Invalid cell type");
		}
	}
	return [...previous];
};
export const GridExample = () => {
	const [data, setData] = useState(getEntities());
	const rows = getRows(data);
	const columns = getColumns();
	const handleDataChange = (x: CellChange[]) =>
		setData((y) => applyChanges(x, y));
	return (
		<ReactGrid
			rows={rows}
			columns={columns}
			onCellsChanged={handleDataChange}
			enableFillHandle
			enableRangeSelection
		/>
	);
};
