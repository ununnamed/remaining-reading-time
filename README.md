# Obsidian Reading Time Plugin

Simple plugin to add an estimated reading time for the selected note to the StatusBar.

![Screenshot](https://raw.githubusercontent.com/avr/obsidian-reading-time/main/images/example.png)
![Screenshot](https://raw.githubusercontent.com/avr/obsidian-reading-time/main/images/settings.png)

<<<<<<< HEAD
## How to install the plugin

- Download the [Latest release](https://github.com/avr/obsidian-reading-time/releases/latest)
- Extract the `obsidian-reading-time` folder from the zip to your vault `<vault>/.obsidian/plugins/`

## Contributing
=======
This plugin is based on great [reading-time plugin](https://github.com/avr/obsidian-reading-time), which focuses primarily on writing and helping users manage note length. While the underlying structure is similar, this version is designed for a different use case — reading.
It estimates the time remaining to finish reading a text (such as articles, notes, or books), providing a smoother reading experience and helping users pace their reading sessions.

In short:
Reading Time Plugin: Optimized for writing and keeping notes concise.
>>>>>>> parent of 3981c6d (Update README.md)

### Development

```
npm install
npm run build
cp main.js manifest.json /path/to/your/vault/.obsidian/plugins/obsidian-reading-time
```

### Release

- After all changes for the release are merged create a new branch for the release
- Update the changelog with new features and fixes
- Run the `version-bump.mjs` script with the new version as an argument
- Commit all changed files and create a pull request
- After the pull request is merged, create a new annotated tag for the release:

```
git checkout main
git pull
git tag -a x.y.z -m "x.y.z"
git push --tags
```

The release will automatically be drafted.