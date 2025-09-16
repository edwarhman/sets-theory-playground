import React, { useState } from "react";
import "./App.css";
import SetsPlot from "./components/SetsPlot";
import SetEditor from "./components/SetEditor";
import type { SetConfig } from "./components/SetEditor";

function App() {
	const [sets, setSets] = useState<SetConfig[]>([]);

	const addSet = () => {
		setSets([
			...sets,
			{
				id: Date.now(),
				min: 0,
				max: 1,
				color: "#FF0000",
				name: "New Set",
			},
		]);
	};

	const updateSet = (updated: SetConfig) => {
		setSets(sets.map((s) => (s.id === updated.id ? updated : s)));
	};

	const deleteSet = (id: number) => {
		setSets(sets.filter((s) => s.id !== id));
	};

	const data = sets.map((set, index) => ({
		y: [1, 1],
		x: [set.min, set.max],
		mode: "lines",
		fill: "tozeroy",
		line: { color: "transparent" },
		fillcolor: set.color,
		name: set.name,
	}));

	return (
		<div className="app-container">
			<div className="controls">
				<button onClick={addSet} className="add-button">
					Add Set
				</button>
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
				<SetsPlot data={data} />
			</div>
		</div>
	);
}

export default App;
