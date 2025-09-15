import Plot from "react-plotly.js";
import { FiniteSet } from "../lib/algebraOfSets/Set";

interface SetsPlotProps {
	sets?: number[][];
}

const SetsPlot: React.FC<SetsPlotProps> = ({ sets }) => {
	const set1 = new FiniteSet([1, 6]);
	return (
		<Plot
			data={[
				{
					y: [1, 1],
					x: [set1.getMin(), set1.getMax()],
					mode: "lines",
					fill: "tozeroy",
					line: { color: "transparent" },
					fillcolor: "rgba(0,100,80,0.3)",
				},
				{
					y: [1, 1],
					x: [3, 9],
					mode: "lines",
					fill: "tozeroy",
					line: { color: "transparent" },
					fillcolor: "rgba(0,100,180,0.3)",
					name: "Filled Area",
				},
			]}
			layout={{
				title: "Sets Plot",
				xaxis: { title: "Values" },
				yaxis: { title: "Set Index", range: [0, 2.5], showticklabels: false },
			}}
		/>
	);
};

export default SetsPlot;
