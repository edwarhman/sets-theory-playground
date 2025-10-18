import { useState, type DragEvent } from "react";
import "./App.css";
import SetsPlot from "./components/SetsPlot";
import DraggableSetEditor from "./components/DraggableSetEditor";
import type { SetConfig } from "./components/SetEditor";
import { BaseSet, FiniteSet } from "./lib/algebraOfSets/Set";
import { CompoundSet } from "./lib/algebraOfSets/CompoundSet";
import { intersection, union } from "./lib/algebraOfSets/SetOperations";
import { EMPTY_SET } from "./lib/algebraOfSets/constants";
import { IntervalCreate } from "./components/IntervalCreate";

function App() {
	const [sets, setSets] = useState<SetConfig[]>([]);
	const [isDragMoving, setIsDragMoving] = useState(false);
	const [selectedSets, setSelectedSets] = useState<number[]>([]);

	// Form state for adding new sets

	const addSet = (newSet: SetConfig) => {
		// Validation
		if (!newSet.name.trim()) {
			alert("Please enter a set name.");
			return;
		}

		if (newSet.intervals[0].min >= newSet.intervals[0].max) {
			alert("Minimum value must be less than maximum value.");
			return;
		}

		// Add the new set
		setSets([...sets, newSet]);
	};

	const updateSet = (updated: SetConfig) => {
		setSets(sets.map((s) => (s.id === updated.id ? updated : s)));
	};

	const deleteSet = (id: number) => {
		setSets(sets.filter((s) => s.id !== id));
	};

	const extractIntervals = (
		baseSet: BaseSet,
	): { min: number; max: number }[] => {
		if (!baseSet || baseSet === EMPTY_SET) return [];
		if (baseSet instanceof FiniteSet) {
			if (baseSet.isVoid()) return [];
			return [{ min: baseSet.getMin(), max: baseSet.getMax() }];
		}
		if (baseSet instanceof CompoundSet) {
			return baseSet.sets.flatMap((s) => extractIntervals(s.execute()));
		}
		return [];
	};

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
	};

	const handleDragStart = () => {
		// Don't show overlay immediately to avoid interference
	};

	const handleDrag = () => {
		// Show overlay only after drag has actually started moving
		setIsDragMoving(true);
	};

	const handleDragEnd = () => {
		setIsDragMoving(false);
	};

	const handleCancelDrop = (e: DragEvent) => {
		e.preventDefault();
		// Just end the drag operation without any other actions
	};

	const handleDropMerged = (e: DragEvent) => {
		e.preventDefault();
		const idString = e.dataTransfer.getData("text/plain");
		const id = parseInt(idString);
		if (isNaN(id)) return;

		// Also update the permanent selection state
		if (!selectedSets.includes(id)) {
			setSelectedSets([...selectedSets, id]);
		}
	};

	const toggleSetSelection = (id: number) => {
		setSelectedSets((prev) =>
			prev.includes(id) ? prev.filter((setId) => setId !== id) : [...prev, id],
		);
	};

	const clearSetSelection = () => {
		setSelectedSets([]);
	};

	const computeUnionFromSelection = () => {
		if (selectedSets.length < 2) {
			alert("Select at least 2 sets to union.");
			return;
		}
		const selectedSetObjects = selectedSets
			.map((id) => sets.find((s) => s.id === id))
			.filter(Boolean) as SetConfig[];
		const selectedBaseSets = selectedSetObjects.map((s) => {
			if (s.computed && s.baseSet) {
				return s.baseSet;
			}
			return s.baseSet!.execute();
		});
		const result = union(...selectedBaseSets).execute();
		const intervals = extractIntervals(result);
		const newSet = {
			id: Date.now(),
			name: `Union of ${selectedSetObjects.map((s) => s.name).join(", ")}`,
			color: "#008000",
			intervals,
			computed: true,
			baseSet: result,
		};
		setSets([...sets, newSet]);
		setSelectedSets([]);
		// Also clear drag temporary selections since they were used
	};

	const computeIntersectionFromSelection = () => {
		if (selectedSets.length < 2) {
			alert("Select at least 2 sets to intersect.");
			return;
		}
		const selectedSetObjects = selectedSets
			.map((id) => sets.find((s) => s.id === id))
			.filter(Boolean) as SetConfig[];
		const selectedBaseSets = selectedSetObjects.map((s) => {
			if (s.computed && s.baseSet) {
				return s.baseSet;
			}
			return s.baseSet!.execute();
		});
		const result = intersection(...selectedBaseSets).execute();
		const intervals = extractIntervals(result);
		if (intervals.length === 0) {
			alert("Intersection is empty.");
			setSelectedSets([]);
			return;
		}
		const newSet = {
			id: Date.now(),
			name: `Intersection of ${selectedSetObjects.map((s) => s.name).join(", ")}`,
			color: "#800080",
			intervals,
			computed: true,
			baseSet: result,
		};
		setSets([...sets, newSet]);
		setSelectedSets([]);
	};

	const data = sets.flatMap((set) => {
		const opacity = set.computed ? "40" : "80";
		const yLevel = 1;
		const traces = set.intervals.map((int) => ({
			y: [yLevel, yLevel],
			x: [int.min, int.max],
			mode: "lines",
			fill: "tozeroy",
			line: { color: "transparent" },
			fillcolor: set.color + opacity,
			name: set.name,
		}));
		return traces;
	});

	const maxY = 2;

	return (
		<div className="app-container">
			<div className="controls">
				<div className="editor-section">
					<div className="operations-section">
						<h3>Set Operations</h3>
						<div className="sets-selection">
							{sets.map((set) => (
								<label key={set.id} className="set-checkbox-label">
									<input
										type="checkbox"
										checked={selectedSets.includes(set.id)}
										onChange={() => toggleSetSelection(set.id)}
										className="set-checkbox"
									/>
									<span className="set-name" style={{ color: set.color }}>
										{set.name}
									</span>
								</label>
							))}
						</div>
						<div className="operations-buttons">
							<button
								onClick={computeUnionFromSelection}
								disabled={selectedSets.length < 2}
								className="operation-button union-button"
							>
								Union U ({selectedSets.length})
							</button>
							<button
								onClick={computeIntersectionFromSelection}
								disabled={selectedSets.length < 2}
								className="operation-button intersection-button"
							>
								Intersect ∩ ({selectedSets.length})
							</button>
							<button
								onClick={clearSetSelection}
								className="operation-button clear-button"
							>
								Clear
							</button>
						</div>
					</div>
					{/* Merged drop zone overlay - only visible when dragging */}
					{isDragMoving && (
						<div className="drag-overlay-zone">
							<div
								className="drag-overlay-main"
								onDragOver={handleDragOver}
								onDrop={handleDropMerged}
							>
								<div className="drag-overlay-content">
									<p>Drop sets here for set operations</p>
									<p>Supports both Union and Intersection</p>
								</div>
							</div>
							<div
								className="drag-overlay-cancel"
								onDragOver={handleDragOver}
								onDrop={handleCancelDrop}
							>
								<p>Drop here to cancel</p>
							</div>
						</div>
					)}
					<div className="interval-create-alignment">
						<IntervalCreate addSet={addSet} />
					</div>
					<div className="sets-list">
						{sets.map((set) => (
							<DraggableSetEditor
								key={set.id}
								set={set}
								onUpdate={updateSet}
								onDelete={() => deleteSet(set.id)}
								onDragStart={handleDragStart}
								onDrag={handleDrag}
								onDragEnd={handleDragEnd}
								isSelected={selectedSets.includes(set.id)}
								onSelectionChange={() => toggleSetSelection(set.id)}
							/>
						))}
					</div>
				</div>
			</div>
			<div className="plot-container">
				<SetsPlot data={data} maxY={maxY} />
			</div>
		</div>
	);
}

export default App;
