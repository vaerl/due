// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Engine } from "./engine";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.debug("Starting due.");
	let engine = new Engine();
	// TODO this does not work
	engine.scanWorkspace();

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
}

// this method is called when your extension is deactivated
export function deactivate() {}
