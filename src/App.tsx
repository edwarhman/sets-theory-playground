import { useState, type DragEvent } from "react";
import { useTranslation } from "react-i18next";
import "./App.css";
import "./components/OperationsSection.css";
import "./components/DragOverlay.css";
import "./components/HelpSection.css";
import "./components/LanguageSwitcher.css";
import SetsPlot from "./components/SetsPlot";
import DraggableSetEditor from "./components/DraggableSetEditor";
import HelpSection from "./components/HelpSection";
import LanguageSwitcher from "./components/LanguageSwitcher";
import type { SetConfig } from "./components/SetEditor";
import { BaseSet, FiniteSet } from "./lib/algebraOfSets/Set";
import { CompoundSet } from "./lib/algebraOfSets/CompoundSet";
import { intersection, union } from "./lib/algebraOfSets/SetOperations";
import { EMPTY_SET } from "./lib/algebraOfSets/constants";
import { IntervalCreate } from "./components/IntervalCreate";

function App() {
	const { t } = useTranslation();
	const [sets, setSets] = useState<SetConfig[]>([]);
	const [isDragMoving, setIsDragMoving] = useState(false);
	const [selectedSets, setSelectedSets] = useState<number[]>([]);

	// Form state for adding new sets

	const addSet = (newSet: SetConfig) => {
		// Validation
		if (!newSet.name.trim()) {
			alert(t("messages.enterName"));
			return;
		}

		if (newSet.intervals[0].min >= newSet.intervals[0].max) {
			alert(t("messages.invalidInterval"));
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
			alert(t("operations.selectAtLeast2", { operation: "union" }));
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
			alert(t("operations.selectAtLeast2", { operation: "intersect" }));
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
			alert(t("operations.intersectionEmpty"));
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
		<>
			<div className="app-header">
				<LanguageSwitcher />
			</div>
			<div className="app-container">
				<div className="controls">
					<HelpSection />
					<div className="editor-section">
						<div className="operations-section">
							<h3>{t("operations.setOperations")}</h3>
							<div className="operations-buttons">
								<button
									onClick={computeUnionFromSelection}
									disabled={selectedSets.length < 2}
									className="operation-button union-button"
									title={t("accessibility.createUnion", {
										count: selectedSets.length,
									})}
									aria-label={t("accessibility.createUnion", {
										count: selectedSets.length,
									})}
								>
									{t("operations.union")} ({selectedSets.length})
								</button>
								<button
									onClick={computeIntersectionFromSelection}
									disabled={selectedSets.length < 2}
									className="operation-button intersection-button"
									title={t("accessibility.createIntersection", {
										count: selectedSets.length,
									})}
									aria-label={t("accessibility.createIntersection", {
										count: selectedSets.length,
									})}
								>
									{t("operations.intersection")} ({selectedSets.length})
								</button>
								<button
									onClick={clearSetSelection}
									className="operation-button clear-button"
									title={t("accessibility.clearSelection")}
									aria-label={t("accessibility.clearSelection")}
								>
									{t("operations.clear")}
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
									title={t("dragDrop.dropZone")}
									aria-label={t("accessibility.dropZoneLabel")}
								>
									<div className="drag-overlay-content">
										<p>{t("dragDrop.dropZone")}</p>
										<p>{t("dragDrop.dropZoneSubtitle")}</p>
									</div>
								</div>
								<div
									className="drag-overlay-cancel"
									onDragOver={handleDragOver}
									onDrop={handleCancelDrop}
									title={t("dragDrop.cancelDrop")}
									aria-label={t("accessibility.cancelZoneLabel")}
								>
									<p>{t("dragDrop.cancelDrop")}</p>
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
		</>
	);
}

export default App;
