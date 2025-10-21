import { useTranslation } from "react-i18next";
import "./LanguageSwitcher.css";

const LanguageSwitcher = () => {
	const { i18n } = useTranslation();

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
	};

	return (
		<div className="language-switcher">
			<button
				className={`lang-button ${i18n.language === "en" ? "active" : ""}`}
				onClick={() => changeLanguage("en")}
				title="Switch to English"
				aria-label="Switch to English"
			>
				🇺🇸
			</button>
			<button
				className={`lang-button ${i18n.language === "es" ? "active" : ""}`}
				onClick={() => changeLanguage("es")}
				title="Cambiar a Español"
				aria-label="Cambiar a Español"
			>
				🇪🇸
			</button>
		</div>
	);
};

export default LanguageSwitcher;
