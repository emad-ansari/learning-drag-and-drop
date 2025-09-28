import { useState } from "react";
import { GripVertical, Trash2 } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import type { Id } from "../types";
import { useSortable } from "@dnd-kit/sortable";

interface TaskCardProps {
	id: Id
	title: string;
	deleteTask: (id: Id) => void;
	updateTask: (id: Id, newTitle: string) => void;
}

export function TaskCard({ id, title, deleteTask, updateTask }: TaskCardProps) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id,
		data: {
			type: 'Task'
		}
	});

	const style = {
		transform: CSS.Translate.toString(transform),
		transition
	};
	const [editMode, setEditMode] = useState<boolean>(false);
	const [updatedTitle, setUpdatedTitle] = useState<string>(title);

	return (
		<div
			className="flex items-center  px-2.5 py-2 gap-3 rounded-xl border border-gray-200 bg-gray-200/50 cursor-grab w-full justify-between "
			style={style}
			ref={setNodeRef}
			{...listeners}
			{...attributes}
		>
			<div className="flex flex-row gap-2 items-center ">
				<GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
				{editMode ? (
					<input
						type="text"
						autoFocus
						value={updatedTitle}
						placeholder="Edit task..."
						className="outline-none border border-rose-300 rounded-lg px-2 text-sm py-1"
						onChange={(e) => setUpdatedTitle(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								updateTask(id,  updatedTitle);
								setEditMode(false)
							}
						}}
					/>
				) : (
					<span
						className="text-black font-normal"
						onDoubleClick={() => setEditMode(true)}
					>
						{title}
					</span>
				)}
			</div>
			<button
				className="bg-red-500/20 p-1 rounded-xl cursor-pointer"
				onClick={() => deleteTask(id)}
			>
				<Trash2 className="w-4 h-4  text-red-500" />
			</button>
		</div>
	);
}
