import "./App.css";
import SetsPlot from "./components/SetsPlot";

function App() {
	const conjunto = new Set([1, 2, 3, 4, 5]);

	return (
		<>
			<SetsPlot
				sets={[
					[1, 2, 3],
					[2, 3, 4],
				]}
			/>
		</>
	);
}

export default App;
