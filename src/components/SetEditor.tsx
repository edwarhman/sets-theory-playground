import React from "react";

export interface SetConfig {
	id: number;
	min: number;
	max: number;
	color: string;
	name: string;
}

interface SetEditorProps {
	set: SetConfig;
	onUpdate: (updatedSet: SetConfig) => void;
	onDelete: () => void;
}

const SetEditor: React.FC<SetEditorProps> = ({ set, onUpdate, onDelete }) => {
	return (
		<div className="set-editor">
			<input
				type="text"
				value={set.name}
				onChange={(e) => onUpdate({ ...set, name: e.target.value })}
				placeholder="Set Name"
			/>
			<input
				type="number"
				value={set.min}
				onChange={(e) =>
					onUpdate({ ...set, min: parseFloat(e.target.value) || 0 })
				}
				placeholder="Min"
			/>
			<input
				type="number"
				value={set.max}
				onChange={(e) =>
					onUpdate({ ...set, max: parseFloat(e.target.value) || 0 })
				}
				placeholder="Max"
			/>
			<input
				type="color"
				value={set.color}
				onChange={(e) => onUpdate({ ...set, color: e.target.value })}
			/>
			<button onClick={onDelete}>Delete</button>
		</div>
	);
};

export default SetEditor;
