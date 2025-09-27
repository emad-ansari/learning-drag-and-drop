import { GripVertical } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
interface TaskCardProps {
	id: string;
	title: string;
}

export function TaskCard({ id, title }: TaskCardProps) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id,
	});
	const style = {
		transform: CSS.Translate.toString(transform),
	};

	return (
		<div
			className="flex items-center  px-2.5 py-2 gap-3 rounded-xl border border-gray-200 bg-gray-200/50 cursor-move w-full "
			style={style}
			ref={setNodeRef}
			{...listeners}
			{...attributes}
		>
			<GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
			<span className="text-black font-normal">{title}</span>
		</div>
	);
}
