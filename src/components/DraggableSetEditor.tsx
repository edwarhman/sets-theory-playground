import React from "react";
import SetEditor, { type SetConfig } from "./SetEditor";

interface DraggableSetEditorProps {
	set: SetConfig;
	onUpdate: (updatedSet: SetConfig) => void;
	onDelete: () => void;
}

const DraggableSetEditor: React.FC<DraggableSetEditorProps> = ({
	set,
	onUpdate,
	onDelete,
}) => {
	const handleDragStart = (e: React.DragEvent) => {
		e.dataTransfer.setData("text/plain", set.id.toString());
	};

	return (
		<div className="draggable-set-wrapper">
			<div
				className="draggable-section"
				draggable
				onDragStart={handleDragStart}
			>
				⋮⋮
			</div>
			<div className="set-editor-container">
				<SetEditor set={set} onUpdate={onUpdate} onDelete={onDelete} />
			</div>
		</div>
	);
};

export default DraggableSetEditor;
