import { useState } from "react";
import {
	DndContext,
	DragOverlay,
	MouseSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
	type DragStartEvent,
} from "@dnd-kit/core";
import { TaskContainer } from "./components/task-container";
import { COLUMN, type Id, type Status, type Task } from "./types";
import { Select, SelectItem } from "@heroui/select";
import { arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { TaskCard } from "./components/task-card";
import { ChevronsUpDown, PlusIcon } from "lucide-react";
import { Button } from "@heroui/button";

function App() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [activeTask, setActiveTask] = useState<Task | null>(null);
	const [taskTitle, setTaskTitle] = useState<string>("");
	const [priority, setPriority] = useState<string>("");

	console.log(priority);
	const mouseSensor = useSensor(MouseSensor, {
		activationConstraint: {
			distance: 3,
		},
	});

	const sensors = useSensors(mouseSensor);

	const handleDragEnd = (event: DragEndEvent) => {
		setActiveTask(null);
		const { over, active } = event;
		if (!over) {
			setActiveTask(null);
			return;
		}

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

			setTasks((prevTask) =>
				prevTask.map((item) =>
					item.id === activeTaskId
						? { ...item, status: newStatus }
						: item
				)
			);
		}
		const isOverATask = over.data.current?.type === "Task";
		if (isOverATask) {
			setTasks((prev) => {
				const oldIndex = prev.findIndex(
					(task) => task.id === activeTaskId
				);
				const newIndex = prev.findIndex((task) => task.id === overId);

				const overTask = prev[newIndex];

				let updatedTasks = prev.map((t) =>
					t.id === activeTaskId
						? { ...t, status: overTask.status }
						: t
				);

				updatedTasks = arrayMove(updatedTasks, oldIndex, newIndex);

				return updatedTasks;
			});
		}
	};

	function handleDragStart(event: DragStartEvent) {
		const { active } = event;
		const activeId = active.id as Id;
		const draggedTask = tasks.find((t) => t.id === activeId);
		if (draggedTask) {
			setActiveTask(draggedTask);
		}
	}

	function createTask() {
		if (!taskTitle) return;
		const newTask: Task = {
			id: Math.floor(Math.random() * 1001),
			title: taskTitle,
			priority: priority,
			status: "Todo",
		};
		setTasks((prevTask) => [...prevTask, newTask]);
		setTaskTitle("");
	}

	function deleteTask(id: Id) {
		const updateTask = tasks.filter((t) => t.id != id);
		setTasks(updateTask);
	}

	function updateTask(id: Id, newTitle: string) {
		const updatedTask = tasks.map((t) =>
			t.id === id ? { ...t, title: newTitle } : t
		);
		setTasks(updatedTask);
	}

	return (
		<main className=" min-h-screen p-8">
			<h1 className="mb-8 text-3xl font-bold">Kanban Board</h1>
			
			<div className="max-w-2xl  flex flex-row justify-between  border border-gray-200  rounded-xl mb-5 p-4 items-end gap-2 shadow-sm">
				<div className="flex flex-col gap-1.5 w-full">
					<label htmlFor="todo" className="text-sm font-semibold ">
						New Task
					</label>
					<input
						id="todo"
						type="text"
						placeholder="Create Task..."
						className="outline-none  h-10 rounded-xl px-3  py-2 text-sm border border-gray-200 	focus:ring-2
						focus:ring-rose-300
						focus:border-rose-500"
						value={taskTitle}
						onChange={(e) => setTaskTitle(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								createTask();
							}
						}}
					/>
				</div>
				<div className="flex shrink-0 w-36 ">
					<Select
						disableSelectorIconRotation
						label="Priority"
						placeholder="Choose priority"
						labelPlacement="outside"
						variant="bordered"
						radius="md"
						size="sm"
						selectorIcon={
							<ChevronsUpDown className="w-4 h-4 text-gray-400" />
						}
						classNames={{
							label: "text-sm font-semibold text-gray-700",
							trigger:
								"rounded-xl h-10 border border-gray-200 px-3 py-2 text-sm flex items-center justify-between focus:ring-2 focus:ring-rose-300 focus:border-rose-500",
							value: "text-sm text-gray-700",
							listbox:
								"bg-white border border-gray-200 rounded-xl shadow-md",
						}}
						onChange={(e) => setPriority(e.target.value)}
					>
						<SelectItem key="high">high</SelectItem>
						<SelectItem key="medium">medium</SelectItem>
						<SelectItem key="low">low</SelectItem>
					</Select>
				</div>
				<div className=" flex items-center justify-end shrink-0 ">
					<Button
						className=" flex items-center  gap-2 px-4 py-2 bg-rose-500 text-white text-sm  rounded-xl cursor-pointer hover:bg-rose-600"
						onPress={createTask}
						// onClick={createTask}
					>
						<PlusIcon className="w-5 h-5" />
						<span>Add Task</span>
					</Button>
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
							column = {col}
							tasks={tasks.filter(
								(todo) => todo.status === col.title
							)}
							deleteTask={deleteTask}
							onUpdateTask={updateTask}
						/>
					))}
				</div>
				{createPortal(
					<DragOverlay>
						{activeTask ? (
							<TaskCard
								id={activeTask.id}
								title={activeTask.title}
								priority={activeTask.priority}
								deleteTask={deleteTask}
								updateTask={updateTask}
							/>
						) : null}
					</DragOverlay>,
					document.body
				)}
			</DndContext>
		</main>
	);
}

export default App;
