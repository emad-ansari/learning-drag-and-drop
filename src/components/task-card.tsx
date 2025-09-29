import { useState } from "react";
import { GripVertical, Trash2 } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import type { Id } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { div } from "framer-motion/client";

interface TaskCardProps {
	id: Id;
	title: string;
	priority: string;
	deleteTask: (id: Id) => void;
	updateTask: (id: Id, newTitle: string) => void;
}

export function TaskCard({
	id,
	title,
	priority,
	deleteTask,
	updateTask,
}: TaskCardProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id,
		data: {
			type: "Task",
		},
	});

	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
	};

	const [editMode, setEditMode] = useState<boolean>(false);
	const [updatedTitle, setUpdatedTitle] = useState<string>(title);

	if (isDragging) {
		return (
			<div
				className="flex items-center px-2.5 py-2 gap-3 rounded-xl border border-rose-300 bg-gray-100/60 cursor-grabbing w-full justify-between shadow-md"
				style={style}
				ref={setNodeRef}
			>
				<div className="flex flex-row gap-2 items-center opacity-50">
					<GripVertical className="w-4 h-4 text-gray-300" />
					<span className="text-gray-500 italic">{title}</span>
				</div>
				<div className="w-6 h-6 bg-red-200/40 rounded-lg" />
			</div>
		);
	}

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
								updateTask(id, updatedTitle);
								setEditMode(false);
							}
						}}
					/>
				) : (
					<div className="flex gap-4 items-center">
						<span
							className="text-black font-normal text-nowrap"
							onDoubleClick={() => setEditMode(true)}
						>
							{title}
						</span>
						<div
							className={`flex items-center justify-center rounded-xl px-2 h-5 text-xs font-medium tabular-nums ${
								priority === "high"
									? "bg-red-500/10 text-red-600"
									: priority === "medium"
									? "bg-yellow-500/10 text-yellow-600"
									: "bg-violet-500/10 text-violet-600"
							}`}
						>
							{priority}
						</div>
					</div>
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
