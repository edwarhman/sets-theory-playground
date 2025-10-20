import type { DragEvent, FC } from "react";
import { useState } from "react";
import SetEditor, { type SetConfig } from "./SetEditor";
import "./DraggableSetEditor.css";

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
	const [isDragging, setIsDragging] = useState(false);

	const handleDragStart = (e: DragEvent) => {
		// Set drag data
		e.dataTransfer.setData("text/plain", set.id.toString());
		e.dataTransfer.effectAllowed = "move";

		// Use the entire wrapper as drag image for better visual feedback
		const wrapper = e.currentTarget.closest(
			".draggable-set-wrapper",
		) as HTMLElement;
		if (wrapper) {
			// Create a clone for the drag image to avoid visual glitches
			const dragImage = wrapper.cloneNode(true) as HTMLElement;
			dragImage.style.transform = "rotate(2deg)";
			dragImage.style.opacity = "0.8";
			dragImage.style.position = "absolute";
			dragImage.style.top = "-1000px";
			dragImage.style.left = "-1000px";
			document.body.appendChild(dragImage);

			e.dataTransfer.setDragImage(
				dragImage,
				e.nativeEvent.offsetX,
				e.nativeEvent.offsetY,
			);

			// Clean up the temporary element after drag starts
			setTimeout(() => {
				if (document.body.contains(dragImage)) {
					document.body.removeChild(dragImage);
				}
			}, 100);
		}

		setIsDragging(true);
		// Notify parent component that dragging has started
		onDragStart?.();
	};

	const handleDragLocal = () => {
		// Notify parent component that dragging is in progress
		onDrag?.();
	};

	const handleDragEndLocal = () => {
		setIsDragging(false);
		// Notify parent component that dragging has ended
		onDragEnd?.();
	};

	return (
		<div className={`draggable-set-wrapper ${isDragging ? "dragging" : ""}`}>
			<div
				className="draggable-section"
				draggable
				onDragStart={handleDragStart}
				onDrag={handleDragLocal}
				onDragEnd={handleDragEndLocal}
			>
				⋮⋮
			</div>
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
