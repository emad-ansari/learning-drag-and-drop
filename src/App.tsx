import { useState } from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { TaskContainer } from "./components/task-container";
import { TASK_SECTION, todos, type Status, type Task } from "./types";

function App() {
	const [task, setTask] = useState<Task[]>(todos);

	const handleDragEnd = (event: DragEndEvent) => {
		const { over, active } = event;
		if (!over) return;
		const activeTaskId = active.id as string;
		let newStatus: Task["status"] = "" as Task["status"];
		TASK_SECTION.forEach((section) => {
			if (section.id === over.id) {
				newStatus = section.title as Status
			}
		});

		setTask((prevTask) =>
			prevTask.map((item) =>
				item.id === activeTaskId ? { ...item, status: newStatus } : item
			)
		);
	};

	return (
		<main className=" min-h-screen p-8">
			<h1 className="mb-8 text-3xl font-bold">Task Kanban</h1>
			<DndContext onDragEnd={handleDragEnd}>
				<div className="flex flex-col md:flex-row gap-4 ">
					{TASK_SECTION.map((section) => (
						<TaskContainer
							key={section.id}
							id={section.id}
							title={section.title}
							tasks={task.filter(
								(todo) => todo.status === section.title
							)}
						/>
					))}
				</div>
			</DndContext>
		</main>
	);
}

export default App;
