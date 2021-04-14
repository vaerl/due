// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.debug("Starting due.");

	let disposable = vscode.commands.registerCommand("due.Scan", () => {});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

function initiateWorkspaceScan(): void {
	// const config = this._config!;
	// this.anchorsScanned = true;
	// this.anchorsLoaded = false;

	// Find all files located in this workspace
	vscode.workspace
		// .findFiles(config.workspace.matchFiles, config.workspace.excludeFiles)
		.findFiles("*")
		.then((uris) => {
			// Clear all existing mappings
			// this.anchorMaps.clear();

			// Resolve all matched URIs
			this.loadWorkspace(uris)
				.then(() => {
					if (this._editor) {
						this.addMap(this._editor!.document.uri);
					}

					this.anchorsLoaded = true;
					this.refresh();
				})
				.catch((err) => {
					window.showErrorMessage("Comment Anchors failed to load: " + err);
					AnchorEngine.output(err);
				});
		});

	// // Update workspace tree
	// this._onDidChangeTreeData.fire();
}
