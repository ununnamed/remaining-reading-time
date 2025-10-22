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
      id: "reading-time-editor",
      name: "Selected text",
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

    // Update every second - update remaining reading time on scrolling
    let lastScrollTop: number | null = null;
    this.registerInterval(
      window.setInterval(() => {
        const mdView = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!mdView) return;

        const editorEl =
          mdView.contentEl.querySelector(".cm-scroller") ??
          mdView.contentEl.querySelector(".markdown-source-view") ??
          mdView.contentEl;

        if (editorEl) {
          const scrollTop = editorEl.scrollTop;
          if (lastScrollTop === null || scrollTop !== lastScrollTop) {
            lastScrollTop = scrollTop;
            this.calculateReadingTime();
          }
        }
      }, 1000)
    );
  }

  calculateReadingTime = () => {
    const mdView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!mdView || !mdView.editor) {
      this.statusBar.setText("0 min left");
      return;
    }

    const editor = mdView.editor;
    const editorEl =
      mdView.contentEl.querySelector(".cm-scroller") ??
      mdView.contentEl.querySelector(".markdown-source-view") ??
      mdView.contentEl;

    if (!editorEl) {
      this.statusBar.setText("0 min left");
      return;
    }

    const scrollTop = editorEl.scrollTop;
    const scrollHeight = editorEl.scrollHeight;
    const clientHeight = editorEl.clientHeight;

    const scrollProgress = Math.min(
      100,
      Math.round((scrollTop / (scrollHeight - clientHeight)) * 100)
    );

    const totalText = editor.getValue();
    const charsTotal = totalText.length;
    const charsRead = Math.round((charsTotal * (scrollTop / (scrollHeight - clientHeight))));
    const textBelowScroll = totalText.slice(charsRead);

    const result = readingTimeText(textBelowScroll, this);

    // Just time and percents
    let statusText = `${result}`;
    if (this.settings.showProgressPercentage) {
      statusText += ` (${scrollProgress}%)`;
    }

    this.statusBar.setText(statusText);
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
    titleEl.setText("Remaining reading time");
    const stats = readingTimeText(this.editor.getSelection(), this.plugin);
    contentEl.setText(`${stats} (at ${this.plugin.settings.readingSpeed} wpm)`);
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
