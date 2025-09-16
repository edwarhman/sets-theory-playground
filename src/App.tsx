import React, { useState } from "react";
import "./App.css";
import SetsPlot from "./components/SetsPlot";
import SetEditor, { SetConfig } from "./components/SetEditor";

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
		fillcolor: set.color + "80",
		name: set.name,
	}));

	return (
		<div style={{ padding: "20px" }}>
			<button
				onClick={addSet}
				style={{
					padding: "10px 20px",
					marginBottom: "20px",
					backgroundColor: "#007bff",
					color: "white",
					border: "none",
					borderRadius: "4px",
					cursor: "pointer",
				}}
			>
				Add Set
			</button>
			{sets.map((set) => (
				<SetEditor
					key={set.id}
					set={set}
					onUpdate={updateSet}
					onDelete={() => deleteSet(set.id)}
				/>
			))}
			<SetsPlot data={data} />
		</div>
	);
}

export default App;
