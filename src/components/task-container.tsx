import type { Column, Id, Task } from "../types";
import { TaskCard } from "./task-card";
import { SortableContext, useSortable } from "@dnd-kit/sortable";

interface TaskContainerProps {
	column: Column;
	tasks: Task[];
	deleteTask: (id: Id) => void;
	onUpdateTask: (id: Id, newTitle: string) => void;
}

export function TaskContainer({
	column,
	tasks,
	deleteTask,
	onUpdateTask,
}: TaskContainerProps) {
	const { setNodeRef } = useSortable({
		id: column.id,
		data: {
			type: "Column",
		},
	});

	return (
		<div
			ref={setNodeRef}
			className="flex flex-col items-center rounded-xl border border-gray-200 min-w-48 md:min-w-64 shadow-sm gap-2"
		>
			<div className=" bg-gray-400/50  text-black rounded-tl-xl rounded-tr-xl flex w-full  justify-center justify-items-center py-2">
				<h2 className="text-xl font-semibold ">{column.title}</h2>
			</div>
			<div className="flex w-full px-4 py-2 ">
				<SortableContext items={tasks.map((task) => task.id)}>
					<div className="flex flex-col gap-2 w-full">
						{tasks.map((task) => {
							return (
								<TaskCard
									key={task.id}
									id={task.id}
									title={task.title}
									priority={task.priority}
									deleteTask={deleteTask}
									updateTask={onUpdateTask}
								/>
							);
						})}
					</div>
				</SortableContext>
			</div>
		</div>
	);
}
