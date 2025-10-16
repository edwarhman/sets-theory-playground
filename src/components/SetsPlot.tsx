import Plot from "react-plotly.js";

interface DataTrace {
	y: number[];
	x: number[];
	mode: string;
	fill: string;
	line: { color: string };
	fillcolor: string;
	name: string;
}

interface SetsPlotProps {
	data: DataTrace[];
	maxY?: number;
}

const SetsPlot: React.FC<SetsPlotProps> = ({ data, maxY }) => {
	return (
		<Plot
			data={data}
			layout={{
				title: { text: "Sets Plot" },
				xaxis: { title: { text: "Values" } },
				yaxis: {
					title: { text: "Set Index" },
					range: [0, maxY || 4],
					showticklabels: false,
				},
			}}
		/>
	);
};

export default SetsPlot;
