import type { DragEvent, FC } from "react";
import SetEditor, { type SetConfig } from "./SetEditor";

interface DraggableSetEditorProps {
	set: SetConfig;
	onUpdate: (updatedSet: SetConfig) => void;
	onDelete: () => void;
	onDragStart?: () => void;
	onDrag?: () => void;
	onDragEnd?: () => void;
	isSelected?: boolean;
	onSelectionChange?: (selected: boolean) => void;
}

const DraggableSetEditor: FC<DraggableSetEditorProps> = ({
	set,
	onUpdate,
	onDelete,
	onDragStart,
	onDrag,
	onDragEnd,
	isSelected = false,
	onSelectionChange,
}) => {
	const handleDragStart = (e: DragEvent) => {
		// Set drag data
		e.dataTransfer.setData("text/plain", set.id.toString());
		e.dataTransfer.effectAllowed = "move";
		// Notify parent component that dragging has started
		onDragStart?.();
	};

	const handleDragLocal = () => {
		// Notify parent component that dragging is in progress
		onDrag?.();
	};

	const handleDragEndLocal = () => {
		// Notify parent component that dragging has ended
		onDragEnd?.();
	};

	return (
		<div
			className={`draggable-set-wrapper`}
			draggable
			onDragStart={handleDragStart}
			onDrag={handleDragLocal}
			onDragEnd={handleDragEndLocal}
		>
			<div className="draggable-section">⋮⋮</div>
			<div className="set-editor-container">
				<SetEditor
					set={set}
					onUpdate={onUpdate}
					onDelete={onDelete}
					isSelected={isSelected}
					onSelectionChange={onSelectionChange}
				/>
			</div>
		</div>
	);
};

export default DraggableSetEditor;
