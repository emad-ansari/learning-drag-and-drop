export type Status = "Todo" | "Completed" | "Progress";

export type Id = number | string;

export interface Column {
	id: Id;
	title: string;
}

export interface Task {
	id: Id;
	title: string;
	priority: string;
	status: Status;
}

// export const todos: Task[] = [
// 	{
// 		id: "1",
// 		title: "Finish user onboarding",
// 		status: "Todo",
// 	},
// 	{
// 		id: "2",
// 		title: "Update onboarding workflows",
// 		status: "Progress",
// 	},
// 	{
// 		id: "3",
// 		title: "Conenct time traking with task",
// 		status: "Progress",
// 	},
// 	{
// 		id: "4",
// 		title: "Solve the log issue",
// 		status: "Todo",
// 	},
// 	{
// 		id: "5",
// 		title: "Hold the record on mobile",
// 		status: "Todo",
// 	},
// 	{
// 		id: "6",
// 		title: "Finish Mash site",
// 		status: "Completed",
// 	},
// 	{
// 		id: "7",
// 		title: "Dark mode data picker",
// 		status: "Completed",
// 	},
// ];

export const COLUMN: Column[] = [
	{
		id: "1",
		title: "Todo",
	},
	{
		id: "3",
		title: "Progress",
	},
	{
		id: "2",
		title: "Completed",
	},
];
