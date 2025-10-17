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
	const [intersectionTemporarySelected, setIntersectionTemporarySelected] =
		useState<number[]>([]);
	const [unionTemporarySelected, setUnionTemporarySelected] = useState<
		number[]
	>([]);
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

	const handleDrop = (e: DragEvent) => {
		e.preventDefault();
		const idString = e.dataTransfer.getData("text/plain");
		const id = parseInt(idString);
		if (isNaN(id)) return;
		if (!intersectionTemporarySelected.includes(id)) {
			setIntersectionTemporarySelected([...intersectionTemporarySelected, id]);
		}
		// Also update the permanent selection state for intersection
		if (!selectedSets.includes(id)) {
			setSelectedSets([...selectedSets, id]);
		}
	};

	const computeIntersection = () => {
		if (intersectionTemporarySelected.length < 2) {
			alert("Select at least 2 sets to intersect.");
			return;
		}
		const selectedSets = intersectionTemporarySelected
			.map((id) => sets.find((s) => s.id === id))
			.filter(Boolean) as SetConfig[];
		const selectedBaseSets = selectedSets.map((s) => {
			// For computed sets, baseSet is already the result, so use it directly
			// For regular sets, baseSet needs to be executed
			if (s.computed && s.baseSet) {
				return s.baseSet;
			}
			return s.baseSet!.execute();
		});
		const result = intersection(...selectedBaseSets).execute();
		const intervals = extractIntervals(result);
		if (intervals.length === 0) {
			alert("Intersection is empty.");
			setIntersectionTemporarySelected([]);
			return;
		}
		const newSet = {
			id: Date.now(),
			name: `Intersection of ${selectedSets.map((s) => s.name).join(", ")}`,
			color: "#800080",
			intervals,
			computed: true,
			baseSet: result,
		};
		setSets([...sets, newSet]);
		setIntersectionTemporarySelected([]);
	};

	const clearTemporary = () => {
		setIntersectionTemporarySelected([]);
		// Also clear from permanent selection if it was only used for intersection
		setSelectedSets((prev) =>
			prev.filter((id) => unionTemporarySelected.includes(id)),
		);
	};

	const clearUnionTemporary = () => {
		setUnionTemporarySelected([]);
		// Also clear from permanent selection if it was only used for union
		setSelectedSets((prev) =>
			prev.filter((id) => intersectionTemporarySelected.includes(id)),
		);
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
		setUnionTemporarySelected([]);
		setIntersectionTemporarySelected([]);
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
			// Also clear drag temporary selections
			setUnionTemporarySelected([]);
			setIntersectionTemporarySelected([]);
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
		// Also clear drag temporary selections since they were used
		setUnionTemporarySelected([]);
		setIntersectionTemporarySelected([]);
	};

	const handleDropUnion = (e: DragEvent) => {
		e.preventDefault();
		const idString = e.dataTransfer.getData("text/plain");
		const id = parseInt(idString);
		if (isNaN(id)) return;
		if (!unionTemporarySelected.includes(id)) {
			setUnionTemporarySelected([...unionTemporarySelected, id]);
		}
		// Also update the permanent selection state for union
		if (!selectedSets.includes(id)) {
			setSelectedSets([...selectedSets, id]);
		}
	};

	const computeUnion = () => {
		if (unionTemporarySelected.length < 2) {
			alert("Select at least 2 sets to union.");
			return;
		}
		const selectedSets = unionTemporarySelected
			.map((id) => sets.find((s) => s.id === id))
			.filter(Boolean) as SetConfig[];
		const selectedBaseSets = selectedSets.map((s) => {
			// For computed sets, baseSet is already the result, so use it directly
			// For regular sets, baseSet needs to be executed
			if (s.computed && s.baseSet) {
				return s.baseSet;
			}
			return s.baseSet!.execute();
		});
		const result = union(...selectedBaseSets).execute();
		const intervals = extractIntervals(result);
		const newSet = {
			id: Date.now(),
			name: `Union of ${selectedSets.map((s) => s.name).join(", ")}`,
			color: "#008000",
			intervals,
			computed: true,
			baseSet: result,
		};
		setSets([...sets, newSet]);
		setUnionTemporarySelected([]);
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
					<div className="interval-create-alignment">
						<IntervalCreate addSet={addSet} />
					</div>
					{sets.length > 0 && (
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
							{selectedSets.length > 0 && (
								<div className="operations-buttons">
									<button
										onClick={computeUnionFromSelection}
										disabled={selectedSets.length < 2}
										className="operation-button union-button"
									>
										Union ({selectedSets.length})
									</button>
									<button
										onClick={computeIntersectionFromSelection}
										disabled={selectedSets.length < 2}
										className="operation-button intersection-button"
									>
										∩ ({selectedSets.length})
									</button>
									<button
										onClick={clearSetSelection}
										className="operation-button clear-button"
									>
										Clear
									</button>
								</div>
							)}
						</div>
					)}
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
				<div className="drop-section">
					<div
						className={`drop-zone ${intersectionTemporarySelected.length > 0 ? "active" : ""} ${isDragMoving ? "mobile-visible" : "mobile-hidden"}`}
						onDragOver={handleDragOver}
						onDrop={handleDrop}
					>
						{intersectionTemporarySelected.length === 0 ? (
							"Drop sets here to intersect"
						) : (
							<div>
								<p>Dropped: {intersectionTemporarySelected.length} sets</p>
								<p>
									{intersectionTemporarySelected
										.map((id) => sets.find((s) => s.id === id)?.name)
										.join(", ")}
								</p>
								<div className="drop-buttons">
									<button onClick={computeIntersection}>Intersect</button>
									<button onClick={clearTemporary}>Clear</button>
								</div>
							</div>
						)}
					</div>
					<div
						className={`drop-zone ${unionTemporarySelected.length > 0 ? "active" : ""} ${isDragMoving ? "mobile-visible" : "mobile-hidden"}`}
						onDragOver={handleDragOver}
						onDrop={handleDropUnion}
					>
						{unionTemporarySelected.length === 0 ? (
							"Drop sets here to union"
						) : (
							<div>
								<p>Dropped: {unionTemporarySelected.length} sets</p>
								<p>
									{unionTemporarySelected
										.map((id) => sets.find((s) => s.id === id)?.name)
										.join(", ")}
								</p>
								<div className="drop-buttons">
									<button onClick={computeUnion}>Union</button>
									<button onClick={clearUnionTemporary}>Clear</button>
								</div>
							</div>
						)}
					</div>
					<div
						className={`drop-zone cancel-zone ${isDragMoving ? "mobile-visible" : "mobile-hidden"}`}
						onDragOver={handleDragOver}
						onDrop={handleCancelDrop}
					>
						Drop here to cancel
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
