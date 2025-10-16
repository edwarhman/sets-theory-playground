import type { FC } from "react";
import { BaseSet, FiniteSet } from "../lib/algebraOfSets/Set";

export interface Interval {
	min: number;
	max: number;
}

export interface SetConfig {
	id: number;
	name: string;
	color: string;
	intervals: Interval[];
	computed?: boolean;
	baseSet?: BaseSet; // BaseSet from library
}

interface SetEditorProps {
	set: SetConfig;
	onUpdate: (updatedSet: SetConfig) => void;
	onDelete: () => void;
}

const SetEditor: FC<SetEditorProps> = ({ set, onUpdate, onDelete }) => {
	if (set.computed) {
		return (
			<div
				className="set-editor computed-set"
				draggable
				onDragStart={(e) =>
					e.dataTransfer.setData("text/plain", set.id.toString())
				}
			>
				<div className="set-editor-row">
					<input
						type="text"
						value={set.name}
						onChange={(e) => onUpdate({ ...set, name: e.target.value })}
						className="set-name-input"
						placeholder="Set Name"
					/>
				</div>
				<div className="set-editor-row">
					<span className="intervals-summary">
						{set.intervals.map((int) => `[${int.min}, ${int.max}]`).join(" ")}
					</span>
					<input
						type="color"
						value={set.color}
						onChange={(e) => onUpdate({ ...set, color: e.target.value })}
						className="color-input"
					/>
				</div>
				<button onClick={onDelete}>Delete</button>
			</div>
		);
	}

	const interval = set.intervals[0] || { min: 0, max: 1 };

	return (
		<div
			className="set-editor"
			draggable
			onDragStart={(e) =>
				e.dataTransfer.setData("text/plain", set.id.toString())
			}
		>
			<div className="set-editor-row">
				<input
					type="text"
					value={set.name}
					onChange={(e) => onUpdate({ ...set, name: e.target.value })}
					placeholder="Set Name"
				/>
			</div>
			<div className="set-editor-row">
				<input
					type="number"
					value={interval.min}
					onChange={(e) => {
						const newMin = parseFloat(e.target.value) || 0;
						onUpdate({
							...set,
							intervals: [{ min: newMin, max: interval.max }],
							baseSet: new FiniteSet(newMin, interval.max),
						});
					}}
					placeholder="Min"
				/>
				<input
					type="number"
					value={interval.max}
					onChange={(e) => {
						const newMax = parseFloat(e.target.value) || 0;
						onUpdate({
							...set,
							intervals: [{ min: interval.min, max: newMax }],
							baseSet: new FiniteSet(interval.min, newMax),
						});
					}}
					placeholder="Max"
				/>
				<input
					type="color"
					value={set.color}
					onChange={(e) => onUpdate({ ...set, color: e.target.value })}
				/>
			</div>
			<button onClick={onDelete}>Delete</button>
		</div>
	);
};

export default SetEditor;
