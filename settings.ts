import { setBoardColor } from "diagram";
import type XiangqiDiagPlugin from "main";
import { type App, PluginSettingTab, Setting } from "obsidian";

type PieceStyle = "zh_text" | "international";

export type XiangqiDiagPluginSettings = {
	pieceStyle: PieceStyle;
	boardColor: string;
};

export const DEFAULT_SETTINGS: Partial<XiangqiDiagPluginSettings> = {
	pieceStyle: "zh_text",
};

export class XiangqiDiagSettingTab extends PluginSettingTab {
	plugin: XiangqiDiagPlugin;

	constructor(app: App, plugin: XiangqiDiagPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		new Setting(containerEl)
			.setName("Piece type")
			.setDesc("The type of pieces that will be used in the diagram.")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("zh_text", "Chinese font characters")
					.addOption("international", "Internationalised symbols")
					.setValue(this.plugin.settings.pieceStyle)
					.onChange(async (value: PieceStyle) => {
						this.plugin.settings.pieceStyle = value;
						await this.plugin.saveSettings();
					}),
			);
		new Setting(containerEl)
			.setName("Board color")
			.setDesc("Color of the board background.")
			.addColorPicker((color) =>
				color
					.setValue(this.plugin.settings.boardColor)
					.onChange(async (value: string) => {
						this.plugin.settings.boardColor = value;
						await this.plugin.saveSettings();
						setBoardColor(value);
					}),
			);
	}
}
