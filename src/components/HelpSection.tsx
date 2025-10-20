import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./HelpSection.css";

const HelpSection = () => {
	const { t } = useTranslation();
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div className="help-section">
			<button
				className="help-toggle"
				onClick={() => setIsExpanded(!isExpanded)}
				aria-expanded={isExpanded}
				title={t("app.howToUse")}
			>
				<span className="help-icon">❓</span>
				<span className="help-text">{t("app.howToUse")}</span>
				<span className={`expand-icon ${isExpanded ? "expanded" : ""}`}>
					{isExpanded ? "▼" : "▶"}
				</span>
			</button>

			{isExpanded && (
				<div className="help-content">
					<div className="help-category">
						<h4>📝 {t("help.creatingSets.title")}</h4>
						<ul>
							<li>{t("help.creatingSets.content.0")}</li>
							<li>{t("help.creatingSets.content.1")}</li>
							<li>{t("help.creatingSets.content.2")}</li>
						</ul>
					</div>

					<div className="help-category">
						<h4>🎯 {t("help.selectingSets.title")}</h4>
						<p>{t("help.selectingSets.content.0")}</p>
						<ul>
							<li>{t("help.selectingSets.content.1")}</li>
							<li>{t("help.selectingSets.content.2")}</li>
							<li>{t("help.selectingSets.content.3")}</li>
							<li>{t("help.selectingSets.content.4")}</li>
						</ul>
					</div>

					<div className="help-category">
						<h4>🎲 {t("help.setOperations.title")}</h4>
						<ul>
							<li>{t("help.setOperations.content.0")}</li>
							<li>{t("help.setOperations.content.1")}</li>
							<li>{t("help.setOperations.content.2")}</li>
							<li>{t("help.setOperations.content.3")}</li>
						</ul>
					</div>

					<div className="help-category">
						<h4>✏️ {t("help.editingSets.title")}</h4>
						<ul>
							<li>{t("help.editingSets.content.0")}</li>
							<li>{t("help.editingSets.content.1")}</li>
							<li>{t("help.editingSets.content.2")}</li>
							<li>{t("help.editingSets.content.3")}</li>
						</ul>
					</div>

					<div className="help-category">
						<h4>🗑️ {t("help.deletingSets.title")}</h4>
						<ul>
							<li>{t("help.deletingSets.content.0")}</li>
							<li>{t("help.deletingSets.content.1")}</li>
							<li>{t("help.deletingSets.content.2")}</li>
						</ul>
					</div>

					<div className="help-category">
						<h4>🖱️ {t("help.dragDrop.title")}</h4>
						<p>{t("help.dragDrop.content.0")}</p>
						<ul>
							<li>{t("help.dragDrop.content.1")}</li>
							<li>{t("help.dragDrop.content.2")}</li>
							<li>{t("help.dragDrop.content.3")}</li>
							<li>{t("help.dragDrop.content.4")}</li>
							<li>{t("help.dragDrop.content.5")}</li>
						</ul>
					</div>

					<div className="help-category">
						<h4>📊 {t("help.visualization.title")}</h4>
						<ul>
							<li>{t("help.visualization.content.0")}</li>
							<li>{t("help.visualization.content.1")}</li>
							<li>{t("help.visualization.content.2")}</li>
							<li>{t("help.visualization.content.3")}</li>
						</ul>
					</div>

					<div className="help-shortcuts">
						<h4>💡 {t("help.tips.title")}</h4>
						<ul>
							<li>{t("help.tips.content.0")}</li>
							<li>{t("help.tips.content.1")}</li>
							<li>{t("help.tips.content.2")}</li>
							<li>{t("help.tips.content.3")}</li>
						</ul>
					</div>
				</div>
			)}
		</div>
	);
};

export default HelpSection;
