import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiniteSet } from "../lib/algebraOfSets/Set";
import type { SetConfig } from "./SetEditor";

export interface SetCreateProps {
	addSet: (newSet: SetConfig) => void;
}

export function IntervalCreate({ addSet }: SetCreateProps) {
	const { t } = useTranslation();
	const [newSetName, setNewSetName] = useState(t("form.namePlaceholder"));
	const [newSetMin, setNewSetMin] = useState(0);
	const [newSetMax, setNewSetMax] = useState(1);
	const [newSetColor, setNewSetColor] = useState("#ff0000");

	function handleClick() {
		addSet({
			id: Date.now(),
			name: newSetName.trim(),
			color: newSetColor,
			intervals: [{ min: newSetMin, max: newSetMax }],
			computed: false,
			baseSet: new FiniteSet(newSetMin, newSetMax),
		});
		// Reset form to default values
		setNewSetName(t("form.namePlaceholder"));
		setNewSetMin(0);
		setNewSetMax(1);
		setNewSetColor("#FF0000");
	}
	return (
		<div className="set-editor">
			<div className="set-editor-main">
				<div className="set-editor-row">
					<input
						type="text"
						value={newSetName}
						onChange={(e) => setNewSetName(e.target.value)}
						placeholder={t("form.namePlaceholder")}
					/>
				</div>
				<div className="set-editor-row">
					<input
						type="number"
						value={newSetMin}
						onChange={(e) => setNewSetMin(parseFloat(e.target.value) || 0)}
						placeholder={t("form.min")}
						step="0.1"
					/>
					<input
						type="number"
						value={newSetMax}
						onChange={(e) => setNewSetMax(parseFloat(e.target.value) || 0)}
						placeholder={t("form.max")}
						step="0.1"
					/>
					<input
						type="color"
						value={newSetColor}
						onChange={(e) => setNewSetColor(e.target.value)}
						className="color-input"
					/>
				</div>
			</div>
			<div className="set-editor-secondary">
				<button onClick={handleClick} className="add-button">
					{t("buttons.addSet")}
				</button>
			</div>
		</div>
	);
}
