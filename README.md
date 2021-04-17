# due

This is the README for your extension "due". After writing up a brief description, we recommend including the following sections.

## TODO

- [ ] find all occurrences of @xx.xx.xxxx-xx:xx
  - [x] create basic model
  - [ ] create service
    - [ ] find all workspace-files -> [example](https://github.com/ExodiusStudios/vscode-comment-anchors/blob/099ea64289774f1affcfd384b0ca68c3094c9b6a/src/anchorEngine.ts#L746)
    - [ ] add to map if file -> [example](https://github.com/ExodiusStudios/vscode-comment-anchors/blob/099ea64289774f1affcfd384b0ca68c3094c9b6a/src/anchorEngine.ts#L1188)
    - [ ] parse the document for strings matching a date -> [example]()
    - [ ] convert matched strings to actual dates
    - [ ] color matched strings based on difference between now and given date(today, tomorrow, this week, last week)
  - [ ] ignore bad syntax/maybe collect them for later
  - [ ] use on-save-hook to update for the current file
- [ ] color the dates depending on their due-date
- [ ] show all occurrences in a sidebar-tab
  - [ ] sort them by today, tomorrow this week and later
  - [ ] offer context-actions(complete, move to, etc.)
- [ ] make all of the above options configurable

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

- `myExtension.enable`: enable/disable this extension
- `myExtension.thing`: set to `blah` to do something

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

**Note:** You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

- Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
- Toggle preview (`Shift+CMD+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
- Press `Ctrl+Space` (Windows, Linux) or `Cmd+Space` (macOS) to see a list of Markdown snippets

### For more information

- [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
