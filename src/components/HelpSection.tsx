import { useState } from "react";
import "./HelpSection.css";

const HelpSection = () => {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div className="help-section">
			<button
				className="help-toggle"
				onClick={() => setIsExpanded(!isExpanded)}
				aria-expanded={isExpanded}
				title="Click to toggle help instructions"
			>
				<span className="help-icon">❓</span>
				<span className="help-text">How to Use</span>
				<span className={`expand-icon ${isExpanded ? "expanded" : ""}`}>
					{isExpanded ? "▼" : "▶"}
				</span>
			</button>

			{isExpanded && (
				<div className="help-content">
					<div className="help-category">
						<h4>📝 Creating Sets</h4>
						<ul>
							<li>Use the interval creation form to add new sets</li>
							<li>Enter a name and define intervals with min/max values</li>
							<li>Click "Add Set" to create the set</li>
						</ul>
					</div>

					<div className="help-category">
						<h4>🎯 Selecting Sets</h4>
						<p>
							Select sets to perform operations like union and intersection.
						</p>
						<ul>
							<li>Check the boxes next to set names to select them</li>
							<li>Selected sets are highlighted in the visualization</li>
							<li>
								Use the "Union" or "Intersection" buttons to perform operations
								on selected sets
							</li>
							<li>Use "Clear" button to deselect all sets</li>
						</ul>
					</div>

					<div className="help-category">
						<h4>🎲 Set Operations</h4>
						<ul>
							<li>
								<strong>Union (U):</strong> Combines selected sets - shows all
								elements in any set
							</li>
							<li>
								<strong>Intersection (∩):</strong> Shows only elements common to
								all selected sets
							</li>
							<li>Select at least 2 sets before using operations</li>
							<li>Results appear as new sets in the list</li>
						</ul>
					</div>

					<div className="help-category">
						<h4>✏️ Editing Sets</h4>
						<p>
							You can edit existing sets properties anytime by interacting with
							their controls.
						</p>
					</div>

					<div className="help-category">
						<h4>🗑️ Deleting Sets</h4>
						<ul>
							<li>Click the delete button (trash icon) on any set card</li>
							<li>
								Deleted sets are immediately removed from the visualization
							</li>
						</ul>
					</div>

					<div className="help-category">
						<h4>🖱️ Drag & Drop</h4>
						<p>
							Drag & drop allows you to quickly select sets for operations by
							dragging them into the drop zone.
						</p>
						<ul>
							<li>
								<strong>Drag Handle:</strong> Click and hold the six dots (⋮⋮)
								to drag a set
							</li>
							<li>
								<strong>Drop Zone:</strong> Drag sets to the overlay area during
								drag operations
							</li>
							<li>
								<strong>Add to Selection:</strong> Dropping adds the set to
								selected sets for operations
							</li>
							<li>
								<strong>Cancel:</strong> Drop in the red "cancel" area to abort
								the drag
							</li>
							<li>
								The entire set visually follows your mouse during dragging
							</li>
						</ul>
					</div>

					<div className="help-category">
						<h4>📊 Visualization</h4>
						<ul>
							<li>Sets are displayed as colored bars on the number line</li>
							<li>Hover over set names in the plot legend for details</li>
							<li>Use zoom and pan controls to explore the visualization</li>
							<li>
								Download or export the visualization using the camera icon 📷
							</li>
						</ul>
					</div>

					<div className="help-shortcuts">
						<h4>💡 Tips</h4>
						<ul>
							<li>Start by creating 2-3 basic interval sets</li>
							<li>
								Try union and intersection operations to see how they work
							</li>
							<li>Use different colors to distinguish between sets</li>
							<li>Drag sets to quickly select them for operations</li>
						</ul>
					</div>
				</div>
			)}
		</div>
	);
};

export default HelpSection;
