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
				title: "Sets Plot",
				xaxis: { title: "Values" },
				yaxis: {
					title: "Set Index",
					range: [0, maxY || 4],
					showticklabels: false,
				},
			}}
		/>
	);
};

export default SetsPlot;
