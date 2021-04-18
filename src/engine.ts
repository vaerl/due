import { Position, Range, TextEditor, Uri, window, workspace } from "vscode";
import * as fs from "fs";
import { DueDate } from "./dueDate";

export class Engine {
	public dueDates: DueDate[] = new Array();

	// match 11.11.1111 and 11.11.1111-11:11
	public exp = "@\\d\\d\\.\\d\\d\\.\\d\\d\\d\\d(-\\d\\d:\\d\\d)?";

	constructor() {}

	scanWorkspace() {
		console.debug("Scanning the workspace for matches.");
		workspace.findFiles("*").then((files) => {
			console.debug("Found files in workspace: ", files);
			files.forEach(async (file) => {
				// TODO hook into onSave -> call scanFile
				await this.scanFile(file);
			});
			// TODO make the above part complete synchronously
			console.debug("Scanned all files.");
		});
	}

	async scanFile(file: Uri) {
		// TODO this needs some logic to replace or remove existing dueDates, maybe discard all for file?
		// TODO there is some error here when calling it separately for the first time
		if (file.scheme === "file") {
			let text = await this.getFileText(file);

			// match all instances in the extracted text
			const textArray = text.split("\n");
			console.debug("text-array: ", textArray);
			for (let line = 0; line < textArray.length; line++) {
				let match = textArray[line].match(this.exp);

				if (match !== null && match.index !== undefined) {
					console.debug("Matched line: ", match.toString());
					let range = new Range(
						new Position(line, match.index),
						new Position(line, match.index + match[0].length)
					);

					// TODO get todo/text before @
					let date = new DueDate(file, match.toString(), range);
					this.dueDates.push(date);
				}
			}

			console.debug("Done scanning with: ", this.dueDates);
			this.decorate();
		} else {
			console.debug("URI is not a file, ignoring.");
		}
	}

	/**
	 *
	 * @param file file to get the text from
	 * @returns text of the file, might be empty
	 */
	getFileText(file: Uri): Promise<string> {
		let text = "";

		// try getting the text - which might not result in anything
		workspace.textDocuments.forEach((td) => {
			if (td.uri === file) {
				text = td.getText();
			}
		});

		console.debug("Text after getText(): ", text);

		// back this up with this
		if (text === "") {
			console.debug("Text was empty after getText(), trying fs.readFile().");

			return new Promise<string>((success, reject) => {
				fs.readFile(file.path, "utf8", (err, data) => {
					if (data) {
						success(data);
					} else {
						console.error("Could not read the file: ", err);
						reject(err);
					}
				});
			});
		} else {
			return Promise.resolve(text);
		}
	}

	getOpenEditor(): TextEditor {
		return window.visibleTextEditors.filter((editor) =>
			this.dueDates.map((d) => d.uri.path).includes(editor.document.uri.path)
		)[0];
	}

	decorate() {
		// TODO move to method in DueDate
		const decoration = window.createTextEditorDecorationType({
			backgroundColor: "green",
			border: "2px solid white",
		});

		const editor = this.getOpenEditor();

		console.log("Decorating editor:", editor);
		// TODO do this for every dueDate in the current editor, call getDecoration
		editor.setDecorations(
			decoration,
			this.dueDates.map((d) => d.range)
		);
	}
}
