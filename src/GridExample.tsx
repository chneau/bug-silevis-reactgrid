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
	startLocationIdIsOpen?: boolean;
	endLocationIdIsOpen?: boolean;
};
console.log(dayjs(0).toDate());

const getEntities = (): Entity[] => {
	const datesAndTimes = () => ({
		startDate: dayjs().startOf("d").toDate(),
		startTime: dayjs().startOf("h").toDate(),
		endDate: dayjs().add(2, "d").startOf("d").toDate(),
		endTime: dayjs().add(2, "h").startOf("h").toDate(),
	});
	return [
		{
			name: "job",
			startLocationId: "1",
			endLocationId: "2",
			...datesAndTimes(),
		},
		{
			name: "good 1: 45x pipes",
			startLocationId: "1",
			endLocationId: "2",
			...datesAndTimes(),
		},
		{
			name: "leg 1: Collection",
			startLocationId: "1",
			endLocationId: "3",
			...datesAndTimes(),
		},
		{
			name: "leg 2: Delivery",
			startLocationId: "3",
			endLocationId: "2",
			...datesAndTimes(),
		},
	];
};

const getColumns = (): Column[] => [
	{ columnId: "name", width: 300 },
	{ columnId: "startLocationId", width: 150 },
	{ columnId: "endLocationId", width: 150 },
	{ columnId: "startDate", width: 110 },
	{ columnId: "startTime", width: 90 },
	{ columnId: "endDate", width: 110 },
	{ columnId: "endTime", width: 90 },
];

const timeFormat = new Intl.DateTimeFormat("en-GB", {
	hour: "numeric",
	minute: "numeric",
});
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
				isOpen: entity.startLocationIdIsOpen,
			},
			{
				type: "dropdown",
				selectedValue: entity.endLocationId,
				values: getLocationOptions(),
				isOpen: entity.endLocationIdIsOpen,
			},
			{ type: "date", date: entity.startDate },
			{ type: "time", time: entity.startTime, format: timeFormat },
			{ type: "date", date: entity.endDate },
			{ type: "time", time: entity.endTime, format: timeFormat },
		],
	})),
];
// biome-ignore lint/suspicious/noExplicitAny: any is used to represent the previous state
const applyChanges = (changes: CellChange[], previous: any): Entity[] => {
	for (const change of changes) {
		const index = change.rowId;
		const field = change.columnId;
		const newC = change.newCell;
		const oldC = change.previousCell;
		if (newC.type === "text") {
			previous[index][field] = newC.text;
		} else if (newC.type === "date") {
			previous[index][field] = newC.date;
		} else if (newC.type === "dropdown" && oldC.type === "dropdown") {
			if (newC.selectedValue !== oldC.selectedValue)
				previous[index][field] = newC.selectedValue;
			if (newC.isOpen !== oldC.isOpen)
				previous[index][`${field}IsOpen`] = newC.isOpen;
		} else if (newC.type === "time") {
			previous[index][field] = newC.time;
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
