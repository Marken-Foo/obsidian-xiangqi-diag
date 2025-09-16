import { setBoardColor, unsetBoardColor, xiangqiDiagHandler } from "diagram";
import { Plugin } from "obsidian";
import {
	DEFAULT_SETTINGS,
	type XiangqiDiagPluginSettings,
	XiangqiDiagSettingTab,
} from "settings";

export default class XiangqiDiagPlugin extends Plugin {
	settings: XiangqiDiagPluginSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new XiangqiDiagSettingTab(this.app, this));
		setBoardColor(this.settings.boardColor);
		this.registerMarkdownCodeBlockProcessor("xiangqi-diag", xiangqiDiagHandler);
	}

	async loadSettings() {
		this.settings = { ...DEFAULT_SETTINGS, ...(await this.loadData()) };
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	onunload(): void {
		unsetBoardColor();
	}
}
