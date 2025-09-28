import type { Id, Task } from "../types";
import { TaskCard } from "./task-card";
import { SortableContext, useSortable } from "@dnd-kit/sortable";

interface TaskContainerProps {
	id: Id;
	title: string;
	tasks: Task[];
	deleteTask: (id: Id) => void
	onUpdateTask: (id: Id, newTitle: string) => void
}

export function TaskContainer({ id, title, tasks, deleteTask, onUpdateTask }: TaskContainerProps) {
	const { setNodeRef } = useSortable({ 
		id,
		data: {
			type: "Column"
		}
	});

	return (
		<div
			ref={setNodeRef}
			className="flex flex-col items-center rounded-xl border border-gray-200 px-4 py-2 min-w-48 shadow-sm"
		>
			<h2 className="text-xl font-semibold mb-5">{title}</h2>
			<SortableContext items={tasks.map(task => task.id)}>
				<div className="flex flex-col gap-2  w-full">
					{tasks.map((task) => {
						return (
							<TaskCard
								key={task.id}
								id={task.id}
								title={task.title}
								deleteTask={deleteTask}
								updateTask = {onUpdateTask}
							/>
						);
					})}
				</div>
			</SortableContext>
		</div>
	);
}
