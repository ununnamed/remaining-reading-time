import { App, MarkdownView, Plugin, debounce, Editor, Modal } from "obsidian";
import {
  ReadingTimeSettingsTab,
  ReadingTimeSettings,
  RT_DEFAULT_SETTINGS,
} from "./settings";
import { readingTimeText } from "./helpers";

export default class ReadingTime extends Plugin {
  settings: ReadingTimeSettings;
  statusBar: HTMLElement;

  async onload() {
    await this.loadSettings();

    this.statusBar = this.addStatusBarItem();
    this.statusBar.setText("");

    this.addSettingTab(new ReadingTimeSettingsTab(this.app, this));

    this.addCommand({
      id: "reading-time-editor-command",
      name: "Selected Text",
      editorCallback: (editor: Editor, view: MarkdownView) => {
        new ReadingTimeModal(this.app, editor, this).open();
      },
    });

    this.registerEvent(
      this.app.workspace.on("layout-change", this.calculateReadingTime)
    );
    this.registerEvent(
      this.app.workspace.on("file-open", this.calculateReadingTime)
    );
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", this.calculateReadingTime)
    );
    this.registerEvent(
      this.app.workspace.on(
        "editor-change",
        debounce(this.calculateReadingTime, 500)
      )
    );

    // Добавляем периодическую проверку позиции курсора
    let lastCursorPosition: { line: number; ch: number } | null = null;
    setInterval(() => {
      const mdView = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (mdView?.editor) {
        const cursor = mdView.editor.getCursor();
        if (!lastCursorPosition || cursor.line !== lastCursorPosition.line || cursor.ch !== lastCursorPosition.ch) {
          lastCursorPosition = cursor;
          this.calculateReadingTime();
        }
      }
    }, 500);
  }

  calculateReadingTime = () => {
    const mdView = this.app.workspace.getActiveViewOfType(MarkdownView);

    if (mdView && mdView.editor) {
      const editor = mdView.editor;
      const cursor = editor.getCursor();
      const totalLines = editor.lineCount();
      let textAboveCursor = "";

      // Calculate text above cursor
      for (let i = 0; i < cursor.line; i++) {
        textAboveCursor += editor.getLine(i) + "\n";
      }
      textAboveCursor += editor.getLine(cursor.line).slice(0, cursor.ch);

      const totalText = editor.getValue();
      const progressPercentage = Math.min(
        100,
        Math.round((textAboveCursor.length / totalText.length) * 100)
      );

      // Calculate remaining text
      let textBelowCursor = "";
      for (let i = cursor.line; i < totalLines; i++) {
        textBelowCursor += editor.getLine(i) + "\n";
      }

      const result = readingTimeText(textBelowCursor, this);

      let statusText = `${result}`;
      if (this.settings.showProgressPercentage) {
        statusText += ` (${progressPercentage}%)`;
      }

      this.statusBar.setText(statusText);
    } else {
      this.statusBar.setText("0 min left");
    }
  };

  async loadSettings() {
    this.settings = Object.assign(
      {},
      RT_DEFAULT_SETTINGS,
      await this.loadData()
    ) as ReadingTimeSettings;
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class ReadingTimeModal extends Modal {
  plugin: ReadingTime;
  editor: Editor;

  constructor(app: App, editor: Editor, plugin: ReadingTime) {
    super(app);
    this.editor = editor;
    this.plugin = plugin;
  }

  onOpen() {
    const { contentEl, titleEl } = this;
    titleEl.setText("Reading Time of Selected Text");
    const stats = readingTimeText(this.editor.getSelection(), this.plugin);
    contentEl.setText(`${stats} (at ${this.plugin.settings.readingSpeed} wpm)`);
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}