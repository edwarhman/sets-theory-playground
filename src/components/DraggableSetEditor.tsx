import React, { useState, useRef } from "react";
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
		// Set drag data
		e.dataTransfer.setData("text/plain", set.id.toString());
		e.dataTransfer.effectAllowed = "move";
	};

	return (
		<div
			className={`draggable-set-wrapper`}
			draggable
			onDragStart={handleDragStart}
		>
			<div className="draggable-section">⋮⋮</div>
			<div className="set-editor-container">
				<SetEditor set={set} onUpdate={onUpdate} onDelete={onDelete} />
			</div>
		</div>
	);
};

export default DraggableSetEditor;
