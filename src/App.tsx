import React, { useState } from "react";
import "./App.css";
import SetsPlot from "./components/SetsPlot";
import SetEditor from "./components/SetEditor";
import type { SetConfig } from "./components/SetEditor";
import { BaseSet, FiniteSet } from "./lib/algebraOfSets/Set";
import { CompoundSet } from "./lib/algebraOfSets/CompoundSet";
import { intersection, union } from "./lib/algebraOfSets/SetOperations";
import { EMPTY_SET } from "./lib/algebraOfSets/constants";

function App() {
	const [sets, setSets] = useState<SetConfig[]>([]);
	const [temporarySelected, setTemporarySelected] = useState<number[]>([]);
	const [unionTemporarySelected, setUnionTemporarySelected] = useState<
		number[]
	>([]);

	const addSet = () => {
		setSets([
			...sets,
			{
				id: Date.now(),
				name: "New Set",
				color: "#FF0000",
				intervals: [{ min: 0, max: 1 }],
				computed: false,
				baseSet: new FiniteSet(0, 1),
			},
		]);
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

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		const idString = e.dataTransfer.getData("text/plain");
		const id = parseInt(idString);
		if (isNaN(id) || sets.find((s) => s.id === id)?.computed) return;
		if (!temporarySelected.includes(id)) {
			setTemporarySelected([...temporarySelected, id]);
		}
	};

	const computeIntersection = () => {
		if (temporarySelected.length < 2) {
			alert("Select at least 2 sets to intersect.");
			return;
		}
		const selectedSets = temporarySelected
			.map((id) => sets.find((s) => s.id === id))
			.filter(Boolean) as SetConfig[];
		const selectedBaseSets = selectedSets.map((s) => s.baseSet!.execute());
		const result = intersection(...selectedBaseSets).execute();
		const intervals = extractIntervals(result);
		if (intervals.length === 0) {
			alert("Intersection is empty.");
			setTemporarySelected([]);
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
		setTemporarySelected([]);
	};

	const clearTemporary = () => {
		setTemporarySelected([]);
	};

	const clearUnionTemporary = () => {
		setUnionTemporarySelected([]);
	};

	const handleDropUnion = (e: React.DragEvent) => {
		e.preventDefault();
		const idString = e.dataTransfer.getData("text/plain");
		const id = parseInt(idString);
		if (isNaN(id) || sets.find((s) => s.id === id)?.computed) return;
		if (!unionTemporarySelected.includes(id)) {
			setUnionTemporarySelected([...unionTemporarySelected, id]);
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
		const selectedBaseSets = selectedSets.map((s) => s.baseSet!.execute());
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

	const data = sets.flatMap((set, index) => {
		const opacity = set.computed ? "40" : "80";
		const yLevel = index + 1;
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

	const maxY = sets.length + 1;

	return (
		<div className="app-container">
			<div className="controls">
				<button onClick={addSet} className="add-button">
					Add Set
				</button>
				<div
					className={`drop-zone ${temporarySelected.length > 0 ? "active" : ""}`}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
				>
					{temporarySelected.length === 0 ? (
						"Drop sets here to intersect"
					) : (
						<div>
							<p>Dropped: {temporarySelected.length} sets</p>
							<p>
								{temporarySelected
									.map((id) => sets.find((s) => s.id === id)?.name)
									.join(", ")}
							</p>
							<button onClick={computeIntersection}>
								Compute Intersection
							</button>
							<button onClick={clearTemporary}>Clear</button>
						</div>
					)}
				</div>
				<div
					className={`drop-zone ${unionTemporarySelected.length > 0 ? "active" : ""}`}
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
							<button onClick={computeUnion}>Compute Union</button>
							<button onClick={clearUnionTemporary}>Clear</button>
						</div>
					)}
				</div>
				<div className="sets-list">
					{sets.map((set) => (
						<SetEditor
							key={set.id}
							set={set}
							onUpdate={updateSet}
							onDelete={() => deleteSet(set.id)}
						/>
					))}
				</div>
			</div>
			<div className="plot-container">
				<SetsPlot data={data} maxY={maxY} />
			</div>
		</div>
	);
}

export default App;
