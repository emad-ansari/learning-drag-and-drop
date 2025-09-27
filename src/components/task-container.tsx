import type { Task } from "../types";
import { TaskCard } from "./task-card";
import { useDroppable } from "@dnd-kit/core";
interface TaskContainerProps {
	id: string;
	title: string;
	tasks: Task[];
}

export function TaskContainer({ id, title, tasks }: TaskContainerProps) {
	// make it dropable

	const { setNodeRef } = useDroppable({ id });

	return (
		<div
			ref={setNodeRef}
			className="flex flex-col items-center rounded-xl border border-gray-200 px-4 py-2 min-w-48"
		>
			<h2 className="text-xl font-semibold mb-5">{title}</h2>
			<div className="flex flex-col gap-2  w-full">
				{tasks.map((task) => {
					return (
						<TaskCard
							key={task.id}
							id={task.id}
							title={task.title}
						/>
					);
				})}
			</div>
		</div>
	);
}
