import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { BaseSet, FiniteSet } from "../lib/algebraOfSets/Set";
import { RecycleBinIcon } from "../assets/RecycleBin";
import "./SetEditor.css";

export interface Interval {
	min: number;
	max: number;
}

export interface SetConfig {
	id: number;
	name: string;
	color: string;
	intervals: Interval[];
	computed?: boolean;
	baseSet?: BaseSet; // BaseSet from library
}

interface SetEditorProps {
	set: SetConfig;
	onUpdate: (updatedSet: SetConfig) => void;
	onDelete: () => void;
	isSelected?: boolean;
	onSelectionChange?: (selected: boolean) => void;
}

const SetEditor: FC<SetEditorProps> = ({
	set,
	onUpdate,
	onDelete,
	isSelected = false,
	onSelectionChange,
}) => {
	const { t } = useTranslation();
	if (set.computed) {
		return (
			<div
				className="set-editor computed-set"
				draggable
				onDragStart={(e) =>
					e.dataTransfer.setData("text/plain", set.id.toString())
				}
			>
				<div className="set-editor-main">
					<div className="set-editor-row">
						<input
							type="text"
							value={set.name}
							onChange={(e) => onUpdate({ ...set, name: e.target.value })}
							className="set-name-input"
							placeholder={t("form.namePlaceholder")}
							title={t("form.setName")}
							aria-label={t("accessibility.setName")}
						/>
					</div>
					<div className="set-editor-row">
						<span className="intervals-summary">
							{set.intervals.map((int) => `[${int.min}, ${int.max}]`).join(" ")}
						</span>
						<input
							type="color"
							value={set.color}
							onChange={(e) => onUpdate({ ...set, color: e.target.value })}
							className="color-input"
							title={t("form.color")}
							aria-label={t("accessibility.setColor")}
						/>
					</div>
				</div>
				<div className="set-editor-secondary">
					<input
						type="checkbox"
						checked={isSelected}
						onChange={(e) => onSelectionChange?.(e.target.checked)}
						className="set-selection-checkbox"
						title={t("dragDrop.selectForOperations")}
						aria-label={t("dragDrop.selectForOperations")}
					/>
					<button
						onClick={onDelete}
						className="delete-button"
						title={t("dragDrop.deleteSet")}
						aria-label={t("dragDrop.deleteSet")}
					>
						<RecycleBinIcon />
					</button>
				</div>
			</div>
		);
	}

	const interval = set.intervals[0] || { min: 0, max: 1 };

	return (
		<div
			className="set-editor"
			draggable
			onDragStart={(e) =>
				e.dataTransfer.setData("text/plain", set.id.toString())
			}
		>
			<div className="set-editor-main">
				<div className="set-editor-row">
					<input
						type="text"
						value={set.name}
						onChange={(e) => onUpdate({ ...set, name: e.target.value })}
						placeholder={t("form.namePlaceholder")}
						title={t("form.setName")}
						aria-label={t("accessibility.setName")}
					/>
				</div>
				<div className="set-editor-row">
					<input
						type="number"
						value={interval.min}
						onChange={(e) => {
							const newMin = parseFloat(e.target.value) || 0;
							onUpdate({
								...set,
								intervals: [{ min: newMin, max: interval.max }],
								baseSet: new FiniteSet(newMin, interval.max),
							});
						}}
						placeholder={t("form.min")}
						title={t("form.min")}
						aria-label={t("accessibility.minValue")}
					/>
					<input
						type="number"
						value={interval.max}
						onChange={(e) => {
							const newMax = parseFloat(e.target.value) || 0;
							onUpdate({
								...set,
								intervals: [{ min: interval.min, max: newMax }],
								baseSet: new FiniteSet(interval.min, newMax),
							});
						}}
						placeholder={t("form.max")}
						title={t("form.max")}
						aria-label={t("accessibility.maxValue")}
					/>
					<input
						type="color"
						value={set.color}
						onChange={(e) => onUpdate({ ...set, color: e.target.value })}
						title={t("form.color")}
						aria-label={t("accessibility.setColor")}
					/>
				</div>
			</div>
			<div className="set-editor-secondary">
				<input
					type="checkbox"
					checked={isSelected}
					onChange={(e) => onSelectionChange?.(e.target.checked)}
					className="set-selection-checkbox"
					title={t("dragDrop.selectForOperations")}
					aria-label={t("dragDrop.selectForOperations")}
				/>
				<button
					onClick={onDelete}
					className="delete-button"
					title={t("dragDrop.deleteSet")}
					aria-label={t("dragDrop.deleteSet")}
				>
					<RecycleBinIcon />
				</button>
			</div>
		</div>
	);
};

export default SetEditor;
