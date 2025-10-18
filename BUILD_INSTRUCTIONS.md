### 🛠️ How to Compile the Plugin

1. **Download the source code**

   * Click the green **Code** button on GitHub → **Download ZIP**.
   * Unpack the ZIP file anywhere on your computer.

2. **Open a terminal in the plugin folder**

   * Go to the main folder (where `package.json` is located).
   * Right-click in that folder and select **“Open in Command Line”**, **“Open in Terminal”**, or your system’s equivalent option.

3. **Install dependencies**

   ```cmd
   npm install
   ```

   This installs everything listed in `package.json` — including **esbuild**, **Obsidian**, and **TypeScript**.

4. **Build the plugin**

   ```cmd
   npm run dev
   ```

   After running this, a `main.js` file will appear in your plugin folder.
