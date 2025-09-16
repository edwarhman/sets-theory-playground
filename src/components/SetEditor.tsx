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
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: "10px",
				padding: "10px",
				border: "1px solid #ccc",
				borderRadius: "4px",
				marginBottom: "10px",
			}}
		>
			<input
				type="text"
				value={set.name}
				onChange={(e) => onUpdate({ ...set, name: e.target.value })}
				placeholder="Set Name"
				style={{ flex: 1, padding: "5px" }}
			/>
			<input
				type="number"
				value={set.min}
				onChange={(e) =>
					onUpdate({ ...set, min: parseFloat(e.target.value) || 0 })
				}
				placeholder="Min"
				style={{ width: "80px", padding: "5px" }}
			/>
			<input
				type="number"
				value={set.max}
				onChange={(e) =>
					onUpdate({ ...set, max: parseFloat(e.target.value) || 0 })
				}
				placeholder="Max"
				style={{ width: "80px", padding: "5px" }}
			/>
			<input
				type="color"
				value={set.color}
				onChange={(e) => onUpdate({ ...set, color: e.target.value })}
				style={{ width: "40px", height: "30px", padding: 0 }}
			/>
			<button
				onClick={onDelete}
				style={{
					padding: "5px 10px",
					backgroundColor: "#ff4444",
					color: "white",
					border: "none",
					borderRadius: "4px",
				}}
			>
				Delete
			</button>
		</div>
	);
};

export default SetEditor;
