import { useState } from "react";
import { FiniteSet } from "../lib/algebraOfSets/Set";
import type { SetConfig } from "./SetEditor";

export interface SetCreateProps {
	addSet: (newSet: SetConfig) => void;
}

export function IntervalCreate({ addSet }: SetCreateProps) {
	const [newSetName, setNewSetName] = useState("New Set");
	const [newSetMin, setNewSetMin] = useState(0);
	const [newSetMax, setNewSetMax] = useState(1);
	const [newSetColor, setNewSetColor] = useState("#ff0000");

	function handleClick() {
		addSet({
			id: Date.now(),
			name: newSetName.trim(),
			color: newSetColor,
			intervals: [{ min: newSetMin, max: newSetMax }],
			computed: false,
			baseSet: new FiniteSet(newSetMin, newSetMax),
		});
		// Reset form to default values
		setNewSetName("New Set");
		setNewSetMin(0);
		setNewSetMax(1);
		setNewSetColor("#FF0000");
	}
	return (
		<div className="set-editor">
			<div className="set-editor-main">
				<div className="set-editor-row">
					<input
						type="text"
						value={newSetName}
						onChange={(e) => setNewSetName(e.target.value)}
						placeholder="Set Name"
					/>
				</div>
				<div className="set-editor-row">
					<input
						type="number"
						value={newSetMin}
						onChange={(e) => setNewSetMin(parseFloat(e.target.value) || 0)}
						placeholder="Min"
						step="0.1"
					/>
					<input
						type="number"
						value={newSetMax}
						onChange={(e) => setNewSetMax(parseFloat(e.target.value) || 0)}
						placeholder="Max"
						step="0.1"
					/>
					<input
						type="color"
						value={newSetColor}
						onChange={(e) => setNewSetColor(e.target.value)}
						className="color-input"
					/>
				</div>
			</div>
			<div className="set-editor-secondary">
				<button onClick={handleClick} className="add-button">
					Add Set
				</button>
			</div>
		</div>
	);
}
