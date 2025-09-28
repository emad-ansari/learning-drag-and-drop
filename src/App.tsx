import { useState } from "react";
import {
	DndContext,
	MouseSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
	type DragStartEvent,
} from "@dnd-kit/core";
import { TaskContainer } from "./components/task-container";
import { COLUMN, type Id, type Status, type Task } from "./types";
import { PlusIcon } from "lucide-react";
import { arrayMove } from "@dnd-kit/sortable";

function App() {
	const [task, setTask] = useState<Task[]>([]);
	const [taskTitle, setTaskTitle] = useState<string>("");

	const mouseSensor = useSensor(MouseSensor, {
		activationConstraint: {
			distance: 3,
		},
	});

	const sensors = useSensors(mouseSensor);

	const handleDragEnd = (event: DragEndEvent) => {
		const { over, active } = event;
		if (!over) return;

		
		const isOverAColumn = over.data.current?.type === "Column";
		
		const activeTaskId = active.id as Id;
		const overId = over.id as Id;

		if (activeTaskId === overId) return;

		if (isOverAColumn) {
			let newStatus = "" as Status;
			COLUMN.forEach((section) => {
				if (section.id === over.id) {
					newStatus = section.title as Status;
				}
			});

			setTask((prevTask) =>
				prevTask.map((item) =>
					item.id === activeTaskId
						? { ...item, status: newStatus }
						: item
				)
			);
		}
		const isATask = over.data.current?.type === "Task";
		if (isATask) {
			setTask((t) => {
				const oldIndex = t.findIndex((task) => task.id === activeTaskId);
				const newIndex = t.findIndex((task) => task.id === over.id);
				return arrayMove(t, oldIndex, newIndex);

			})
		}
	};

	function handleDragStart(event: DragStartEvent) {}

	function createTask() {
		if (!taskTitle) return;
		const newTask: Task = {
			id: Math.floor(Math.random() * 1001),
			title: taskTitle,
			status: "Todo",
		};
		setTask((prevTask) => [...prevTask, newTask]);
		setTaskTitle("");
	}

	function deleteTask(id: Id) {
		const updateTask = task.filter((t) => t.id != id);
		setTask(updateTask);
	}

	function updateTask(id: Id, newTitle: string) {
		const updatedTask = task.map((t) =>
			t.id === id ? { ...t, title: newTitle } : t
		);
		setTask(updatedTask);
	}

	return (
		<main className=" min-h-screen p-8">
			<h1 className="mb-8 text-3xl font-bold">Kanban Board</h1>
			<div className="max-w-2xl  flex flex-row justify-between  border border-gray-200  rounded-xl mb-5 p-4 items-end gap-2 shadow-sm">
				<div className="flex flex-col gap-1.5 w-full ">
					<label htmlFor="todo" className="text-sm font-semibold ">
						New Task
					</label>
					<input
						id="todo"
						type="text"
						placeholder="Create Task..."
						className="outline-none  rounded-xl px-3  py-2 text-sm border border-gray-200 focus:ring focus:ring-rose-300"
						value={taskTitle}
						onChange={(e) => setTaskTitle(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								createTask();
							}
						}}
					/>
				</div>
				<div className=" flex items-center justify-end shrink-0 ">
					<button
						className=" flex items-center  gap-2 px-4 py-2 bg-rose-500 text-white text-sm  rounded-xl cursor-pointer hover:bg-rose-600"
						onClick={createTask}
					>
						<PlusIcon className="w-5 h-5" />
						<span>Add Task</span>
					</button>
				</div>
			</div>
			<DndContext
				onDragEnd={handleDragEnd}
				onDragStart={handleDragStart}
				sensors={sensors}
			>
				<div className="flex flex-col md:flex-row gap-4">
					{COLUMN.map((col) => (
						<TaskContainer
							key={col.id}
							id={col.id}
							title={col.title}
							tasks={task.filter(
								(todo) => todo.status === col.title
							)}
							deleteTask={deleteTask}
							onUpdateTask={updateTask}
						/>
					))}
				</div>
			</DndContext>
		</main>
	);
}

export default App;
