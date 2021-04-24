// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { DueConfig } from "./config";
import { DueDateProvider } from "./dueDateProvider";
import { Engine } from "./engine";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.debug("Starting due.");
	let dueDateProviders = DueConfig.getCategories().map(
		(conf) => new DueDateProvider(conf.title)
	);
	let engine = new Engine(dueDateProviders);

	let scanWorkspace = vscode.commands.registerCommand(
		"due.scanWorkspace",
		() => {
			engine.scanWorkspace();
		}
	);
	context.subscriptions.push(scanWorkspace);

	let scanFile = vscode.commands.registerCommand("due.scanFile", () => {
		engine.scanFile(engine.getOpenEditor().document.uri);
	});
	context.subscriptions.push(scanFile);

	// hook into onWillSave to update the document after it has been edited
	vscode.workspace.onWillSaveTextDocument((_event) => {
		engine.scanFile(engine.getOpenEditor().document.uri);
	});

	// TreeView-stuff
	let counter = 1;
	dueDateProviders.forEach((provider) => {
		let id = "due-" + counter++;
		let treeView = vscode.window.createTreeView(id, {
			treeDataProvider: provider,
		});
		treeView.title = provider.status;
		context.subscriptions.push(treeView);
	});

	// scan after everything is set up
	engine.scanWorkspace();
}

// this method is called when your extension is deactivated
export function deactivate() {}
